"""首页设置接口（GET/PUT/DELETE /api/panels/homepage）离线单测，无需启动服务。

覆盖：
- set/get/clear 首页设置的基本闭环
- PUT 校验：面板不存在 404 / 面板已禁用 400
- 读时校验自愈：设置指向的面板被绕过服务层删除（如配置导入替换）后，
  GET 返回未设置并自动清除脏数据
- delete_panel 联动清理首页设置
- /homepage 路由必须注册在 /{panel_id} 之前
- app_settings upsert 幂等
"""
import asyncio
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

import aiosqlite

from XAgent.xcore.api.models.panel import PanelCreate, PanelType, PanelUpdate
from XAgent.xcore.api.repositories.panel_repository import PanelRepository
from XAgent.xcore.api.routers.panels import router
from XAgent.xcore.api.services.panel_service import PanelService, HOMEPAGE_SETTING_KEY

# 与 src/XAgent/xcore/storage/sqlite.py 建表语句保持一致
DDL = """
CREATE TABLE panel_registry (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    panel_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    data TEXT NOT NULL DEFAULT '{}',
    enabled BOOLEAN DEFAULT TRUE,
    created_at REAL NOT NULL,
    updated_at REAL NOT NULL
);

CREATE TABLE app_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at REAL NOT NULL
)
"""


async def _make_service():
    db = await aiosqlite.connect(":memory:")
    await db.executescript(DDL)
    await db.commit()
    return db, PanelService(db)


def _panel(pid: str, name: str) -> PanelCreate:
    return PanelCreate(
        id=pid, name=name, type=PanelType.DASHBOARD,
        description=None, data={}, createdAt=1.0, updatedAt=1.0,
    )


async def _homepage_set_get_clear_cycle():
    db, service = await _make_service()
    try:
        # 未设置时返回 (None, None)
        assert await service.get_homepage() == (None, None)

        await service.create_panel(_panel("panel-1", "A"))

        # 设置后可读回，含面板概要
        panel = await service.set_homepage("panel-1")
        assert panel.id == "panel-1"
        panel_id, brief = await service.get_homepage()
        assert panel_id == "panel-1"
        assert brief is not None and brief.id == "panel-1" and brief.name == "A"

        # upsert 幂等：重复设置同键不报错、值不重复
        await service.set_homepage("panel-1")
        panel_id, _ = await service.get_homepage()
        assert panel_id == "panel-1"

        # 清除后回到未设置
        await service.clear_homepage()
        assert await service.get_homepage() == (None, None)
    finally:
        await db.close()


async def _set_homepage_validation():
    db, service = await _make_service()
    try:
        await service.create_panel(_panel("panel-1", "A"))
        await service.create_panel(_panel("panel-2", "B"))
        await service.update_panel("panel-2", PanelUpdate(enabled=False, updatedAt=2.0))

        # 面板不存在
        try:
            await service.set_homepage("panel-404")
            raise AssertionError("应抛出 not found")
        except ValueError as e:
            assert "not found" in str(e)

        # 面板已禁用
        try:
            await service.set_homepage("panel-2")
            raise AssertionError("应抛出 disabled")
        except ValueError as e:
            assert "disabled" in str(e)
    finally:
        await db.close()


async def _stale_homepage_self_heals():
    db, service = await _make_service()
    try:
        await service.create_panel(_panel("panel-1", "A"))
        await service.set_homepage("panel-1")

        # 绕过服务层直接删面板（模拟配置导入/恢复等替换路径）
        await PanelRepository(db).delete("panel-1")

        # 读时校验应自愈：返回未设置，且脏数据被清除
        assert await service.get_homepage() == (None, None)
        repo = PanelRepository(db)
        assert await repo.get_setting(HOMEPAGE_SETTING_KEY) is None
    finally:
        await db.close()


async def _disabled_panel_self_heals():
    db, service = await _make_service()
    try:
        await service.create_panel(_panel("panel-1", "A"))
        await service.set_homepage("panel-1")

        # 面板被禁用（未删除）时同样视为失效
        await service.update_panel("panel-1", PanelUpdate(enabled=False, updatedAt=2.0))
        assert await service.get_homepage() == (None, None)
    finally:
        await db.close()


async def _delete_panel_clears_homepage():
    db, service = await _make_service()
    try:
        await service.create_panel(_panel("panel-1", "A"))
        await service.create_panel(_panel("panel-2", "B"))
        await service.create_panel(_panel("panel-3", "C"))
        await service.set_homepage("panel-1")

        # 删除首页面板 → 设置被联动清除
        await service.delete_panel("panel-1")
        assert await service.get_homepage() == (None, None)

        # 删除非首页面板 → 设置保留
        await service.set_homepage("panel-2")
        await service.delete_panel("panel-3")
        panel_id, _ = await service.get_homepage()
        assert panel_id == "panel-2"
    finally:
        await db.close()


def test_homepage_set_get_clear_cycle():
    asyncio.run(_homepage_set_get_clear_cycle())


def test_set_homepage_validation():
    asyncio.run(_set_homepage_validation())


def test_stale_homepage_self_heals():
    asyncio.run(_stale_homepage_self_heals())


def test_disabled_panel_self_heals():
    asyncio.run(_disabled_panel_self_heals())


def test_delete_panel_clears_homepage():
    asyncio.run(_delete_panel_clears_homepage())


def test_homepage_routes_registered_before_panel_id():
    paths = [getattr(r, "path", "") for r in router.routes]
    homepage = [p for p in paths if p.endswith("/homepage")]
    detail = next((p for p in paths if p.endswith("/{panel_id}")), None)
    assert len(homepage) == 3, f"homepage 路由未完整注册: {paths}"
    assert detail is not None
    for p in homepage:
        assert paths.index(p) < paths.index(detail), \
            "/homepage 必须注册在 /{panel_id} 之前"


if __name__ == "__main__":
    test_homepage_set_get_clear_cycle()
    test_set_homepage_validation()
    test_stale_homepage_self_heals()
    test_disabled_panel_self_heals()
    test_delete_panel_clears_homepage()
    test_homepage_routes_registered_before_panel_id()
    print("ALL PANEL HOMEPAGE TESTS PASSED")
