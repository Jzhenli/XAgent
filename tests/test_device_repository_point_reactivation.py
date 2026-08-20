"""设备点位"删除后重新添加"回归测试（方案A）。

校验 ConfigRepository.add_point 在 (asset, point_name) 已被软删除(deleted)占用时，
能够用新配置将其复活为 active，而不是误报 "already exists"。

运行方式（项目根目录，即 XAgent/ 下）：
    pytest tests/test_device_repository_point_reactivation.py

若环境未安装 pytest-asyncio，可用以下方式直接运行：
    python tests/test_device_repository_point_reactivation.py
"""

import asyncio
import os
import sys

import aiosqlite
import pytest
import pytest_asyncio

# 将 src/ 加入路径，使运行时的包根为 XAgent（src/XAgent 含 __init__.py）
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from XAgent.xcore.api.repositories.device_repository import ConfigRepository
from XAgent.xcore.config.device_config import DeviceConfig
from XAgent.xcore.storage.sqlite import SQLiteStorage

# 所有 async 测试函数由 pytest-asyncio 驱动
pytestmark = pytest.mark.asyncio


async def make_repo() -> tuple[ConfigRepository, aiosqlite.Connection]:
    """构造一个基于内存库、已建表的 ConfigRepository 及其连接。"""
    db = await aiosqlite.connect(":memory:")
    storage = SQLiteStorage()
    storage._db = db
    # 直接复用 storage 的建表逻辑，保证表结构与生产一致
    await storage._create_metadata_tables()
    await db.commit()
    return ConfigRepository(db), db


def make_device(asset: str) -> DeviceConfig:
    return DeviceConfig(
        asset=asset,
        name=asset,
        plugin_name="bacnet",
        plugin_config={"host": "127.0.0.1"},
    )


def make_point(name: str, description: str) -> dict:
    return {
        "name": name,
        "description": description,
        "data_type": "float",
        "unit": "",
        "config": {"address": 1},
        "metadata": {},
        "tags": [],
        "enabled": True,
    }


@pytest_asyncio.fixture
async def repo():
    repository, db = await make_repo()
    yield repository
    await db.close()


async def _seed_device(repo: ConfigRepository, asset: str) -> None:
    await repo.create_device(make_device(asset), user="test")


# ---------- 测试用例 ----------

async def test_add_after_delete_reactivates_point(repo: ConfigRepository):
    """核心回归：删除点位后，用同名重新添加应成功（复活软删除记录）。"""
    asset = "bacnet_131"
    await _seed_device(repo, asset)

    point = make_point("Multi-state Value_148", "first add")
    await repo.add_point(asset, point, user="test")

    # 删除（软删除）
    await repo.delete_point(asset, "Multi-state Value_148", user="test")

    # 查询设备不应再看到该 active 点位
    device_after_delete = await repo.get_device(asset)
    assert all(p["name"] != "Multi-state Value_148" for p in device_after_delete.points)

    # 用新配置重新添加同名点位
    new_point = make_point("Multi-state Value_148", "re-added with new config")
    await repo.add_point(asset, new_point, user="test")

    # 应成功复活：设备可见且配置为新值
    device = await repo.get_device(asset)
    names = [p["name"] for p in device.points]
    assert "Multi-state Value_148" in names
    reactivated = next(p for p in device.points if p["name"] == "Multi-state Value_148")
    assert reactivated["description"] == "re-added with new config"
    # _get_device_points 只返回 active 点位，能查到即说明已被复活为 active
    assert reactivated["name"] == "Multi-state Value_148"


async def test_add_duplicate_active_still_raises(repo: ConfigRepository):
    """防护不退化：两个 active 同名点位仍应报 'already exists'。"""
    asset = "bacnet_131"
    await _seed_device(repo, asset)

    await repo.add_point(asset, make_point("Point_A", "v1"), user="test")

    with pytest.raises(ValueError) as exc:
        await repo.add_point(asset, make_point("Point_A", "v2"), user="test")
    assert "already exists" in str(exc.value)


async def test_reactivate_resets_created_at(repo: ConfigRepository):
    """复活时应重置 created_at / updated_at 为当前时间，deleted_at 清零。"""
    asset = "bacnet_131"
    await _seed_device(repo, asset)

    await repo.add_point(asset, make_point("P", "v1"), user="test")
    await repo.delete_point(asset, "P", user="test")

    # 直接验证 DB 中软删除记录的 deleted_at 已写入
    async with repo._db.execute(
        "SELECT deleted_at FROM point_registry WHERE asset=? AND point_name=?",
        (asset, "P"),
    ) as cur:
        row = await cur.fetchone()
    assert row is not None and row[0] is not None

    await repo.add_point(asset, make_point("P", "v2"), user="test")

    async with repo._db.execute(
        "SELECT created_at, updated_at, deleted_at, status FROM point_registry "
        "WHERE asset=? AND point_name=?",
        (asset, "P"),
    ) as cur:
        row = await cur.fetchone()
    created_at, updated_at, deleted_at, status = row
    assert status == "active"
    assert deleted_at is None
    assert created_at == updated_at  # 复活视为新生命周期起点


async def test_delete_then_delete_again_raises_not_found(repo: ConfigRepository):
    """边界：对已软删除的点位再次删除应报 not found（而非静默成功）。"""
    asset = "bacnet_131"
    await _seed_device(repo, asset)

    await repo.add_point(asset, make_point("P", "v1"), user="test")
    await repo.delete_point(asset, "P", user="test")

    with pytest.raises(ValueError) as exc:
        await repo.delete_point(asset, "P", user="test")
    assert "not found" in str(exc.value)
