"""插件生命周期管理模块

负责插件的加载、启动、停止和卸载。
"""

import asyncio
import inspect
import logging
import time
from typing import Any, Dict, Optional

from .types import PluginType, PluginStatus, PluginInfo
from .registry import PluginRegistry
from ..event_bus import EventBus, EventType, Event
from ..scheduler import Scheduler, TaskType
from ..exceptions import PluginLoadError, PluginStartError, PluginStopError

logger = logging.getLogger(__name__)

# 恢复失败后的指数退避参数：30s 起步，每次翻倍，封顶 10 分钟
RECOVERY_BACKOFF_BASE_SECONDS = 30.0
RECOVERY_BACKOFF_MAX_SECONDS = 600.0
# 指数上限：2^10 已远超 max/base，避免长期离线后 2**failures 转 float 溢出
RECOVERY_BACKOFF_MAX_EXPONENT = 10


class PluginLifecycle:
    """插件生命周期管理器
    
    负责管理插件的生命周期，包括加载、启动、停止和卸载。
    """
    
    def __init__(
        self,
        registry: PluginRegistry,
        event_bus: EventBus,
        scheduler: Scheduler,
        storage: Any = None,
        stats_manager: Any = None
    ):
        """初始化生命周期管理器
        
        Args:
            registry: 插件注册表
            event_bus: 事件总线
            scheduler: 调度器
            storage: 存储对象
            stats_manager: 统计管理器
        """
        self.registry = registry
        self.event_bus = event_bus
        self.scheduler = scheduler
        self.storage = storage
        self.stats_manager = stats_manager

        # 恢复退避状态（按 plugin_id 记录失败次数与下次可尝试时间）
        self._recovery_failures: Dict[str, int] = {}
        self._next_recovery_at: Dict[str, float] = {}
    
    async def load_plugin(
        self,
        plugin_type: Any,
        name: str,
        config: Optional[Dict[str, Any]] = None
    ) -> Optional[PluginInfo]:
        """加载插件
        
        支持两种构造模式：
        1. 核心插件模式：构造函数接受 (config, storage, event_bus)
        2. 规则引擎插件模式：无参构造 + initialize(config)
        
        通过检查构造函数签名自动选择合适的构造模式。
        
        Args:
            plugin_type: 插件类型
            name: 插件名称
            config: 插件配置
            
        Returns:
            插件信息，如果加载失败返回None
            
        Raises:
            PluginLoadError: 如果插件类未找到
        """
        plugin_class = self.registry.get_plugin_class(plugin_type, name)
        
        if not plugin_class:
            raise PluginLoadError(name, "Plugin class not found in registry")
        
        plugin_id = self.registry.generate_plugin_id(plugin_type, name, config)
        
        try:
            instance = self._create_plugin_instance(plugin_class, config)
            
            if isinstance(plugin_type, str):
                plugin_type_enum = PluginType(plugin_type)
            else:
                plugin_type_enum = plugin_type
            
            plugin_info = PluginInfo(
                plugin_id=plugin_id,
                name=name,
                plugin_type=plugin_type_enum,
                instance=instance,
                config=config or {}
            )
            
            self.registry.register_plugin_instance(plugin_info)
            logger.info(f"Plugin loaded: {name} ({plugin_id})")
            return plugin_info
            
        except Exception as e:
            logger.error(f"Error loading plugin {name}: {e}")
            raise PluginLoadError(name, str(e)) from e
    
    def _create_plugin_instance(
        self,
        plugin_class: type,
        config: Optional[Dict[str, Any]] = None
    ) -> Any:
        """根据构造函数签名自动选择实例化方式
        
        核心插件（SouthPluginBase/NorthPluginBase）构造函数接受
        (config, storage, event_bus)，而规则引擎插件（RulePlugin/
        DeliveryPlugin/RuleFilterPlugin）使用无参构造 + initialize(config)。
        
        Args:
            plugin_class: 插件类
            config: 插件配置
            
        Returns:
            插件实例
        """
        sig = inspect.signature(plugin_class.__init__)
        params = list(sig.parameters.keys())
        
        core_params = {'config', 'storage', 'event_bus'}
        has_core_params = core_params.issubset(set(params))
        
        if has_core_params:
            instance = plugin_class(
                config=config or {},
                storage=self.storage,
                event_bus=self.event_bus
            )
            
            if self.stats_manager and hasattr(instance, 'set_stats_manager'):
                instance.set_stats_manager(self.stats_manager)
                logger.debug(f"Stats manager injected for {plugin_class.__name__}")
        else:
            instance = plugin_class()
            if config and hasattr(instance, 'initialize'):
                instance.initialize(config)
        
        return instance
    
    async def start_plugin(self, plugin_id: str) -> bool:
        """启动插件
        
        Args:
            plugin_id: 插件ID
            
        Returns:
            如果启动成功返回True
            
        Raises:
            PluginStartError: 如果启动失败
        """
        plugin_info = self.registry.get_plugin(plugin_id)
        
        if not plugin_info:
            logger.warning(f"Plugin {plugin_id} not found")
            return False
        
        if plugin_info.status == PluginStatus.RUNNING:
            return True
        
        plugin_info.status = PluginStatus.STARTING
        await self._publish_status_change(plugin_info)
        
        try:
            instance = plugin_info.instance
            
            if hasattr(instance, 'start'):
                if asyncio.iscoroutinefunction(instance.start):
                    await instance.start()
                else:
                    instance.start()
            
            if hasattr(instance, 'poll') and plugin_info.plugin_type == PluginType.SOUTH:
                interval = plugin_info.config.get('interval', 1)
                task_id = self.scheduler.add_task(
                    name=f"poll_{plugin_id}",
                    callback=instance.poll,
                    task_type=TaskType.POLLING,
                    interval=interval
                )
                plugin_info.task_id = task_id
                await self.scheduler.start_task(task_id)
            
            plugin_info.status = PluginStatus.RUNNING
            plugin_info.error_message = None
            # 插件成功启动后重置恢复退避（覆盖手动重启场景）
            self._recovery_failures.pop(plugin_info.plugin_id, None)
            self._next_recovery_at.pop(plugin_info.plugin_id, None)
            await self._publish_status_change(plugin_info)
            logger.info(f"Plugin started: {plugin_info.name}")
            return True
            
        except Exception as e:
            plugin_info.status = PluginStatus.ERROR
            plugin_info.error_message = str(e)
            await self._publish_status_change(plugin_info)
            logger.error(f"Error starting plugin {plugin_info.name}: {e}")
            raise PluginStartError(plugin_info.name, str(e)) from e
    
    async def stop_plugin(self, plugin_id: str) -> bool:
        """停止插件
        
        Args:
            plugin_id: 插件ID
            
        Returns:
            如果停止成功返回True
            
        Raises:
            PluginStopError: 如果停止失败
        """
        plugin_info = self.registry.get_plugin(plugin_id)
        
        if not plugin_info:
            return False
        
        try:
            if plugin_info.task_id:
                try:
                    await self.scheduler.stop_task(plugin_info.task_id)
                    logger.info(f"Scheduler task stopped: {plugin_info.task_id}")
                except Exception as e:
                    logger.warning(f"Error stopping scheduler task {plugin_info.task_id}: {e}")
                plugin_info.task_id = None
            
            instance = plugin_info.instance
            
            if hasattr(instance, 'stop'):
                if asyncio.iscoroutinefunction(instance.stop):
                    await instance.stop()
                else:
                    instance.stop()
            
            plugin_info.status = PluginStatus.STOPPED
            await self._publish_status_change(plugin_info)
            logger.info(f"Plugin stopped: {plugin_info.name}")
            return True
            
        except Exception as e:
            plugin_info.status = PluginStatus.ERROR
            plugin_info.error_message = str(e)
            logger.error(f"Error stopping plugin {plugin_info.name}: {e}")
            raise PluginStopError(plugin_info.name, str(e)) from e
    
    async def unload_plugin(self, plugin_id: str) -> bool:
        """卸载插件
        
        Args:
            plugin_id: 插件ID
            
        Returns:
            如果卸载成功返回True
        """
        try:
            await self.stop_plugin(plugin_id)
        finally:
            # 即使停止失败也清理该插件的恢复退避状态
            self._recovery_failures.pop(plugin_id, None)
            self._next_recovery_at.pop(plugin_id, None)

        if self.registry.unregister_plugin_instance(plugin_id):
            logger.info(f"Plugin unloaded: {plugin_id}")
            return True
        return False
    
    async def stop_all_plugins(self) -> None:
        """停止所有插件"""
        all_plugins = self.registry.get_all_plugins()
        for plugin_info in all_plugins:
            try:
                await self.stop_plugin(plugin_info.plugin_id)
            except Exception as e:
                logger.error(f"Error stopping plugin {plugin_info.plugin_id}: {e}")
    
    async def recover_failed_plugins(self) -> None:
        """恢复失败的插件

        使用指数退避避免设备长时间离线时反复重试（每次重试都伴随
        建连接/心跳/关闭的完整开销），成功后重置退避。
        """
        failed_plugins = self.registry.get_failed_plugins()

        for plugin_info in failed_plugins:
            if time.monotonic() < self._next_recovery_at.get(plugin_info.plugin_id, 0.0):
                continue

            logger.info(f"Attempting to recover failed plugin: {plugin_info.name}")

            try:
                if await self.start_plugin(plugin_info.plugin_id):
                    # 退避状态已由 start_plugin 成功路径重置
                    logger.info(f"Successfully recovered plugin: {plugin_info.name}")
                else:
                    self._register_recovery_failure(plugin_info)
            except Exception as e:
                self._register_recovery_failure(plugin_info)
                logger.error(f"Error recovering plugin {plugin_info.name}: {e}")

    def _register_recovery_failure(self, plugin_info: PluginInfo) -> None:
        """记录恢复失败，按指数退避安排下次恢复时间"""
        failures = self._recovery_failures.get(plugin_info.plugin_id, 0) + 1
        self._recovery_failures[plugin_info.plugin_id] = failures
        exponent = min(failures - 1, RECOVERY_BACKOFF_MAX_EXPONENT)
        delay = min(
            RECOVERY_BACKOFF_BASE_SECONDS * (2 ** exponent),
            RECOVERY_BACKOFF_MAX_SECONDS,
        )
        self._next_recovery_at[plugin_info.plugin_id] = time.monotonic() + delay
        logger.warning(
            f"Plugin {plugin_info.name} recovery failed, "
            f"next attempt in {delay:.0f}s (failures={failures})"
        )
    
    async def _publish_status_change(self, plugin_info: PluginInfo) -> None:
        """发布插件状态变更事件
        
        Args:
            plugin_info: 插件信息
        """
        event = Event(
            event_type=EventType.PLUGIN_STATUS_CHANGED,
            data={
                "plugin_id": plugin_info.plugin_id,
                "name": plugin_info.name,
                "type": plugin_info.plugin_type.value,
                "status": plugin_info.status.value,
                "error": plugin_info.error_message
            }
        )
        await self.event_bus.publish(event)
