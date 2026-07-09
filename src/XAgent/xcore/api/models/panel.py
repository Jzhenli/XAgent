from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, field_validator, ConfigDict
from enum import Enum
import re


class PanelType(str, Enum):
    """项目类型"""
    DASHBOARD = "Dashboard"
    GRAPHIC = "Graphic"


class PanelData(BaseModel):
    """项目数据（存储在data JSON字段中）"""
    # 画布配置
    width: int = Field(default=1200, ge=800, le=4000, description="画布宽度")
    height: int = Field(default=800, ge=600, le=3000, description="画布高度")
    grid: int = Field(default=20, ge=10, le=50, description="网格大小")
    backgroundColor: str = Field(default="#f0f2f5", description="背景颜色")
    backgroundImage: Optional[str] = Field(None, description="背景图片（Base64或URL）")

    # 组件数据
    components: List[Dict[str, Any]] = Field(
        default_factory=list,
        description="组件列表"
    )

    # 扩展数据
    metadata: Dict[str, Any] = Field(
        default_factory=dict,
        description="自定义元数据"
    )

    tags: List[str] = Field(
        default_factory=list,
        description="标签列表"
    )

    # 允许动态扩展字段
    model_config = ConfigDict(extra="allow")


class PanelCreate(BaseModel):
    """创建项目请求"""
    id: str = Field(..., description="项目唯一ID")
    name: str = Field(..., min_length=1, max_length=100)
    type: PanelType = Field(...)
    description: Optional[str] = Field(None, max_length=500)
    data: Optional[PanelData] = Field(None, description="项目数据（可选）")
    createdAt: float = Field(..., description="创建时间戳")
    updatedAt: float = Field(..., description="更新时间戳")

    @field_validator('id')
    @classmethod
    def validate_id(cls, v):
        """验证项目ID格式：panel-{timestamp}"""
        if not v or not v.strip():
            raise ValueError('Panel ID cannot be empty')
        if not re.match(r'^panel-[0-9]+$', v):
            raise ValueError('Panel ID must be "panel-{timestamp}"')
        return v.strip()

    @field_validator('name')
    @classmethod
    def validate_name(cls, v):
        """验证项目名称"""
        if not v or not v.strip():
            raise ValueError('Panel name cannot be empty')
        return v.strip()


class PanelUpdate(BaseModel):
    """更新项目请求（部分更新）"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    data: Optional[PanelData] = Field(None, description="更新项目数据")
    enabled: Optional[bool] = Field(None, description="是否启用")
    updatedAt: float = Field(..., description="更新时间戳")


class PanelResponse(BaseModel):
    """项目响应模型"""
    id: str
    name: str
    type: PanelType
    description: Optional[str]
    data: PanelData
    enabled: bool = Field(default=True)
    createdAt: float
    updatedAt: float

    model_config = ConfigDict(from_attributes=True)


class PanelListResponse(BaseModel):
    """项目列表响应"""
    total: int
    items: List[PanelResponse]


class PanelQuery(BaseModel):
    """项目查询参数（简化版，不支持分页和搜索）"""
    type: Optional[PanelType] = Field(None, description="按类型筛选")
    enabled: Optional[bool] = Field(None, description="按启用状态筛选")