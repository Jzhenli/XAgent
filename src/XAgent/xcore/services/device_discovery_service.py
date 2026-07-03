"""设备发现服务 - BACnet设备和点位自动发现

此模块提供BACnet设备和点位的自动发现功能，包括：
- 点位发现：读取设备对象列表，自动识别点位
- 批量读取优化：分批读取对象属性，避免设备过载
- 数据类型映射：将BACnet对象类型映射为系统内部数据类型
"""

import asyncio
import logging
import re
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

    # BACnet标准对象类型名称映射（带连字符） -> 系统内部驼峰格式
    OBJECT_TYPE_NAME_MAPPING = {
        "analog-input": "analogInput",
        "analog-output": "analogOutput",
        "analog-value": "analogValue",
        "binary-input": "binaryInput",
        "binary-output": "binaryOutput",
        "binary-value": "binaryValue",
        "multi-state-input": "multiStateInput",
        "multi-state-output": "multiStateOutput",
        "multi-state-value": "multiStateValue",
        # 其他对象类型（不是点位，但可能出现在objectList中）
        "device": "device",
        "network-port": "networkPort",
        "file": "file",
        "calendar": "calendar",
        "schedule": "schedule",
        "event-log": "eventLog",
        "trend-log": "trendLog",
        "trend-log-multiple": "trendLogMultiple",
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
        device_status = plugin_instance.get_device_status()
        logger.info(
            f"Device status check: asset={device_asset}, "
            f"status={device_status}, "
            f"plugin_type={type(plugin_instance).__name__}"
        )

        if device_status != "online":
            raise ValueError(f"Device '{device_asset}' is not connected (status: {device_status})")

        # 检查插件是否有必要的属性和方法
        if not hasattr(plugin_instance, 'read_object_list'):
            raise RuntimeError(
                f"Plugin instance does not have 'read_object_list' method. "
                f"This method must be implemented in the BACnet plugin."
            )
        
        try:
            # 读取设备对象列表
            object_list = await self._read_object_list(plugin_instance)
            logger.info(f"Read {len(object_list)} objects from device")

            # 转换对象类型名称格式
            normalized_object_list = [
                (self._normalize_object_type(obj_type), obj_instance)
                for obj_type, obj_instance in object_list
            ]

            # 过滤对象类型
            if object_types:
                normalized_object_list = [
                    obj for obj in normalized_object_list
                    if obj[0] in object_types
                ]
                logger.info(f"Filtered to {len(normalized_object_list)} objects matching types: {object_types}")

            # 分批读取对象属性
            logger.info(f"Reading properties for {len(normalized_object_list)} objects...")
            points = await self._batch_read_object_properties(
                plugin_instance,
                normalized_object_list
            )
            logger.info(f"Discovered {len(points)} points")

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
        plugin_info = self.plugin_loader.get_plugin(plugin_id)
        if plugin_info:
            return plugin_info.instance
        return None
    
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
            if hasattr(plugin_instance, 'read_object_list'):
                object_list = await plugin_instance.read_object_list()
                logger.debug(f"Object types: {[obj[0] for obj in object_list[:5]]}")
                return object_list
            else:
                logger.warning("Plugin missing 'read_object_list' method")
                return []

        except Exception as e:
            logger.error(f"Failed to read object list: {e}", exc_info=True)
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
        batch_count = (len(object_list) + self.BATCH_SIZE - 1) // self.BATCH_SIZE

        for batch_idx in range(batch_count):
            start_idx = batch_idx * self.BATCH_SIZE
            end_idx = min(start_idx + self.BATCH_SIZE, len(object_list))
            batch_objects = object_list[start_idx:end_idx]

            batch_points = await self._read_batch_properties(
                plugin_instance,
                batch_objects
            )

            points.extend(batch_points)

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
        tasks = [
            self._read_single_object_properties(
                plugin_instance,
                obj_type,
                obj_instance
            )
            for obj_type, obj_instance in batch_objects
        ]

        batch_points = await asyncio.gather(*tasks, return_exceptions=True)

        valid_points = []
        for idx, result in enumerate(batch_points):
            if isinstance(result, Exception):
                logger.warning(
                    f"Failed to read {batch_objects[idx][0]}:{batch_objects[idx][1]}: {result}"
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
            object_type: 对象类型（驼峰格式）
            object_instance: 对象实例ID

        Returns:
            点位信息字典
        """
        try:
            # 转换为BACnet格式用于API调用
            bacnet_object_type = self._convert_to_bacnet_format(object_type)

            # 读取对象名称和描述
            object_name = await self._read_property(
                plugin_instance, bacnet_object_type, object_instance, "objectName"
            )
            description = await self._read_property(
                plugin_instance, bacnet_object_type, object_instance, "description", optional=True
            )

            # 判断可写性（传入驼峰格式）
            writable = await self._check_writable(
                plugin_instance, object_type, object_instance
            )

            # 数据类型映射
            data_type = self.DATA_TYPE_MAPPING.get(object_type, "unknown")

            point_info = {
                "object_type": object_type,
                "object_instance": object_instance,
                "object_name": object_name or f"{object_type}_{object_instance}",
                "description": description or "",
                "writable": writable,
                "data_type": data_type
            }

            logger.info(f"Read point: {point_info['object_name']}")
            return point_info

        except Exception as e:
            logger.warning(f"Failed to read {object_type}:{object_instance}: {e}")
            return None

    def _normalize_object_type(self, bacnet_type: str) -> str:
        """将BACnet对象类型转换为系统内部驼峰格式

        Args:
            bacnet_type: BACnet标准格式（如 'binary-value'）

        Returns:
            系统内部驼峰格式（如 'binaryValue'）
        """
        # 使用映射表转换
        normalized = self.OBJECT_TYPE_NAME_MAPPING.get(bacnet_type, bacnet_type)

        # 如果不在映射表中，自动转换
        if normalized == bacnet_type and '-' in bacnet_type:
            parts = bacnet_type.split('-')
            normalized = parts[0] + ''.join(part.capitalize() for part in parts[1:])

        return normalized

    def _convert_to_bacnet_format(self, camel_case_type: str) -> str:
        """将驼峰格式的对象类型转换为BACnet标准格式（带连字符）

        Args:
            camel_case_type: 驼峰格式的对象类型（如 'analogInput'）

        Returns:
            BACnet标准格式的对象类型（如 'analog-input'）
        """
        # 反向查找映射表
        for bacnet_type, camel_type in self.OBJECT_TYPE_NAME_MAPPING.items():
            if camel_type == camel_case_type:
                return bacnet_type

        # 如果映射表中没有，尝试自动转换（驼峰转连字符）
        # 在大写字母前插入连字符，然后全部转为小写
        result = re.sub(r'([A-Z])', r'-\1', camel_case_type).lower()
        logger.debug(f"Auto-converted object type to BACnet format: {camel_case_type} -> {result}")
        return result
    
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
            if hasattr(plugin_instance, 'read_property'):
                value = await plugin_instance.read_property(
                    object_type, object_instance, property_name
                )
                return value
            else:
                logger.warning("Plugin missing 'read_property' method")
                return None

        except Exception as e:
            if optional:
                logger.debug(f"Optional property '{property_name}' not available: {e}")
                return None
            else:
                logger.error(f"Failed to read '{property_name}' from {object_type}:{object_instance}: {e}")
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
            object_type: 对象类型（驼峰格式）
            object_instance: 对象实例ID

        Returns:
            是否可写
        """
        # 基于BACnet对象类型语义判断可写性
        return self.DEFAULT_WRITABLE_MAPPING.get(object_type, False)


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