"""Standard Data Point Model - Unified data format for internal communication"""

from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional
from enum import Enum
import time
import warnings


class DataQuality(str, Enum):
    GOOD = "good"
    BAD = "bad"
    UNCERTAIN = "uncertain"


class DataType(str, Enum):
    BOOL = "bool"
    INT = "int"
    FLOAT = "float"
    STRING = "string"
    BYTES = "bytes"
    JSON = "json"


@dataclass
class StandardDataPoint:
    device_id: str
    point_name: str
    value: Any
    data_type: str
    standard_data_type: Optional[str] = None
    timestamp: float = field(default_factory=time.time)
    unit: Optional[str] = None
    quality: str = DataQuality.GOOD.value
    metadata: Dict[str, Any] = field(default_factory=dict)
    
    def to_dict(self) -> Dict[str, Any]:
        result = {
            "device_id": self.device_id,
            "point_name": self.point_name,
            "value": self.value,
            "data_type": self.data_type,
            "timestamp": self.timestamp,
            "unit": self.unit,
            "quality": self.quality,
            "metadata": self.metadata
        }
        if self.standard_data_type is not None:
            result["standard_data_type"] = self.standard_data_type
        return result
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "StandardDataPoint":
        return cls(
            device_id=data["device_id"],
            point_name=data["point_name"],
            value=data["value"],
            data_type=data["data_type"],
            standard_data_type=data.get("standard_data_type"),
            timestamp=data.get("timestamp", time.time()),
            unit=data.get("unit"),
            quality=data.get("quality", DataQuality.GOOD.value),
            metadata=data.get("metadata", {})
        )
    
    def validate(self) -> bool:
        if not self.device_id:
            return False
        if not self.point_name:
            return False
        if self.quality not in [dq.value for dq in DataQuality]:
            return False
        return True
    
    def to_reading_set_entry(self) -> Dict[str, Any]:
        """转换为 ReadingSet 的单点位条目
        
        用于构建 ReadingSet 的 points/quality 字典。
        
        Returns:
            包含 point_name, value, quality 的字典
        """
        return {
            "point_name": self.point_name,
            "value": self.value,
            "quality": self.quality,
        }
    
    @classmethod
    def from_reading_dict(
        cls,
        asset: str,
        point_name: str,
        value: Any,
        timestamp: float,
        quality: str = DataQuality.GOOD.value,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> "StandardDataPoint":
        """从 Reading 的 data 字典项创建 StandardDataPoint
        
        Args:
            asset: 设备ID（对应 Reading.asset）
            point_name: 点位名称
            value: 点位值
            timestamp: 时间戳
            quality: 数据质量
            metadata: 元数据
            
        Returns:
            StandardDataPoint 实例
        """
        data_type = _infer_data_type(value)
        return cls(
            device_id=asset,
            point_name=point_name,
            value=value,
            data_type=data_type,
            timestamp=timestamp,
            quality=quality,
            metadata=metadata or {},
        )


def to_storage_point(point: Dict[str, Any]) -> Dict[str, Any]:
    """将标准点位字典精简为落库格式（readings.standard_points）

    仅保留动态字段 point_name/value/quality；device_id、timestamp、unit、
    data_type 等为行级冗余或静态配置，不落库（静态信息从点位配置按需获取）。
    异常点位保留 metadata.error_code，供北向上报区分故障类型。
    兼容旧数据中的 name 键。
    """
    result = {
        "point_name": point.get("point_name") or point.get("name") or "",
        "value": point.get("value"),
        # or 而非 get 默认值：quality 键存在但为 None 时也要回退 good
        "quality": point.get("quality") or DataQuality.GOOD.value,
    }
    if result["quality"] != DataQuality.GOOD.value:
        error_code = (point.get("metadata") or {}).get("error_code")
        if error_code is not None:
            result["metadata"] = {"error_code": error_code}
    return result


@dataclass
class DeviceData:
    """[DEPRECATED] DeviceData is not used internally. Use StandardDataPoint directly."""
    
    device_id: str
    points: List[StandardDataPoint]
    timestamp: float = field(default_factory=time.time)
    metadata: Dict[str, Any] = field(default_factory=dict)
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "device_id": self.device_id,
            "points": [p.to_dict() for p in self.points],
            "timestamp": self.timestamp,
            "metadata": self.metadata
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "DeviceData":
        warnings.warn(
            "DeviceData is deprecated. Use StandardDataPoint directly.",
            DeprecationWarning,
            stacklevel=2,
        )
        return cls(
            device_id=data["device_id"],
            points=[StandardDataPoint.from_dict(p) for p in data.get("points", [])],
            timestamp=data.get("timestamp", time.time()),
            metadata=data.get("metadata", {})
        )


def _infer_data_type(value: Any) -> str:
    """推断数据类型"""
    if isinstance(value, bool):
        return DataType.BOOL.value
    if isinstance(value, int):
        return DataType.INT.value
    if isinstance(value, float):
        return DataType.FLOAT.value
    if isinstance(value, str):
        return DataType.STRING.value
    if isinstance(value, bytes):
        return DataType.BYTES.value
    if isinstance(value, (dict, list)):
        return DataType.JSON.value
    return DataType.STRING.value
