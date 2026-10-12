"""CommandExecutor 韧性回归测试。

背景：Android 平板长期运行后出现"写命令入队后永不执行"（状态卡 ACCEPTED）。
根因是 CommandExecutor 单协程 worker 串行消费，任一命令悬挂（插件协程吞
CancelledError）或 worker 静默死亡，都会导致后续所有命令卡在队列。

覆盖的防护机制：
1. 放弃式硬超时：单条命令悬挂不再拖死 worker（形态 B）
2. 终态保护：超时标 FAILED 后，孤儿后台任务真实完成不覆盖状态
3. worker 自愈：意外死亡（BaseException）自动重建，异常栈落日志（形态 A）
4. 自愈熔断：连续崩溃达到阈值后停止自愈，submit 拒绝命令
5. stop 后拒绝 submit；禁用自愈时 submit 自动拉起死亡 worker
6. stop 取消孤儿任务（插件吞取消时最多等待 5s 后返回，不拖死 shutdown）
"""
import asyncio
import os
import sys
from unittest import mock

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from XAgent.xcore.api.services.command_executor import CommandExecutor


HARD_TIMEOUT = 0.2
# 放弃式硬超时触发的等待余量
SETTLE = 0.6


class _FakePlugin:
    def __init__(self, instance):
        self.plugin_id = "south_bacnet_test_asset"
        self.name = "bacnet"
        self.instance = instance


class _FakeLoader:
    def __init__(self, instance):
        self._instance = instance

    def get_plugins_by_type(self, plugin_type):
        return [_FakePlugin(self._instance)]


class _SwallowingWrite:
    """模拟 bacpypes3 病态行为：吞掉 CancelledError 且不返回。

    - release.wait()：正常等待点（未取消时挂在这里）；
    - 被取消时吞掉异常并挂到 complete_after.wait()，模拟"吞取消且永不返回"；
    - complete_after 置位后返回 True，用于验证终态保护。
    """

    def __init__(self):
        self.swallowed_cancel = False
        self.release = asyncio.Event()
        self.complete_after = asyncio.Event()

    async def write_setpoint(self, asset, point, value):
        try:
            await self.release.wait()
        except asyncio.CancelledError:
            self.swallowed_cancel = True
            await self.complete_after.wait()
        return True


class _NormalWrite:
    async def write_setpoint(self, asset, point, value):
        await asyncio.sleep(0)
        return True


def _make_executor(write_impl, hard_timeout=HARD_TIMEOUT):
    executor = CommandExecutor(hard_timeout=hard_timeout)
    executor.set_plugin_loader(_FakeLoader(write_impl))
    return executor


def _submit(executor, command_id):
    return executor.submit_command(
        command_id=command_id,
        target_service="bacnet",
        target_asset="test_asset",
        operation="write_setpoint",
        parameters={"point": "p1", "value": 1},
    )


async def _worker_survives_hung_write_and_final_state_protected():
    write = _SwallowingWrite()
    executor = _make_executor(write)
    await executor.start()
    try:
        # 1. 提交会悬挂的命令（release 未 set，write_setpoint 永久挂起）
        assert await _submit(executor, "cmd-hung") is True
        await asyncio.sleep(SETTLE)

        # 放弃式硬超时生效：命令标 FAILED 而非永久 EXECUTING/ACCEPTED
        status = executor.get_command_status("cmd-hung")
        assert status is not None and status["status"] == "FAILED", status
        assert "timeout" in (status["error"] or "").lower(), status

        # 2. 释放写协程：孤儿在后台真实完成
        write.release.set()
        await asyncio.sleep(0.2)

        # 3. 关键断言：悬挂命令之后新命令仍被正常消费（worker 未被拖死）
        assert await _submit(executor, "cmd-after") is True
        await asyncio.sleep(SETTLE)
        status = executor.get_command_status("cmd-after")
        assert status is not None and status["status"] == "COMPLETED", status

        # 4. 终态保护：孤儿真实完成不把 cmd-hung 覆盖为 COMPLETED
        status = executor.get_command_status("cmd-hung")
        assert status["status"] == "FAILED", status
        assert status["result"] is None, status
    finally:
        await executor.stop()


async def _stop_cancels_orphan_even_when_plugin_swallows_cancel():
    write = _SwallowingWrite()
    executor = _make_executor(write)
    await executor.start()
    assert await _submit(executor, "cmd-orphan") is True
    await asyncio.sleep(SETTLE)
    assert executor.get_command_status("cmd-orphan")["status"] == "FAILED"

    # stop 取消孤儿 → 插件吞取消（wait_for 等待终止会永久悬挂）
    # → stop 的 asyncio.wait(timeout=5) 放弃等待后仍能返回
    await asyncio.wait_for(executor.stop(), timeout=8.0)
    assert write.swallowed_cancel is True, "取消应已传播到插件协程"


async def _worker_self_heals_on_crash():
    executor = _make_executor(_NormalWrite())
    original = CommandExecutor._execute_with_hard_timeout
    calls = {"n": 0}

    class _FatalWorkerError(BaseException):
        pass

    async def crashing(self, command):
        calls["n"] += 1
        if calls["n"] == 1:
            raise _FatalWorkerError("simulated worker crash")
        return await original(self, command)

    with mock.patch.object(CommandExecutor, "_execute_with_hard_timeout", crashing):
        await executor.start()
        assert await _submit(executor, "cmd-crash") is True
        await asyncio.sleep(SETTLE)

        # worker 意外死亡后自愈重建
        assert executor._restart_failures == 1, executor._restart_failures
        assert not executor._worker_task.done()

        # 自愈后的 worker 继续正常消费
        assert await _submit(executor, "cmd-after-crash") is True
        await asyncio.sleep(SETTLE)
        status = executor.get_command_status("cmd-after-crash")
        assert status is not None and status["status"] == "COMPLETED", status
    await executor.stop()


async def _circuit_breaker_opens_after_repeated_crashes():
    executor = _make_executor(_NormalWrite())

    class _FatalWorkerError(BaseException):
        pass

    async def always_crash(self, command):
        raise _FatalWorkerError("simulated worker crash")

    with mock.patch.object(CommandExecutor, "_execute_with_hard_timeout", always_crash):
        await executor.start()
        # 阈值 5：前 5 次崩溃触发自愈，第 6 次后熔断打开
        for i in range(6):
            await _submit(executor, f"cmd-crash-{i}")
            await asyncio.sleep(0.1)

        # 熔断后不再自愈
        await asyncio.sleep(0.2)
        assert executor._worker_task.done()
        assert executor._restart_failures > executor._max_worker_restarts

        # 熔断打开时 submit 拒绝命令（避免拉起-崩溃死循环）
        assert await _submit(executor, "cmd-rejected") is False
    await executor.stop()


async def _submit_rejected_when_stopped():
    executor = _make_executor(_NormalWrite())
    await executor.start()
    await executor.stop()
    assert await _submit(executor, "cmd-stopped") is False


async def _submit_restarts_dead_worker():
    executor = _make_executor(_NormalWrite())
    # 禁用自愈（隔离 done-callback 路径），专注验证 submit 的自动拉起
    executor._on_worker_done = lambda task: None
    await executor.start()
    executor._worker_task.cancel()
    await asyncio.sleep(0.1)
    assert executor._worker_task.done()

    assert await _submit(executor, "cmd-restart") is True
    assert not executor._worker_task.done(), "submit 应拉起新 worker"

    await asyncio.sleep(SETTLE)
    status = executor.get_command_status("cmd-restart")
    assert status is not None and status["status"] == "COMPLETED", status
    await executor.stop()


def test_worker_survives_hung_write_and_final_state_protected():
    asyncio.run(_worker_survives_hung_write_and_final_state_protected())


def test_stop_cancels_orphan_even_when_plugin_swallows_cancel():
    asyncio.run(_stop_cancels_orphan_even_when_plugin_swallows_cancel())


def test_worker_self_heals_on_crash():
    asyncio.run(_worker_self_heals_on_crash())


def test_circuit_breaker_opens_after_repeated_crashes():
    asyncio.run(_circuit_breaker_opens_after_repeated_crashes())


def test_submit_rejected_when_stopped():
    asyncio.run(_submit_rejected_when_stopped())


def test_submit_restarts_dead_worker():
    asyncio.run(_submit_restarts_dead_worker())


async def _bacnet_write_timeout_propagates_as_timeout():
    """BACnet 写超时应向上传播为 TimeoutError（命令终态 FAILED），
    而不是返回 False（会被标为 COMPLETED(result=False) 造成误导）。"""
    from unittest.mock import MagicMock

    from XAgent.plugins.south.bacnet.plugin import BACnetPlugin

    plugin = BACnetPlugin.__new__(BACnetPlugin)
    plugin._connected = True
    plugin._app = MagicMock()
    plugin._write_points = {"p1": {"config": {}}}
    plugin._write_timeout = 0.05
    plugin._host = "1.2.3.4"
    plugin._port = 47808
    plugin._reverse_transform_value = lambda v, cfg: v

    async def hung_write_property(*args, **kwargs):
        await asyncio.Event().wait()  # 永不完成，等待被取消

    plugin._app.write_property = hung_write_property

    try:
        await plugin.write_setpoint("asset", "p1", 1)
        raise AssertionError("write_setpoint 应抛出 TimeoutError 而非返回 False")
    except asyncio.TimeoutError:
        pass


def test_bacnet_write_timeout_propagates_as_timeout():
    asyncio.run(_bacnet_write_timeout_propagates_as_timeout())
