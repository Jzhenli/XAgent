"""项目管理API路由"""

import logging
from fastapi import APIRouter, HTTPException, Depends, Query, status
from typing import Optional

from ..models.panel import (
    PanelCreate,
    PanelUpdate,
    PanelResponse,
    PanelListResponse,
    PanelType
)
from ..services.panel_service import PanelService
from ..dependencies import get_app_state
from .config import verify_api_token

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/panels", tags=["Panels"])


def get_panel_service(state = Depends(get_app_state)):
    """获取项目服务"""
    if not state.metadata_manager:
        raise HTTPException(
            status_code=500,
            detail="MetadataManager not initialized"
        )

    return PanelService(state.metadata_manager.db)


@router.post("/", response_model=PanelResponse, status_code=status.HTTP_201_CREATED)
async def create_panel(
    panel: PanelCreate,
    service: PanelService = Depends(get_panel_service),
    token: str = Depends(verify_api_token)
):
    """创建新项目

    Returns:
        创建的项目

    Raises:
        HTTPException: 409 - 项目已存在
        HTTPException: 400 - 参数无效
    """
    try:
        return await service.create_panel(panel)
    except ValueError as e:
        error_msg = str(e)
        if "already exists" in error_msg:
            raise HTTPException(status_code=409, detail=error_msg)
        raise HTTPException(status_code=400, detail=error_msg)
    except Exception as e:
        logger.error(f"Failed to create panel: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/", response_model=PanelListResponse)
async def list_panels(
    type: Optional[PanelType] = Query(None, description="按类型筛选"),
    enabled: Optional[bool] = Query(None, description="按启用状态筛选"),
    service: PanelService = Depends(get_panel_service),
    token: str = Depends(verify_api_token)
):
    """列出项目

    Args:
        type: 按类型筛选（Dashboard/Graphic）
        enabled: 按启用状态筛选

    Returns:
        项目列表（无分页，返回所有符合条件的记录）
    """
    panels = await service.list_panels(type=type, enabled=enabled)

    return PanelListResponse(
        total=len(panels),
        items=panels
    )


@router.get("/{panel_id}", response_model=PanelResponse)
async def get_panel(
    panel_id: str,
    service: PanelService = Depends(get_panel_service),
    token: str = Depends(verify_api_token)
):
    """获取项目详情

    Raises:
        HTTPException: 404 - 项目不存在
    """
    panel = await service.get_panel(panel_id)

    if not panel:
        raise HTTPException(
            status_code=404,
            detail=f"Panel '{panel_id}' not found"
        )

    return panel


@router.put("/{panel_id}", response_model=PanelResponse)
async def update_panel(
    panel_id: str,
    updates: PanelUpdate,
    service: PanelService = Depends(get_panel_service),
    token: str = Depends(verify_api_token)
):
    """更新项目（部分字段更新，data字段完整替换）

    - name, description, enabled 字段：支持部分更新（可选提供）
    - data 字段：必须是完整对象（不支持部分合并）

    Raises:
        HTTPException: 404 - 项目不存在
        HTTPException: 400 - 参数无效
    """
    try:
        return await service.update_panel(panel_id, updates)
    except ValueError as e:
        error_msg = str(e)
        if "not found" in error_msg:
            raise HTTPException(status_code=404, detail=error_msg)
        raise HTTPException(status_code=400, detail=error_msg)
    except Exception as e:
        logger.error(f"Failed to update panel {panel_id}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")


@router.delete("/{panel_id}")
async def delete_panel(
    panel_id: str,
    service: PanelService = Depends(get_panel_service),
    token: str = Depends(verify_api_token)
):
    """删除项目（物理删除，不可恢复）

    Raises:
        HTTPException: 404 - 项目不存在
    """
    try:
        await service.delete_panel(panel_id)

        return {
            "success": True,
            "message": f"Panel '{panel_id}' deleted successfully"
        }
    except ValueError as e:
        error_msg = str(e)
        if "not found" in error_msg:
            raise HTTPException(status_code=404, detail=error_msg)
        raise HTTPException(status_code=400, detail=error_msg)
    except Exception as e:
        logger.error(f"Failed to delete panel {panel_id}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")