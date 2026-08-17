from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, field_validator, ConfigDict
from datetime import datetime
from enum import Enum
import re


class PluginType(str, Enum):
    SOUTH = "south"
    NORTH = "north"
    FILTER = "filter"
    RULE = "rule"
    DELIVERY = "delivery"


class DeviceStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    MAINTENANCE = "maintenance"
    ERROR = "error"


class StandardDataType(str, Enum):
    BOOL = "bool"
    INT = "int"
    FLOAT = "float"
    STRING = "string"


class PluginConfig(BaseModel):
    name: str = Field(..., description="插件名称")
    type: PluginType = Field(..., description="插件类型")
    version: str = Field(default="1.0.0", description="插件版本")
    description: Optional[str] = Field(None, description="插件描述")
    enabled: bool = Field(default=True, description="是否启用")
    
    defaults: Dict[str, Any] = Field(
        default_factory=dict, 
        description="默认配置"
    )
    
    capabilities: List[str] = Field(
        default_factory=list,
        description="插件能力列表"
    )
    
    model_config = ConfigDict(extra="allow")


class PointConfig(BaseModel):
    name: str = Field(..., description="点位名称")
    description: Optional[str] = Field(None, description="点位描述")
    data_type: str = Field(..., description="协议特定数据类型（如 uint16, temperature, analogInput）")
    standard_data_type: Optional[StandardDataType] = Field(None, description="标准数据类型（bool/int/float/string），由插件自动推导")
    unit: Optional[str] = Field(None, description="单位")
    enabled: bool = Field(default=True, description="是否启用")
    
    config: Dict[str, Any] = Field(
        default_factory=dict,
        description="协议特定配置（如 Modbus 地址）"
    )
    
    metadata: Dict[str, Any] = Field(
        default_factory=dict,
        description="点位元数据（如报警阈值、范围）"
    )
    
    tags: List[str] = Field(
        default_factory=list,
        description="标签列表"
    )
    
    @field_validator('name')
    @classmethod
    def validate_name(cls, v):
        """验证点位名称"""
        if not v or not v.strip():
            raise ValueError('Point name cannot be empty')
        if not re.match(r'^[a-zA-Z0-9_\-\u4e00-\u9fa5\s]+$', v):
            raise ValueError('Point name can only contain letters, numbers, underscores, hyphens, Chinese characters and spaces')
        return v.strip()
    
    model_config = ConfigDict(extra="allow")


class PluginReference(BaseModel):
    name: str = Field(..., description="插件名称")
    config: Dict[str, Any] = Field(
        default_factory=dict,
        description="插件实例配置（覆盖默认值）"
    )


class DeviceConfig(BaseModel):
    asset: str = Field(..., description="设备资产标识")
    name: Optional[str] = Field(None, description="设备名称")
    description: Optional[str] = Field(None, description="设备描述")
    enabled: bool = Field(default=True, description="是否启用")
    status: DeviceStatus = Field(
        default=DeviceStatus.ACTIVE,
        description="设备状态"
    )
    
    plugin: PluginReference = Field(
        ...,
        description="引用的插件"
    )
    
    points: List[PointConfig] = Field(
        default_factory=list,
        description="点位列表"
    )
    
    metadata: Dict[str, Any] = Field(
        default_factory=dict,
        description="设备元数据"
    )
    
    tags: List[str] = Field(
        default_factory=list,
        description="标签列表"
    )
    
    created_at: Optional[datetime] = Field(None, description="创建时间")
    updated_at: Optional[datetime] = Field(None, description="更新时间")
    
    @field_validator('asset')
    @classmethod
    def validate_asset(cls, v):
        """验证设备资产标识"""
        if not v or not v.strip():
            raise ValueError('Asset identifier cannot be empty')
        if len(v) > 64:
            raise ValueError('Asset identifier cannot exceed 64 characters')
        if not re.match(r'^[a-zA-Z0-9_\-]+$', v):
            raise ValueError('Asset identifier can only contain letters, numbers, underscores, and hyphens')
        if '..' in v or '/' in v or '\\' in v:
            raise ValueError('Asset identifier cannot contain path traversal characters')
        return v.strip()
    
    model_config = ConfigDict(extra="allow")


class DeviceCreateResponse(BaseModel):
    success: bool
    message: str
    asset: str
    plugin_id: Optional[str] = None
    requires_reload: bool = True


class DeviceUpdateResponse(BaseModel):
    success: bool
    message: str
    asset: str
    updated_fields: List[str] = Field(default_factory=list)


class PointCreateResponse(BaseModel):
    success: bool
    message: str
    asset: str
    point_name: str
    requires_reload: bool = True


class DeviceListResponse(BaseModel):
    count: int
    devices: List[DeviceConfig]


class DeviceFilter(BaseModel):
    status: Optional[DeviceStatus] = None
    plugin_name: Optional[str] = None
    tags: Optional[List[str]] = None
    enabled: Optional[bool] = None


class BatchOperationResult(BaseModel):
    total: int
    succeeded: int
    failed: int
    details: List[Dict[str, Any]] = Field(default_factory=list)


class DeviceReloadResponse(BaseModel):
    success: bool
    message: str
    asset: Optional[str] = None
    reload_status: Optional[str] = None


class BatchDeviceReloadResponse(BaseModel):
    success: bool
    message: str
    total: int
    succeeded: int
    failed: int
    results: Dict[str, str] = Field(default_factory=dict)


# ========== 点位发现相关模型 ==========

class DiscoverPointsRequest(BaseModel):
    """点位发现请求"""
    object_types: Optional[List[str]] = Field(
        default=None,
        description="要发现的对象类型列表（可选），如 ['analogInput', 'analogOutput']"
    )


class DiscoveredPoint(BaseModel):
    """发现的点位信息"""
    object_type: str = Field(..., description="BACnet对象类型")
    object_instance: int = Field(..., description="对象实例ID")
    object_name: str = Field(..., description="对象名称")
    description: Optional[str] = Field(default="", description="描述")
    writable: bool = Field(..., description="是否可写")
    data_type: str = Field(..., description="系统内部数据类型")


class DiscoverPointsResponse(BaseModel):
    """点位发现响应"""
    success: bool
    points: List[DiscoveredPoint] = Field(default_factory=list)
    total: int


class BatchAddPointsRequest(BaseModel):
    """批量添加点位请求"""
    points: List[PointConfig] = Field(..., description="要添加的点位列表")


class BatchAddPointsResponse(BaseModel):
    """批量添加点位响应"""
    success: bool
    message: str
    asset: str
    total: int
    succeeded: int
    failed: int
    details: List[Dict[str, Any]] = Field(default_factory=list)


# ========== 设备发现相关模型 ==========

class DiscoverDevicesRequest(BaseModel):
    """设备发现请求"""
    network_range: Optional[str] = Field(None, description="网络范围，如192.168.1.0/24")
    device_id_range: Optional[List[int]] = Field(None, description="设备ID范围，如[0, 1000]")
    timeout: float = Field(5.0, ge=0.1, le=30, description="发现超时时间（秒）")
    interface_ip: Optional[str] = Field(None, description="指定网卡IP地址（多网卡环境下建议指定）")
    
    @field_validator('device_id_range')
    @classmethod
    def validate_device_id_range(cls, v):
        if v is not None:
            if len(v) != 2:
                raise ValueError('device_id_range must contain exactly 2 integers')
            if v[0] > v[1]:
                raise ValueError('device_id_range[0] must be <= device_id_range[1]')
        return v


class DiscoveredDeviceResponse(BaseModel):
    """发现的设备响应"""
    device_id: int = Field(..., description="设备ID")
    address: str = Field(..., description="设备地址")
    port: int = Field(..., description="设备端口")
    device_name: Optional[str] = Field(None, description="设备名称")
    vendor_name: Optional[str] = Field(None, description="厂商名称")
    model_name: Optional[str] = Field(None, description="型号名称")
    object_count: Optional[int] = Field(None, description="对象数量")


class NetworkInterfaceResponse(BaseModel):
    """网卡信息响应"""
    name: str = Field(..., description="网卡名称")
    ip_address: str = Field(..., description="IP地址")
    network_prefix: int = Field(..., description="网络前缀")
    network_address: str = Field(..., description="网络地址")
    broadcast_address: str = Field(..., description="广播地址")
    description: str = Field("", description="网卡描述")
    priority: int = Field(0, description="优先级（1=有线, 2=无线, 3=其他，数值越小越优先）")


class DiscoverDevicesResponse(BaseModel):
    """设备发现响应"""
    success: bool = Field(..., description="是否成功")
    devices: List[DiscoveredDeviceResponse] = Field(..., description="发现的设备列表")
    total: int = Field(..., description="发现总数")


class BatchAddDevicesRequest(BaseModel):
    """批量添加设备请求"""
    devices: List[DeviceConfig] = Field(..., description="要添加的设备列表")


class BatchAddDevicesResponse(BaseModel):
    """批量添加设备响应"""
    success: bool
    message: str
    total: int
    succeeded: int
    failed: int
    details: List[Dict[str, Any]] = Field(default_factory=list)
