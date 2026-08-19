"""北向服务配置数据类"""
import time
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

@dataclass
class ServiceConfig:
    """北向服务配置数据类"""
    name: str
    protocol: str
    display_name: Optional[str] = None
    description: Optional[str] = None
    connection_config: Dict[str, Any] = field(default_factory=dict)
    adapter_config: Dict[str, Any] = field(default_factory=dict)
    upload_config: Dict[str, Any] = field(default_factory=dict)
    command_config: Dict[str, Any] = field(default_factory=dict)
    enabled: bool = True
    status: str = "offline"
    priority: int = 0
    metadata: Dict[str, Any] = field(default_factory=dict)
    tags: List[str] = field(default_factory=list)
    statistics: Dict[str, Any] = field(default_factory=dict)
    created_at: float = field(default_factory=time.time)
    updated_at: float = field(default_factory=time.time)
    created_by: Optional[str] = None
    updated_by: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        """转换为字典格式"""
        return {
            "name": self.name,
            "protocol": self.protocol,
            "display_name": self.display_name,
            "description": self.description,
            "connection_config": self.connection_config,
            "adapter_config": self.adapter_config,
            "upload_config": self.upload_config,
            "command_config": self.command_config,
            "enabled": self.enabled,
            "status": self.status,
            "priority": self.priority,
            "metadata": self.metadata,
            "tags": self.tags,
            "statistics": self.statistics,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "created_by": self.created_by,
            "updated_by": self.updated_by
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'ServiceConfig':
        """从字典创建实例"""
        return cls(**data)