"""readings 瘦身存储回归测试（2026-10 存储 slot 重构）。

覆盖:
- save_batch 瘦身落库: data 列写空串占位、standard_points 仅存 point_name/value/quality;
- 异常点位(quality != good)保留 metadata.error_code，正常点位不携带 metadata;
- query/get_latest_readings_by_device 对新格式行(data='')自动从 standard_points 重建 data;
- 旧格式行(含完整 data 列)直接使用原值，新旧格式共存兼容;
- standard_points 为空时保留 data(离线兜底路径不丢信息);
- query_point_trend 对瘦身格式行正常工作;
- to_storage_point 的 name 键兼容、error_code 提取、quality=None 回退;
- standard_points 含非 dict 脏元素时剔除坏点保留好点，全脏退回保留 data;
- 损坏 JSON 行不拖垮整个查询(_parse_reading_row 防御解析)。
"""
import asyncio
import json
import os
import sys
import tempfile

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

import aiosqlite
import pytest

from XAgent.xcore.storage.sqlite import SQLiteStorage
from XAgent.xcore.transform.standard_point import to_storage_point
from XAgent.xcore.domain.models.reading import Reading
from XAgent.xcore.rule_engine.aggregation import AggregationEngine
from XAgent.xcore.rule_engine.base import AggregationSubscription


def _full_point(name: str, value, quality: str = "good", error_code=None) -> dict:
    """模拟插件侧 to_dict() 产出的全量标准点位字典"""
    metadata = {"object_type": "binaryValue", "object_instance": 123, "writable": True}
    if error_code is not None:
        metadata["error_code"] = error_code
        metadata["error_message"] = "device_offline"
    return {
        "device_id": "dev_1",
        "point_name": name,
        "value": value,
        "data_type": "binary",
        "timestamp": 1792658939.6,
        "unit": None,
        "quality": quality,
        "metadata": metadata,
    }


def _reading(ts: float, points: list, data: dict = None) -> Reading:
    return Reading(
        asset="dev_1",
        timestamp=ts,
        service_name="test",
        data={p["point_name"]: p["value"] for p in points if isinstance(p, dict)} if data is None else data,
        tags=[],
        standard_points=points,
        device_status="online",
    )


@pytest.fixture()
def storage():
    s = SQLiteStorage()
    with tempfile.TemporaryDirectory() as tmp:
        db_path = os.path.join(tmp, "test.db")
        asyncio.run(s.initialize({"database": db_path}))
        yield s, db_path
        asyncio.run(s.close())


async def _insert_legacy_row(db_path: str, ts: float, data: dict, sp):
    """用独立连接写入旧格式行（完整 data + 全量 standard_points）。

    旧格式无法经由公开 API 产生（save_batch 现在恒定瘦身），因此测试
    直接落库模拟迁移期共存；sp 可传非 JSON 字符串模拟损坏行。
    """
    async with aiosqlite.connect(db_path) as db:
        await db.execute(
            "INSERT INTO readings (asset, timestamp, service_name, data, tags, standard_points, device_status)"
            " VALUES (?, ?, ?, ?, ?, ?, ?)",
            ("dev_1", ts, "legacy", json.dumps(data) if data is not None else None,
             "[]", json.dumps(sp) if sp is not None else None, "online"),
        )
        await db.commit()


# ---------- to_storage_point ----------

def test_to_storage_point_keeps_dynamic_fields():
    sp = to_storage_point(_full_point("p1", 1.0))
    assert sp == {"point_name": "p1", "value": 1.0, "quality": "good"}


def test_to_storage_point_keeps_error_code_on_bad_quality():
    sp = to_storage_point(_full_point("p1", None, quality="bad", error_code=3))
    assert sp["metadata"] == {"error_code": 3}
    assert "error_message" not in sp["metadata"]


def test_to_storage_point_drops_metadata_on_good_quality():
    sp = to_storage_point(_full_point("p1", 1.0))
    assert "metadata" not in sp


def test_to_storage_point_name_key_fallback():
    sp = to_storage_point({"name": "legacy", "value": 5, "quality": "good"})
    assert sp["point_name"] == "legacy"


def test_to_storage_point_quality_none_falls_back_good():
    """quality 键存在但为 None 时必须回退 good，而非落库 None"""
    sp = to_storage_point({"point_name": "p1", "value": 1, "quality": None})
    assert sp["quality"] == "good"
    assert "metadata" not in sp


# ---------- 瘦身往返 ----------

def test_slim_roundtrip_query_rebuilds_data(storage):
    s, _ = storage
    ts = 1792658939.0
    points = [_full_point("p1", 1.0), _full_point("p2", "on")]
    asyncio.run(s.save_batch([_reading(ts, points)]))

    readings = asyncio.run(s.query(asset="dev_1", limit=10))
    assert len(readings) == 1
    r = readings[0]
    # data 从 slim standard_points 重建
    assert r.data == {"p1": 1.0, "p2": "on"}
    # standard_points 已瘦身
    assert r.standard_points == [
        {"point_name": "p1", "value": 1.0, "quality": "good"},
        {"point_name": "p2", "value": "on", "quality": "good"},
    ]


def test_slim_roundtrip_latest_by_device(storage):
    s, _ = storage
    ts = 1792658939.0
    asyncio.run(s.save_batch([_reading(ts, [_full_point("p1", 7)])]))

    readings = asyncio.run(s.get_latest_readings_by_device())
    assert len(readings) == 1
    assert readings[0].data == {"p1": 7}
    assert readings[0].standard_points[0]["value"] == 7


def test_slim_roundtrip_point_trend(storage):
    s, _ = storage
    base = 1792658900.0
    rows = [_reading(base + i, [_full_point("p1", float(i))]) for i in range(5)]
    asyncio.run(s.save_batch(rows))

    trend = asyncio.run(s.query_point_trend(asset="dev_1", point_name="p1", limit=10))
    assert len(trend) == 5
    assert [t["value"] for t in trend] == [4.0, 3.0, 2.0, 1.0, 0.0]
    assert all(t["quality"] == "good" for t in trend)


def test_empty_standard_points_keeps_data(storage):
    """离线兜底路径：standard_points 为空时 data 必须原样保留"""
    s, _ = storage
    ts = 1792658939.0
    reading = _reading(ts, [], data={"p1": None, "p2": None})
    reading.standard_points = []
    asyncio.run(s.save_batch([reading]))

    readings = asyncio.run(s.query(asset="dev_1", limit=10))
    assert readings[0].data == {"p1": None, "p2": None}


def test_bad_quality_error_code_survives_roundtrip(storage):
    s, _ = storage
    ts = 1792658939.0
    points = [_full_point("ok", 1.0), _full_point("err", None, quality="bad", error_code=3)]
    asyncio.run(s.save_batch([_reading(ts, points)]))

    readings = asyncio.run(s.query(asset="dev_1", limit=10))
    sp_by_name = {p["point_name"]: p for p in readings[0].standard_points}
    assert "metadata" not in sp_by_name["ok"]
    assert sp_by_name["err"]["metadata"] == {"error_code": 3}


def test_dirty_elements_filtered_good_points_kept(storage):
    """sp 含非 dict 脏元素：坏点剔除、好点保留、data 正常重建"""
    s, _ = storage
    ts = 1792658939.0
    points = [_full_point("good1", 1.0), "dirty-string", 42, _full_point("good2", 2.0)]
    asyncio.run(s.save_batch([_reading(ts, points)]))

    readings = asyncio.run(s.query(asset="dev_1", limit=10))
    assert readings[0].data == {"good1": 1.0, "good2": 2.0}
    assert [p["point_name"] for p in readings[0].standard_points] == ["good1", "good2"]


def test_all_dirty_elements_falls_back_to_data(storage):
    """sp 全为脏元素：退回保留原 data，不丢信息"""
    s, _ = storage
    ts = 1792658939.0
    reading = _reading(ts, ["dirty1", "dirty2"], data={"p1": 1.0})
    asyncio.run(s.save_batch([reading]))

    readings = asyncio.run(s.query(asset="dev_1", limit=10))
    assert readings[0].data == {"p1": 1.0}


# ---------- 旧格式兼容 ----------

def test_legacy_row_with_data_column_untouched(storage):
    """迁移期共存：旧行(完整 data + 全量 standard_points)读取行为不变"""
    s, db_path = storage
    ts = 1792658800.0
    legacy_data = {"p1": 42, "p2": 3.14}
    legacy_sp = [
        dict(_full_point("p1", 42), extra="legacy"),
        dict(_full_point("p2", 3.14), extra="legacy"),
    ]
    asyncio.run(_insert_legacy_row(db_path, ts, legacy_data, legacy_sp))

    readings = asyncio.run(s.query(asset="dev_1", limit=10))
    assert readings[0].data == legacy_data
    assert readings[0].standard_points == legacy_sp

    # 旧行上的 trend 查询仍然命中
    trend = asyncio.run(s.query_point_trend(asset="dev_1", point_name="p1", limit=10))
    assert len(trend) == 1 and trend[0]["value"] == 42


def test_new_and_legacy_rows_coexist(storage):
    """新旧格式同表共存，各自的 data 均正确"""
    s, db_path = storage
    legacy_data = {"p1": 42}
    asyncio.run(_insert_legacy_row(db_path, 1000.0, legacy_data, [_full_point("p1", 42)]))
    asyncio.run(s.save_batch([_reading(2000.0, [_full_point("p1", 99)])]))

    readings = asyncio.run(s.query(asset="dev_1", limit=10))
    by_ts = {r.timestamp: r for r in readings}
    assert by_ts[1000.0].data == {"p1": 42}
    assert by_ts[2000.0].data == {"p1": 99}


def test_corrupted_json_rows_do_not_break_query(storage):
    """损坏 JSON 行：data/sp 列均损坏时不抛异常，返回空 data/sp，其余行正常"""
    s, db_path = storage
    asyncio.run(_insert_legacy_row(db_path, 1000.0, {"p1": 1}, None))  # sp 为 NULL
    # 损坏行：data 与 sp 均为非法 JSON
    asyncio.run(_insert_legacy_row(db_path, 1500.0, {"ignored": True}, "not-json{"))
    asyncio.run(_insert_legacy_row(db_path, 1500.5, "{corrupted", [_full_point("p1", 5)]))
    asyncio.run(s.save_batch([_reading(2000.0, [_full_point("p1", 99)])]))

    readings = asyncio.run(s.query(asset="dev_1", limit=10))
    by_ts = {r.timestamp: r for r in readings}
    # NULL sp 行（旧行为：data 原样保留）
    assert by_ts[1000.0].data == {"p1": 1}
    # sp 损坏但 data 有效：data 保留
    assert by_ts[1500.0].data == {"ignored": True}
    assert by_ts[1500.0].standard_points == []
    # data 损坏但 sp 有效：data 从 sp 重建
    assert by_ts[1500.5].data == {"p1": 5}
    # 正常新格式行不受影响
    assert by_ts[2000.0].data == {"p1": 99}


# ---------- 聚合单点回查（regression: query 误传 point_name 参数） ----------

def test_aggregation_single_result_queries_latest_snapshot(storage):
    """规则引擎 aggregation=none 单点回查：从 asset 最新快照按点位名取值。

    旧代码向 storage.query 传不存在的 point_name 参数，TypeError 被
    _get_single_result 的 except 吞掉，导致回查值恒为 None。
    """
    s, _ = storage
    asyncio.run(s.save_batch([_reading(1000.0, [_full_point("p1", 42)])]))

    engine = AggregationEngine(storage=s, cache_ttl=0)
    sub = AggregationSubscription(
        subscription_id="sub_1",
        rule_id="rule_1",
        asset="dev_1",
        point_name="p1",
    )
    result = asyncio.run(engine._get_single_result(sub))
    assert result.value == 42
    assert result.asset == "dev_1"
    assert result.point_name == "p1"
    assert result.quality == "good"


def test_aggregation_single_result_reads_point_quality(storage):
    """单点回查的 quality 取自点位级 standard_points，而非恒为 good。

    旧代码 getattr(reading, 'quality', None) 读不存在的行级属性，
    异常点位被误标为 good。
    """
    s, _ = storage
    points = [_full_point("ok", 1.0), _full_point("err", None, quality="bad", error_code=3)]
    asyncio.run(s.save_batch([_reading(1000.0, points)]))

    engine = AggregationEngine(storage=s, cache_ttl=0)
    err_sub = AggregationSubscription(
        subscription_id="sub_err", rule_id="rule_1",
        asset="dev_1", point_name="err",
    )
    result = asyncio.run(engine._get_single_result(err_sub))
    assert result.quality == "bad"

    ok_sub = AggregationSubscription(
        subscription_id="sub_ok", rule_id="rule_1",
        asset="dev_1", point_name="ok",
    )
    result = asyncio.run(engine._get_single_result(ok_sub))
    assert result.quality == "good"
