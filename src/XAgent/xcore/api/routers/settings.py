"""通用键值设置API

存储层复用 app_settings 表（key TEXT PK / value TEXT / updated_at REAL）。
value 以 JSON 文本存储，GET 时解析回任意 JSON 类型；解析失败时原样返回
字符串，天然兼容非 JSON 写入的历史数据。

与专用接口的分工：需要业务校验/联动的设置（如 /api/panels/homepage 的
面板存在性校验与删除联动）走专用接口；纯"记住一个值"的场景走本通用层，
后续新增设置项零后端代码扩展。
"""

import json
import logging
from typing import Any

from fastapi import APIRouter, HTTPException, Depends, Path, Body

from ..models.setting import SettingResponse, SettingListResponse
from ..repositories.panel_repository import PanelRepository
from ..dependencies import get_app_state
from .config import verify_api_token

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/settings", tags=["Settings"])

# key 命名规则：字母开头，仅字母/数字/下划线/连字符/点号（点号用于命名空间，
# 如 ui.layout），最长 64 字符
KEY_PATTERN = r"^[a-zA-Z][a-zA-Z0-9_.-]{0,63}$"

# 系统保留前缀：由专用接口管理（如 homepage_panel_id 由 /api/panels/homepage
# 维护并带业务校验），通用接口禁止写入/删除，防止误覆盖或绕过校验
RESERVED_KEY_PREFIXES = ("homepage",)


def is_reserved_key(key: str) -> bool:
    """判断是否为系统保留前缀的设置键"""
    return any(key.startswith(prefix) for prefix in RESERVED_KEY_PREFIXES)


def ensure_not_reserved_key(key: str) -> None:
    """保留键的写入/删除防护

    Raises:
        HTTPException: 403 - 系统保留前缀，禁止通过通用接口写入/删除
    """
    if is_reserved_key(key):
        raise HTTPException(
            status_code=403,
            detail=f"Setting key prefix {'/'.join(RESERVED_KEY_PREFIXES)} is reserved; "
                   f"use the dedicated API instead"
        )


def parse_setting_value(raw: str) -> Any:
    """将存储的 JSON 文本解析回任意 JSON 类型，解析失败原样返回字符串"""
    try:
        return json.loads(raw)
    except (json.JSONDecodeError, TypeError):
        return raw


def get_settings_repository(state=Depends(get_app_state)) -> PanelRepository:
    """获取设置存储仓库"""
    if not state.metadata_manager:
        raise HTTPException(
            status_code=500,
            detail="MetadataManager not initialized"
        )
    return PanelRepository(state.metadata_manager.db)


@router.get("", response_model=SettingListResponse)
async def list_settings(
    repo: PanelRepository = Depends(get_settings_repository),
    token: str = Depends(verify_api_token)
):
    """列出全部设置（key → value 映射）

    Note:
        结果包含系统保留前缀键（如 homepage_panel_id）。这些键仅可读，
        通过本接口 PUT/DELETE 会被 403 拒绝（见 ensure_not_reserved_key）；
        前端请勿对列表结果做全量读取→修改→写回。
    """
    rows = await repo.list_settings()
    return SettingListResponse(
        settings={key: parse_setting_value(value) for key, value, _ in rows}
    )


@router.get("/{key}", response_model=SettingResponse)
async def get_setting(
    key: str = Path(..., pattern=KEY_PATTERN, description="设置键"),
    repo: PanelRepository = Depends(get_settings_repository),
    token: str = Depends(verify_api_token)
):
    """读取单条设置，不存在返回 404"""
    row = await repo.get_setting_with_meta(key)
    if row is None:
        raise HTTPException(status_code=404, detail=f"Setting '{key}' not found")
    value, updated_at = row
    return SettingResponse(key=key, value=parse_setting_value(value),
                           updatedAt=updated_at)


@router.put("/{key}", response_model=SettingResponse)
async def set_setting(
    key: str = Path(..., pattern=KEY_PATTERN, description="设置键"),
    value: Any = Body(..., description="设置值（任意 JSON 类型）"),
    repo: PanelRepository = Depends(get_settings_repository),
    token: str = Depends(verify_api_token)
):
    """写入/覆盖设置（upsert）

    value 以 JSON 文本落库，类型与结构由调用方自行决定。
    """
    ensure_not_reserved_key(key)
    updated_at = await repo.set_setting(key, json.dumps(value))
    logger.info(f"Setting '{key}' updated")
    return SettingResponse(key=key, value=value, updatedAt=updated_at)


@router.delete("/{key}")
async def delete_setting(
    key: str = Path(..., pattern=KEY_PATTERN, description="设置键"),
    repo: PanelRepository = Depends(get_settings_repository),
    token: str = Depends(verify_api_token)
):
    """删除设置（不存在时静默成功）"""
    ensure_not_reserved_key(key)
    await repo.delete_setting(key)
    logger.info(f"Setting '{key}' deleted")
    return {"success": True, "message": f"Setting '{key}' deleted"}
