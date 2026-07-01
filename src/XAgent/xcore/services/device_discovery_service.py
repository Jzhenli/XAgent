"""设备发现服务 - BACnet设备和点位自动发现

此模块提供BACnet设备和点位的自动发现功能，包括：
- 点位发现：读取设备对象列表，自动识别点位
- 批量读取优化：分批读取对象属性，避免设备过载
- 数据类型映射：将BACnet对象类型映射为系统内部数据类型
"""

import asyncio
import logging
from typing import Any, Dict, List, Optional, Tuple
from pathlib import Path

logger = logging.getLogger(__name__)

# bacpypes3 availability check
BACNET_AVAILABLE = None
_Application = None
_DeviceObject = None
_NetworkPortObject = None


def _check_bacnet_available():
    """检查bacpypes3库是否可用"""
    global BACNET_AVAILABLE, _Application, _DeviceObject, _NetworkPortObject
    
    if BACNET_AVAILABLE is not None:
        return BACNET_AVAILABLE
    
    try:
        from bacpypes3.app import Application
        from bacpypes3.local.device import DeviceObject
        from bacpypes3.local.networkport import NetworkPortObject
        
        _Application = Application
        _DeviceObject = DeviceObject
        _NetworkPortObject = NetworkPortObject
        BACNET_AVAILABLE = True
    except ImportError:
        BACNET_AVAILABLE = False
        logger.warning(
            "bacpypes3 not installed, BACnet discovery will not work. "
            "Install with: pip install bacpypes3"
        )
    return BACNET_AVAILABLE


class DeviceDiscoveryService:
    """设备发现服务
    
    提供BACnet设备和点位的自动发现功能
    """
    
    # 分批读取配置
    BATCH_SIZE = 50  # 每批读取的对象数量
    BATCH_INTERVAL = 0.2  # 批次间隔（秒）
    MAX_CONCURRENT_BATCHES = 3  # 最大并发批次数
    TOTAL_TIMEOUT = 120  # 总超时时间（秒）
    
    # 数据类型映射规则
    DATA_TYPE_MAPPING = {
        "analogInput": "analog",
        "analogOutput": "analog",
        "analogValue": "analog",
        "binaryInput": "binary",
        "binaryOutput": "binary",
        "binaryValue": "binary",
        "multiStateInput": "multistate",
        "multiStateOutput": "multistate",
        "multiStateValue": "multistate",
    }
    
    # 默认可写性判断
    DEFAULT_WRITABLE_MAPPING = {
        "analogInput": False,
        "analogOutput": True,
        "analogValue": True,
        "binaryInput": False,
        "binaryOutput": True,
        "binaryValue": True,
        "multiStateInput": False,
        "multiStateOutput": True,
        "multiStateValue": True,
    }
    
    def __init__(self, plugin_loader: Any):
        """初始化发现服务
        
        Args:
            plugin_loader: 插件加载器实例
        """
        self.plugin_loader = plugin_loader
        _check_bacnet_available()
    
    async def discover_points(
        self,
        device_asset: str,
        object_types: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """发现设备中的点位
        
        Args:
            device_asset: 设备资产标识
            object_types: 要发现的对象类型列表（可选）
            
        Returns:
            发现结果，包含点位列表和总数
            
        Raises:
            ValueError: 设备不存在或未连接
            RuntimeError: bacpypes3未安装
        """
        if not BACNET_AVAILABLE:
            raise RuntimeError("bacpypes3 library not installed")
        
        # 获取设备插件实例
        plugin_instance = self._get_plugin_instance(device_asset)
        if not plugin_instance:
            raise ValueError(f"Device '{device_asset}' not found or not loaded")
        
        # 检查设备连接状态
        if not plugin_instance.is_connected:
            raise ValueError(f"Device '{device_asset}' is not connected")
        
        try:
            # 读取设备对象列表
            object_list = await self._read_object_list(plugin_instance)
            
            # 过滤对象类型
            if object_types:
                object_list = [
                    obj for obj in object_list
                    if obj[0] in object_types
                ]
            
            # 分批读取对象属性
            points = await self._batch_read_object_properties(
                plugin_instance,
                object_list
            )
            
            return {
                "success": True,
                "points": points,
                "total": len(points)
            }
            
        except Exception as e:
            logger.error(f"Failed to discover points for device '{device_asset}': {e}")
            raise
    
    def _get_plugin_instance(self, device_asset: str) -> Optional[Any]:
        """获取设备插件实例
        
        Args:
            device_asset: 设备资产标识
            
        Returns:
            插件实例，如果不存在则返回None
        """
        plugin_id = f"bacnet_{device_asset}"
        return self.plugin_loader.get_plugin_instance(plugin_id)
    
    async def _read_object_list(
        self,
        plugin_instance: Any
    ) -> List[Tuple[str, int]]:
        """读取设备的对象列表
        
        Args:
            plugin_instance: BACnet插件实例
            
        Returns:
            对象列表，格式为 [(object_type, instance), ...]
        """
        try:
            # 使用插件的方法读取objectList属性
            # 这里假设插件有相应的方法，如果没有需要实现
            if hasattr(plugin_instance, 'read_object_list'):
                object_list = await plugin_instance.read_object_list()
            else:
                # 降级方案：需要实现读取objectList的方法
                # 暂时返回空列表，实际实现时需要补充
                logger.warning(
                    f"Plugin instance does not have 'read_object_list' method. "
                    f"This needs to be implemented in the BACnet plugin."
                )
                object_list = []
            
            return object_list
            
        except Exception as e:
            logger.error(f"Failed to read object list: {e}")
            raise
    
    async def _batch_read_object_properties(
        self,
        plugin_instance: Any,
        object_list: List[Tuple[str, int]]
    ) -> List[Dict[str, Any]]:
        """分批读取对象属性
        
        Args:
            plugin_instance: BACnet插件实例
            object_list: 对象列表
            
        Returns:
            点位信息列表
        """
        if not object_list:
            return []
        
        points = []
        total_objects = len(object_list)
        
        # 分批处理
        batch_count = (total_objects + self.BATCH_SIZE - 1) // self.BATCH_SIZE
        
        for batch_idx in range(batch_count):
            start_idx = batch_idx * self.BATCH_SIZE
            end_idx = min(start_idx + self.BATCH_SIZE, total_objects)
            batch_objects = object_list[start_idx:end_idx]
            
            logger.info(
                f"Reading batch {batch_idx + 1}/{batch_count} "
                f"(objects {start_idx + 1}-{end_idx})"
            )
            
            # 并发读取当前批次的对象属性
            batch_points = await self._read_batch_properties(
                plugin_instance,
                batch_objects
            )
            
            points.extend(batch_points)
            
            # 批次间隔
            if batch_idx < batch_count - 1:
                await asyncio.sleep(self.BATCH_INTERVAL)
        
        return points
    
    async def _read_batch_properties(
        self,
        plugin_instance: Any,
        batch_objects: List[Tuple[str, int]]
    ) -> List[Dict[str, Any]]:
        """并发读取一批对象的属性
        
        Args:
            plugin_instance: BACnet插件实例
            batch_objects: 当前批次的对象列表
            
        Returns:
            当前批次的点位信息
        """
        # 创建并发任务
        tasks = [
            self._read_single_object_properties(
                plugin_instance,
                obj_type,
                obj_instance
            )
            for obj_type, obj_instance in batch_objects
        ]
        
        # 并发执行（限制并发数）
        batch_points = await asyncio.gather(
            *tasks,
            return_exceptions=True
        )
        
        # 过滤成功的结果
        valid_points = []
        for idx, result in enumerate(batch_points):
            if isinstance(result, Exception):
                logger.warning(
                    f"Failed to read properties for object "
                    f"{batch_objects[idx][0]}:{batch_objects[idx][1]}: {result}"
                )
            elif result:
                valid_points.append(result)
        
        return valid_points
    
    async def _read_single_object_properties(
        self,
        plugin_instance: Any,
        object_type: str,
        object_instance: int
    ) -> Optional[Dict[str, Any]]:
        """读取单个对象的属性
        
        Args:
            plugin_instance: BACnet插件实例
            object_type: 对象类型
            object_instance: 对象实例ID
            
        Returns:
            点位信息字典
        """
        try:
            # 读取对象名称
            object_name = await self._read_property(
                plugin_instance,
                object_type,
                object_instance,
                "objectName"
            )
            
            # 读取描述（可选）
            description = await self._read_property(
                plugin_instance,
                object_type,
                object_instance,
                "description",
                optional=True
            )
            
            # 判断可写性
            writable = await self._check_writable(
                plugin_instance,
                object_type,
                object_instance
            )
            
            # 数据类型映射
            data_type = self.DATA_TYPE_MAPPING.get(object_type, "unknown")
            
            return {
                "object_type": object_type,
                "object_instance": object_instance,
                "object_name": object_name or f"{object_type}_{object_instance}",
                "description": description or "",
                "writable": writable,
                "data_type": data_type
            }
            
        except Exception as e:
            logger.debug(
                f"Failed to read properties for {object_type}:{object_instance}: {e}"
            )
            return None
    
    async def _read_property(
        self,
        plugin_instance: Any,
        object_type: str,
        object_instance: int,
        property_name: str,
        optional: bool = False
    ) -> Optional[Any]:
        """读取对象属性
        
        Args:
            plugin_instance: BACnet插件实例
            object_type: 对象类型
            object_instance: 对象实例ID
            property_name: 属性名称
            optional: 是否为可选属性
            
        Returns:
            属性值
        """
        try:
            # 这里需要调用插件的读取方法
            # 暂时返回None，实际实现时需要补充
            if hasattr(plugin_instance, 'read_property'):
                value = await plugin_instance.read_property(
                    object_type,
                    object_instance,
                    property_name
                )
                return value
            else:
                logger.warning(
                    f"Plugin instance does not have 'read_property' method"
                )
                return None
                
        except Exception as e:
            if optional:
                logger.debug(
                    f"Optional property '{property_name}' not available "
                    f"for {object_type}:{object_instance}"
                )
                return None
            else:
                raise
    
    async def _check_writable(
        self,
        plugin_instance: Any,
        object_type: str,
        object_instance: int
    ) -> bool:
        """检查对象是否可写
        
        Args:
            plugin_instance: BACnet插件实例
            object_type: 对象类型
            object_instance: 对象实例ID
            
        Returns:
            是否可写
        """
        # 默认可写性判断（基于对象类型）
        default_writable = self.DEFAULT_WRITABLE_MAPPING.get(object_type, False)
        
        try:
            # 尝试读取 Out_Of_Service 属性（更准确的判断）
            out_of_service = await self._read_property(
                plugin_instance,
                object_type,
                object_instance,
                "outOfService",
                optional=True
            )
            
            if out_of_service is not None:
                # Out_Of_Service 为 True 时，对象可能处于手动模式，可写
                return bool(out_of_service)
            
            # 如果无法读取 Out_Of_Service，使用默认判断
            return default_writable
            
        except Exception:
            # 降级到默认判断
            return default_writable


# 便捷函数
async def discover_bacnet_points(
    plugin_loader: Any,
    device_asset: str,
    object_types: Optional[List[str]] = None
) -> Dict[str, Any]:
    """便捷函数：发现BACnet设备点位
    
    Args:
        plugin_loader: 插件加载器
        device_asset: 设备资产标识
        object_types: 对象类型列表
        
    Returns:
        发现结果
    """
    service = DeviceDiscoveryService(plugin_loader)
    return await service.discover_points(device_asset, object_types)