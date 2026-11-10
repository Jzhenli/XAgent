"""通用键值设置模型"""

from typing import Any, Dict
from pydantic import BaseModel, Field


class SettingResponse(BaseModel):
    """单条设置响应（value 为任意 JSON 类型）"""
    key: str = Field(..., description="设置键")
    value: Any = Field(..., description="设置值（任意 JSON 类型）")
    updatedAt: float = Field(..., description="更新时间戳")


class SettingListResponse(BaseModel):
    """设置列表响应（key → value 映射，value 已按 JSON 解析）"""
    settings: Dict[str, Any] = Field(default_factory=dict, description="全部设置")
