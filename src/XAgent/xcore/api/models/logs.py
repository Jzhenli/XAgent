"""日志相关数据模型"""

from pydantic import BaseModel, Field
from typing import List, Optional, Literal


class LogLine(BaseModel):
    """单行日志数据"""
    timestamp: str = Field(..., description="日志时间戳，格式：YYYY-MM-DD HH:MM:SS")
    level: Literal["DEBUG", "INFO", "WARNING", "ERROR"] = Field(
        ..., description="日志级别：DEBUG, INFO, WARNING, ERROR"
    )
    logger: str = Field(..., description="日志记录器名称，如：XAgent.xcore.gateway")
    message: str = Field(..., description="日志消息内容")
    
    class Config:
        json_schema_extra = {
            "example": {
                "timestamp": "2026-07-17 14:30:00",
                "level": "INFO",
                "logger": "XAgent.xcore.gateway",
                "message": "系统启动完成"
            }
        }


class LogsResponse(BaseModel):
    """日志内容响应"""
    logs: List[LogLine] = Field(..., description="日志行列表")
    total: int = Field(..., description="返回的日志总行数", ge=0)
    file: str = Field(..., description="日志文件名")
    level_filtered: bool = Field(..., description="是否进行了级别过滤")
    
    class Config:
        json_schema_extra = {
            "example": {
                "logs": [
                    {
                        "timestamp": "2026-07-17 14:30:00",
                        "level": "INFO",
                        "logger": "XAgent.xcore.gateway",
                        "message": "系统启动完成"
                    }
                ],
                "total": 200,
                "file": "xagent.log",
                "level_filtered": False
            }
        }


class LogInfoResponse(BaseModel):
    """日志文件信息响应"""
    exists: bool = Field(..., description="日志文件是否存在")
    filename: Optional[str] = Field(None, description="日志文件名")
    size_mb: Optional[float] = Field(None, description="文件大小（MB）", ge=0)
    modified_at: Optional[float] = Field(None, description="最后修改时间（Unix时间戳）")
    
    class Config:
        json_schema_extra = {
            "example": {
                "exists": True,
                "filename": "xagent.log",
                "size_mb": 8.5,
                "modified_at": 1721204400.0
            }
        }