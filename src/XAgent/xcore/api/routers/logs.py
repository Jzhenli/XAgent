"""日志查看API路由"""

import os
from fastapi import APIRouter, Depends, Query, HTTPException
from fastapi.responses import FileResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from typing import Optional

from ..models.logs import LogsResponse, LogInfoResponse
from ..services.log_service import LogService
from ..dependencies import get_app_state
from ...core.paths import get_paths
from .config import DEFAULT_API_TOKEN

router = APIRouter(prefix="/api/logs", tags=["Logs"])

# HTTP Bearer认证
security = HTTPBearer()


def verify_api_token_for_logs(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    """
    验证API Token（用于日志API）
    
    使用HTTP Authorization Header方式验证
    与前端axios拦截器配合（Bearer Token）
    """
    token = credentials.credentials
    expected_token = os.environ.get("XAGENT_API_TOKEN", DEFAULT_API_TOKEN)
    
    if token != expected_token:
        raise HTTPException(
            status_code=401,
            detail="Invalid API token"
        )
    
    return token


@router.get("", response_model=LogsResponse)
async def get_logs(
    level: Optional[str] = Query(
        None, 
        pattern="^(DEBUG|INFO|WARNING|ERROR)$",
        description="过滤日志级别"
    ),
    lines: int = Query(200, ge=1, le=1000, description="返回行数"),
    token: str = Depends(verify_api_token_for_logs),
    app_state = Depends(get_app_state)
):
    """
    获取日志内容
    
    性能：10MB文件 < 200ms
    内存：固定占用 ~200KB（仅存储最后200行）
    实时性：逐行读取确保获取最新日志（无滞后）
    
    需要认证：是（Bearer Token）
    """
    # 获取日志文件路径（复用现有）
    log_file = get_paths().log_file
    
    # 使用LogService读取日志
    service = LogService(log_file)
    
    try:
        logs = await service.tail_file(
            lines_count=lines,
            level_filter=level
        )
        
        return LogsResponse(
            logs=logs,
            total=len(logs),
            file=log_file.name,
            level_filtered=level is not None
        )
        
    except PermissionError:
        raise HTTPException(403, "Permission denied reading log file")
    except ValueError as e:
        raise HTTPException(500, f"Log file format error: {str(e)}")
    except Exception as e:
        raise HTTPException(500, f"Failed to read log file: {str(e)}")


@router.get("/info", response_model=LogInfoResponse)
async def get_log_info(
    token: str = Depends(verify_api_token_for_logs),  # ← Header认证
    app_state = Depends(get_app_state)
):
    """
    Get log file information
    
    Authentication required: Yes (Bearer Token)
    """
    log_file = get_paths().log_file
    
    service = LogService(log_file)
    info = service.get_file_info()
    
    return LogInfoResponse(**info)


@router.get("/download/{filename}")
async def download_log(
    filename: str,
    token: str = Depends(verify_api_token_for_logs),  # ← Header认证
    app_state = Depends(get_app_state)
):
    """
    Download log file
    
    Security measures:
    1. Path validation to prevent directory traversal
    2. File type restriction
    
    Authentication required: Yes (Bearer Token)
    """
    from ..routers.config import validate_backup_filename
    
    log_dir = get_paths().log_dir
    
    try:
        # Use existing validation logic
        safe_filename = validate_backup_filename(filename)
        log_file = log_dir / safe_filename
    except HTTPException:
        raise HTTPException(400, "Invalid filename")
    
    # Additional security check: ensure file is within log directory
    if not log_file.exists():
        raise HTTPException(404, "File not found")
    
    if not log_file.is_relative_to(log_dir):
        raise HTTPException(400, "Invalid path")
    
    # Extension whitelist
    if not filename.endswith(('.log', '.txt')):
        raise HTTPException(400, "Unsupported file type")
    
    return FileResponse(
        path=log_file,
        filename=filename,
        media_type="application/octet-stream"
    )