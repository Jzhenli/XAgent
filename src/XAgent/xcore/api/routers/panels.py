"""项目管理API路由"""

import logging
from fastapi import APIRouter, HTTPException, Depends, Query, Path, status
from typing import Optional

from ..models.panel import (
    PanelCreate,
    PanelUpdate,
    PanelResponse,
    PanelBriefResponse,
    PanelListResponse,
    PanelBriefListResponse,
    PanelType,
    HomepageSetRequest,
    HomepageResponse
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


def panel_to_brief(panel: PanelResponse) -> PanelBriefResponse:
    """将完整项目响应转换为概要响应（不含 data 字段）

    供 POST /api/panels/ 创建接口与离线单测共用，避免测试复刻转换逻辑产生漂移。
    """
    return PanelBriefResponse(**panel.model_dump(exclude={"data"}))


@router.post("/", response_model=PanelBriefResponse, status_code=status.HTTP_201_CREATED)
async def create_panel(
    panel: PanelCreate,
    service: PanelService = Depends(get_panel_service),
    token: str = Depends(verify_api_token)
):
    """创建新项目

    响应为项目概要（不含 data 字段）：data 可达数 MB（内嵌 base64 图片），
    回传完整 data 会使导入/创建场景的传输体积翻倍，且前端创建/导入流程
    不消费响应中的 data。需要完整数据时请调用 GET /api/panels/{panel_id}。

    Raises:
        HTTPException: 409 - 项目已存在
        HTTPException: 400 - 参数无效
    """
    try:
        created = await service.create_panel(panel)
        return panel_to_brief(created)
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


@router.get("/brief", response_model=PanelBriefListResponse)
async def list_panels_brief(
    type: Optional[PanelType] = Query(None, description="按类型筛选"),
    enabled: Optional[bool] = Query(None, description="按启用状态筛选"),
    service: PanelService = Depends(get_panel_service),
    token: str = Depends(verify_api_token)
):
    """列出项目概要（不含 data 字段，用于项目概览）

    与 GET /api/panels/ 的区别：不返回 data 字段，避免数据量过大。

    Args:
        type: 按类型筛选（Dashboard/Graphic）
        enabled: 按启用状态筛选

    Returns:
        项目概要列表（无分页，返回所有符合条件的记录）

    Note:
        该路由必须定义在 /{panel_id} 之前，否则会被路径参数路由拦截；
        /{panel_id} 的 panel_id 带 ^panel-[0-9]+$ 约束，顺序错乱时请求会以 422 暴露而非静默 404。
    """
    panels = await service.list_panels_brief(type=type, enabled=enabled)

    return PanelBriefListResponse(
        total=len(panels),
        items=panels
    )


@router.get("/homepage", response_model=HomepageResponse)
async def get_homepage(
    service: PanelService = Depends(get_panel_service),
    token: str = Depends(verify_api_token)
):
    """获取首页设置

    应用重启后前端调用此接口获取首页地址。
    未设置、或设置指向的面板已被删除/禁用时，panelId 与 panel 均为 null，
    前端应回退默认首页。

    Note:
        与 /brief 同理，必须定义在 /{panel_id} 之前；
        "homepage" 不匹配 ^panel-[0-9]+$ 约束，顺序错乱会以 422 暴露而非静默 404。
    """
    panel_id, panel = await service.get_homepage()
    return HomepageResponse(panelId=panel_id, panel=panel)


@router.put("/homepage", response_model=HomepageResponse)
async def set_homepage(
    request: HomepageSetRequest,
    service: PanelService = Depends(get_panel_service),
    token: str = Depends(verify_api_token)
):
    """设置首页面板

    Raises:
        HTTPException: 404 - 面板不存在
        HTTPException: 400 - 面板已禁用
    """
    try:
        panel = await service.set_homepage(request.panelId)
        return HomepageResponse(panelId=panel.id, panel=panel)
    except ValueError as e:
        error_msg = str(e)
        if "not found" in error_msg:
            raise HTTPException(status_code=404, detail=error_msg)
        raise HTTPException(status_code=400, detail=error_msg)
    except Exception as e:
        logger.error(f"Failed to set homepage: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")


@router.delete("/homepage")
async def clear_homepage(
    service: PanelService = Depends(get_panel_service),
    token: str = Depends(verify_api_token)
):
    """取消首页设置"""
    await service.clear_homepage()
    return {"success": True, "message": "Homepage setting cleared"}


@router.get("/{panel_id}", response_model=PanelResponse)
async def get_panel(
    panel_id: str = Path(..., pattern=r"^panel-[0-9]+$", description="项目ID"),
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
    updates: PanelUpdate,
    panel_id: str = Path(..., pattern=r"^panel-[0-9]+$", description="项目ID"),
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
    panel_id: str = Path(..., pattern=r"^panel-[0-9]+$", description="项目ID"),
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