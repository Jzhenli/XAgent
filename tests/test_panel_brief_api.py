"""面板概要接口（GET /api/panels/brief）离线单测，无需启动服务。

覆盖：
- list_brief 返回不含 data 字段，排序/公共字段与 list 一致
- type / enabled 筛选
- enabled 列为 NULL（历史脏数据，表无 NOT NULL 约束）时回退为默认启用
- /brief 路由必须注册在 /{panel_id} 之前（防止被路径参数路由静默吞掉）
"""
import asyncio
import json
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

import aiosqlite

from XAgent.xcore.api.models.panel import PanelType
from XAgent.xcore.api.repositories.panel_repository import PanelRepository
from XAgent.xcore.api.routers.panels import router

# 与 src/XAgent/xcore/storage/sqlite.py 中 panel_registry 建表语句保持一致
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
)
"""

BIG_DATA = {"widgets": [{"id": i, "cfg": "x" * 200} for i in range(50)]}


async def _make_repo():
    """建内存库并插入 3 条面板（含大 data）"""
    db = await aiosqlite.connect(":memory:")
    await db.execute(DDL)
    await db.executemany(
        "INSERT INTO panel_registry (panel_id, name, type, description, data, enabled, created_at, updated_at) "
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
            ("panel-1", "A", "Dashboard", "desc-a", json.dumps(BIG_DATA), 1, 1.0, 10.0),
            ("panel-2", "B", "Graphic", None, json.dumps(BIG_DATA), 0, 2.0, 20.0),
            ("panel-3", "C", "Dashboard", None, "{}", 1, 3.0, 30.0),
        ],
    )
    await db.commit()
    return db, PanelRepository(db)


async def _brief_excludes_data():
    db, repo = await _make_repo()
    try:
        brief = await repo.list_brief()
        full = await repo.list()

        # 排序一致（updated_at DESC）
        assert [p.id for p in brief] == ["panel-3", "panel-2", "panel-1"], [p.id for p in brief]
        assert [p.id for p in full] == [p.id for p in brief]

        # brief 不含 data 字段，full 含
        for p in brief:
            assert "data" not in p.model_dump(), "brief 响应不应包含 data 字段"
        for p in full:
            assert p.data is not None

        # 公共字段取值一致
        for b, f in zip(brief, full):
            assert (b.id, b.name, b.type, b.enabled, b.createdAt, b.updatedAt) == \
                   (f.id, f.name, f.type, f.enabled, f.createdAt, f.updatedAt)
    finally:
        await db.close()


async def _brief_filters():
    db, repo = await _make_repo()
    try:
        assert [p.id for p in await repo.list_brief(type=PanelType.DASHBOARD)] == ["panel-3", "panel-1"]
        assert [p.id for p in await repo.list_brief(type=PanelType.GRAPHIC)] == ["panel-2"]
        assert [p.id for p in await repo.list_brief(enabled=True)] == ["panel-3", "panel-1"]
        assert [p.id for p in await repo.list_brief(enabled=False)] == ["panel-2"]
        assert [p.id for p in await repo.list_brief(type=PanelType.GRAPHIC, enabled=False)] == ["panel-2"]
    finally:
        await db.close()


async def _null_enabled_falls_back_to_true():
    db = await aiosqlite.connect(":memory:")
    try:
        await db.execute(DDL)
        await db.execute(
            "INSERT INTO panel_registry (panel_id, name, type, description, data, enabled, created_at, updated_at) "
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            ("panel-9", "N", "Dashboard", None, "{}", None, 1.0, 1.0),
        )
        await db.commit()
        repo = PanelRepository(db)

        brief = (await repo.list_brief())[0]
        full = (await repo.list())[0]
        assert brief.enabled is True, "NULL enabled 应回退为 True"
        assert full.enabled is True, "NULL enabled 应回退为 True"
    finally:
        await db.close()


def test_brief_excludes_data():
    asyncio.run(_brief_excludes_data())


def test_brief_filters():
    asyncio.run(_brief_filters())


def test_null_enabled_falls_back_to_true():
    asyncio.run(_null_enabled_falls_back_to_true())


def test_brief_route_registered_before_panel_id():
    paths = [getattr(r, "path", "") for r in router.routes]
    brief = next((p for p in paths if p.endswith("/brief")), None)
    detail = next((p for p in paths if p.endswith("/{panel_id}")), None)
    assert brief is not None, f"brief 路由未注册: {paths}"
    assert detail is not None, f"/{{panel_id}} 路由未注册: {paths}"
    assert paths.index(brief) < paths.index(detail), \
        "/brief 必须注册在 /{panel_id} 之前，否则会被路径参数路由拦截"


if __name__ == "__main__":
    test_brief_excludes_data()
    test_brief_filters()
    test_null_enabled_falls_back_to_true()
    test_brief_route_registered_before_panel_id()
    print("ALL PANEL BRIEF TESTS PASSED")
