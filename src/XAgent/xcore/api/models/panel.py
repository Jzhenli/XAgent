from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, field_validator, ConfigDict
from enum import Enum
import re


class PanelType(str, Enum):
    """项目类型"""
    DASHBOARD = "Dashboard"
    GRAPHIC = "Graphic"


# PanelData 使用通用 JSON 数据类型，不做校验
# 这样可以适应不同类型的项目（Dashboard、Graphic 等）
PanelData = Dict[str, Any]


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