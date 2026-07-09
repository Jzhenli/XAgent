"""设备配置数据类"""
import time
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

@dataclass
class DeviceConfig:
    """设备配置数据类"""
    asset: str
    name: Optional[str] = None
    description: Optional[str] = None
    plugin_name: str = ""
    plugin_config: Dict[str, Any] = field(default_factory=dict)
    enabled: bool = True
    status: str = "active"
    metadata: Dict[str, Any] = field(default_factory=dict)
    tags: List[str] = field(default_factory=list)
    points: List[Dict[str, Any]] = field(default_factory=list)
    version: int = 1
    created_at: float = field(default_factory=time.time)
    updated_at: float = field(default_factory=time.time)
    created_by: Optional[str] = None
    updated_by: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        """转换为字典格式"""
        return {
            "asset": self.asset,
            "name": self.name,
            "description": self.description,
            "plugin_name": self.plugin_name,
            "plugin_config": self.plugin_config,
            "enabled": self.enabled,
            "status": self.status,
            "metadata": self.metadata,
            "tags": self.tags,
            "points": self.points,
            "version": self.version,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "created_by": self.created_by,
            "updated_by": self.updated_by
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'DeviceConfig':
        """从字典创建实例"""
        return cls(**data)