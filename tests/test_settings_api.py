"""通用键值设置接口（/api/settings）离线单测，无需启动服务。

覆盖：
- PUT/GET 闭环：对象/字符串/数字 value 的 JSON 往返
- upsert 覆盖语义
- GET 不存在 404 / DELETE 静默
- list 全量列举
- 保留前缀防护：homepage 前缀禁止写入/删除（403），读取放行
- key 命名规则校验
- 非 JSON 历史数据的兼容解析
"""
import asyncio
import json
import os
import re
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

import aiosqlite
from fastapi import HTTPException

from XAgent.xcore.api.repositories.panel_repository import PanelRepository
from XAgent.xcore.api.routers.settings import (
    KEY_PATTERN,
    ensure_not_reserved_key,
    is_reserved_key,
    parse_setting_value,
)

# 与 src/XAgent/xcore/storage/sqlite.py 建表语句保持一致
DDL = """
CREATE TABLE app_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at REAL NOT NULL
)
"""


async def _make_repo():
    db = await aiosqlite.connect(":memory:")
    await db.executescript(DDL)
    await db.commit()
    return db, PanelRepository(db)


async def _put_get_roundtrip():
    db, repo = await _make_repo()
    try:
        # 对象 value 往返
        payload = {"sidebar": True, "ratio": 0.75, "tabs": ["a", "b"]}
        await repo.set_setting("ui.layout", json.dumps(payload))
        value, updated_at = await repo.get_setting_with_meta("ui.layout")
        assert parse_setting_value(value) == payload
        assert updated_at > 0

        # 字符串/数字 value 往返
        await repo.set_setting("ui.lang", json.dumps("zh-CN"))
        await repo.set_setting("ui.zoom", json.dumps(1.25))
        assert parse_setting_value(await repo.get_setting("ui.lang")) == "zh-CN"
        assert parse_setting_value(await repo.get_setting("ui.zoom")) == 1.25

        # upsert：同键覆盖，不产生重复行；返回时间戳与 GET 读回一致
        ts = await repo.set_setting("ui.lang", json.dumps("en"))
        value, updated_at = await repo.get_setting_with_meta("ui.lang")
        assert parse_setting_value(value) == "en"
        assert updated_at == ts
        assert len(await repo.list_settings()) == 3
    finally:
        await db.close()


async def _get_404_and_delete_silent():
    db, repo = await _make_repo()
    try:
        assert await repo.get_setting_with_meta("nope") is None

        await repo.set_setting("ui.flag", json.dumps(True))
        await repo.delete_setting("ui.flag")
        assert await repo.get_setting("ui.flag") is None
        # 再删一次静默
        await repo.delete_setting("ui.flag")
    finally:
        await db.close()


async def _list_settings_sorted():
    db, repo = await _make_repo()
    try:
        for k, v in [("ui.b", "1"), ("ui.a", "2"), ("ui.c", "3")]:
            await repo.set_setting(k, json.dumps(v))
        keys = [k for k, _, _ in await repo.list_settings()]
        assert keys == ["ui.a", "ui.b", "ui.c"]
    finally:
        await db.close()


async def _reserved_prefix_guard():
    db, repo = await _make_repo()
    try:
        # homepage_panel_id 是系统键（由 /api/panels/homepage 专用接口管理）
        await repo.set_setting("homepage_panel_id", "panel-1")

        # 写入/删除 homepage 前缀 → 403
        for key in ("homepage_panel_id", "homepage", "homepageCustom"):
            assert is_reserved_key(key)
            try:
                ensure_not_reserved_key(key)
                raise AssertionError("保留前缀应被拒绝")
            except HTTPException as e:
                assert e.status_code == 403

        # 非保留前缀不受影响
        assert not is_reserved_key("ui.theme")
        ensure_not_reserved_key("ui.theme")

        # 读取放行：homepage_panel_id 可通过通用 GET 读到（返回裸字符串）
        raw = await repo.get_setting("homepage_panel_id")
        assert parse_setting_value(raw) == "panel-1"
    finally:
        await db.close()


def _key_pattern_rules():
    # 合法
    for key in ("theme", "ui.layout", "sidebar-collapsed", "k1_2-3", "A"):
        assert re.match(KEY_PATTERN, key), key
    # 非法：数字开头 / 空格 / 特殊字符 / 超长 / 空
    for key in ("1abc", "ui layout", "a.b/c", "a" * 65, ""):
        assert not re.match(KEY_PATTERN, key), key


def _legacy_value_compatibility():
    # 非 JSON 存储（如旧版裸字符串 panel-123）解析失败时原样返回
    assert parse_setting_value("panel-123") == "panel-123"
    assert parse_setting_value('{"a": 1}') == {"a": 1}
    assert parse_setting_value("123") == 123
    assert parse_setting_value("true") is True


def test_put_get_roundtrip():
    asyncio.run(_put_get_roundtrip())


def test_get_404_and_delete_silent():
    asyncio.run(_get_404_and_delete_silent())


def test_list_settings_sorted():
    asyncio.run(_list_settings_sorted())


def test_reserved_prefix_guard():
    asyncio.run(_reserved_prefix_guard())


def test_key_pattern_rules():
    _key_pattern_rules()


def test_legacy_value_compatibility():
    _legacy_value_compatibility()


if __name__ == "__main__":
    test_put_get_roundtrip()
    test_get_404_and_delete_silent()
    test_list_settings_sorted()
    test_reserved_prefix_guard()
    test_key_pattern_rules()
    test_legacy_value_compatibility()
    print("ALL SETTINGS API TESTS PASSED")
