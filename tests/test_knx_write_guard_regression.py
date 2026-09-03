"""KNX 写路径会话守卫回归测试（K2，文档§K2「读写均须守卫」）。

覆盖 2026-09-03 第二轮代码 review 修复 A：_write_device_value 必须包裹在
_session_read_guard 内，共享会话 teardown/rebuild 期间不向已 stop 的 XKNX 写数据。

验证真实 _session_read_guard 方法：
- 共享模式（enable_session_sharing=True）应委托 session.read_guard()；
- 独占模式（enable_session_sharing=False）应跳过守卫、直接写。
"""
import asyncio
import os
import sys
from unittest.mock import AsyncMock, MagicMock, patch

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from XAgent.plugins.south.knx.plugin import KNXPlugin
from XAgent.plugins.south.knx.session import KNXSessionManager


def _make_guard_cm():
    cm = AsyncMock()
    cm.__aenter__ = AsyncMock(return_value=None)
    cm.__aexit__ = AsyncMock(return_value=False)
    return cm


async def _write_uses_session_guard_in_shared_mode():
    plugin = KNXPlugin.__new__(KNXPlugin)

    fake_session = MagicMock()
    fake_session.xknx = MagicMock()  # 非 None：_session_read_guard 会进入守卫
    guard_cm = _make_guard_cm()
    fake_session.read_guard.return_value = guard_cm

    with patch.object(KNXSessionManager, "get_session", return_value=fake_session):
        plugin._enable_session_sharing = True
        plugin._session_key = "shared-key"
        device = MagicMock()
        device.set_on = AsyncMock()
        ok = await plugin._write_device_value(device, "switch", True)
        assert ok is True
        assert guard_cm.__aenter__.called, "共享模式写命令应在会话守卫内执行"
        assert device.set_on.called


async def _write_skips_guard_in_exclusive_mode():
    plugin = KNXPlugin.__new__(KNXPlugin)

    fake_session = MagicMock()
    fake_session.xknx = MagicMock()
    guard_cm = _make_guard_cm()
    fake_session.read_guard.return_value = guard_cm

    with patch.object(KNXSessionManager, "get_session", return_value=fake_session):
        plugin._enable_session_sharing = False  # 独占模式：守卫应为空操作
        plugin._session_key = "shared-key"
        device = MagicMock()
        device.set_on = AsyncMock()
        ok = await plugin._write_device_value(device, "switch", True)
        assert ok is True
        assert not guard_cm.__aenter__.called, "独占模式不应进入会话守卫"
        assert device.set_on.called


def test_knx_write_uses_session_guard_in_shared_mode():
    asyncio.run(_write_uses_session_guard_in_shared_mode())


def test_knx_write_skips_guard_in_exclusive_mode():
    asyncio.run(_write_skips_guard_in_exclusive_mode())
