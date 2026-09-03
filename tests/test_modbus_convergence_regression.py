"""Modbus 收敛整改回归测试（M1 第3/4层）。

覆盖 2026-09-03 第二轮代码 review 修复：
- B（M1 第4层）：单轮超时预算超支时，剩余分组测点应填入 raw_data（None），
  交由 converter 标记 quality=bad，不静默丢点（首分组即超预算时整轮返回空列表的边界）。
- C（M1 第3层）：从站已熔断时 _check_heartbeat 不应真实发请求，
  避免递减 pymodbus 的 count_until_disconnect 计数、触发 connection_lost() 拖垮共享连接。

纯 mock，无需真实串口 / TCP 网关 / pymodbus 网络栈。
"""
import asyncio
import os
import sys
import time
from unittest.mock import AsyncMock, MagicMock

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from XAgent.plugins.south.modbus.base import ModbusBasePlugin


class _ConcreteModbus(ModbusBasePlugin):
    """仅为测试结果实例化（跳过 __init__）而实现抽象方法占位；测试不触发这些路径。"""

    def _build_session_key(self, *a, **k):
        return "k"

    def _check_modbus_available(self, *a, **k):
        return True

    def _connect_client(self, *a, **k):
        return None

    def _create_client(self, *a, **k):
        return MagicMock()

    def _disconnect_client(self, *a, **k):
        return None

    def _get_connection_info(self, *a, **k):
        return {}

    def _is_client_connected(self, *a, **k):
        return True


async def _budget_marks_remaining_points_bad():
    p = _ConcreteModbus.__new__(_ConcreteModbus)
    p._asset_name = "reg-modbus"
    p._read_groups = [["p1", "p2"], ["p3", "p4"]]
    p._poll_budget_deadline = time.time() - 1.0  # 已过期：首分组即触发 budget break
    p._read_group = AsyncMock(return_value={})   # 不应被调用（budget 先触发）
    p._device_online = False
    p._points = []

    captured = {}

    def fake_convert(raw_data, points, ctx):
        captured.update(raw_data)
        return []  # 仅捕获 raw_data 填充结果，避免触碰 StandardDataPoint 构造

    p.convert_data = fake_convert
    p.create_reading_from_points = MagicMock(return_value=MagicMock())
    p._persist_and_publish = AsyncMock()

    await p._poll_with_batch()

    # 首分组即超预算：所有测点都应被以 None 填入 raw_data，不静默丢点
    assert captured.get("p1") is None, "p1 应被填入 None（标 bad），而非静默丢失"
    assert captured.get("p2") is None, "p2 应被填入 None（标 bad），而非静默丢失"
    assert captured.get("p3") is None, "p3 应被填入 None（标 bad），而非静默丢失"
    assert captured.get("p4") is None, "p4 应被填入 None（标 bad），而非静默丢失"
    # budget 先触发，_read_group 不应被调用
    assert not p._read_group.called


async def _heartbeat_skips_request_when_breaker_open():
    p = _ConcreteModbus.__new__(_ConcreteModbus)
    p._client = MagicMock()
    p._client.read_holding_registers = AsyncMock(
        side_effect=AssertionError("熔断期间不应真实发心跳请求")
    )
    p._session = MagicMock()
    p._session.bus_lock = None  # 走无锁分支，避免 MagicMock 作为 async CM
    breaker = MagicMock()
    breaker.is_open.return_value = True
    p._session.get_breaker.return_value = breaker
    p._slave_id = 1
    p._heartbeat_address = 0
    p._heartbeat_timeout = 1.0
    p._device_online = True

    result = await p._check_heartbeat()

    assert result is False, "从站已熔断时心跳应判定不可用"
    assert p._device_online is False
    assert not p._client.read_holding_registers.called, "熔断期间不应向死从站发请求"


async def _heartbeat_requests_when_breaker_closed():
    p = _ConcreteModbus.__new__(_ConcreteModbus)
    resp = MagicMock()
    resp.isError.return_value = False
    p._client = MagicMock()
    p._client.read_holding_registers = AsyncMock(return_value=resp)
    p._session = MagicMock()
    p._session.bus_lock = None
    breaker = MagicMock()
    breaker.is_open.return_value = False  # 未熔断
    p._session.get_breaker.return_value = breaker
    p._slave_id = 1
    p._heartbeat_address = 0
    p._heartbeat_timeout = 1.0
    p._device_online = True
    p._heartbeat_miss_count = 0

    result = await p._check_heartbeat()

    assert result is True, "未熔断时应正常发心跳并判定可用"
    assert p._client.read_holding_registers.called, "未熔断时应真实发心跳请求"


def test_budget_exceeded_marks_remaining_points_bad():
    asyncio.run(_budget_marks_remaining_points_bad())


def test_heartbeat_skips_request_when_slave_breaker_open():
    asyncio.run(_heartbeat_skips_request_when_breaker_open())


def test_heartbeat_requests_when_breaker_closed():
    asyncio.run(_heartbeat_requests_when_breaker_closed())
