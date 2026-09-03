"""KNX 共享会话管理器离线单测（K2/K3 核心逻辑，无需真实 KNX 网关）。

覆盖：
- 同 key 多实例共享同一 XKNX（引用计数 + 单实例创建）
- 单实例释放不拖垮会话；最后一实例释放才真正 stop
- 读守卫：进行中的读阻塞 teardown 直到完成
- rebuild：停旧建新、重注册回调、re-setup 所有 holder
- build_session_key 归一化（大小写/缺省）

完整 KNX 行为（routing 多播收敛、tunneling 槽位收敛、设备名唯一、链路自愈）
仍需配合真实 KNX 网关（routing + tunnel 各一组）做集成测试，见整改方案 §8.4。
"""
import asyncio
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from XAgent.plugins.south.knx.session import KNXSessionManager, build_session_key


class FakeDevices:
    def __init__(self):
        self.cbs = []

    def register_device_updated_cb(self, cb):
        self.cbs.append(cb)

    def unregister_device_updated_cb(self, cb):
        if cb in self.cbs:
            self.cbs.remove(cb)


class FakeTelegramQueue:
    def __init__(self):
        self.cbs = []

    def register_telegram_received_cb(self, cb):
        self.cbs.append(cb)

    def unregister_telegram_received_cb(self, cb):
        if cb in self.cbs:
            self.cbs.remove(cb)


class FakeXKNX:
    _next_id = 0

    def __init__(self, connection_config=None):
        FakeXKNX._next_id += 1
        self.id = FakeXKNX._next_id
        self.connection_config = connection_config
        self.devices = FakeDevices()
        self.telegram_queue = FakeTelegramQueue()
        self.started = False
        self.stopped = False
        self.current_address = "1.1.1"

    async def start(self):
        self.started = True

    async def stop(self):
        self.stopped = True


def make_factory(calls=None):
    async def _f():
        if calls is not None:
            calls.append(1)
        x = FakeXKNX()
        await x.start()
        return x
    return _f


KEY = build_session_key("tunneling", "1.2.3.4", 3671, "10.0.0.2", True)


async def _reset():
    KNXSessionManager._sessions.clear()
    # 重新绑定到当前事件循环，避免跨 asyncio.run 复用锁导致的 loop 绑定错误
    KNXSessionManager._global_lock = asyncio.Lock()


async def _shared_refcount():
    await _reset()
    calls = []
    cb = lambda *a: None
    x1 = await KNXSessionManager.acquire("i1", KEY, make_factory(calls), cb, cb, lambda x: None)
    x2 = await KNXSessionManager.acquire("i2", KEY, make_factory(calls), cb, cb, lambda x: None)
    assert x1 is x2, "同 key 应共享同一 XKNX 实例"
    assert x1.started
    assert len(calls) == 1, "工厂只应被调用一次（首建者）"

    # 释放一个实例：XKNX 仍存活
    await KNXSessionManager.release("i1", KEY)
    sess = KNXSessionManager.get_session(KEY)
    assert sess is not None and sess.xknx is not None
    assert x1.stopped is False

    # 释放最后一个实例：真正 teardown
    await KNXSessionManager.release("i2", KEY)
    assert KNXSessionManager.get_session(KEY) is None
    assert x1.stopped is True


async def _read_guard_blocks_teardown():
    await _reset()
    cb = lambda *a: None
    x = await KNXSessionManager.acquire("i1", KEY, make_factory(), cb, cb, lambda x: None)
    sess = KNXSessionManager.get_session(KEY)

    read_started = asyncio.Event()
    reader_started = False

    async def reader():
        nonlocal reader_started
        async with sess.read_guard():
            reader_started = True
            read_started.set()
            await asyncio.sleep(0.2)

    rt = asyncio.create_task(reader())
    await read_started.wait()

    rel = asyncio.create_task(KNXSessionManager.release("i1", KEY))
    await asyncio.sleep(0.05)
    # 进行中的读未完成时，teardown 仍在等待，XKNX 不应被 stop
    assert x.stopped is False, "读守卫应阻塞 teardown 直到在途读完成"

    await rt
    await rel
    assert x.stopped is True, "在途读完成后应完成 teardown"


async def _rebuild_recreates_and_reregisters():
    await _reset()
    cb = lambda *a: None
    setups = []
    async def setup_cb(x):
        setups.append(x)

    x1 = await KNXSessionManager.acquire("i1", KEY, make_factory(), cb, cb, setup_cb)
    x2 = await KNXSessionManager.acquire("i2", KEY, make_factory(), cb, cb, setup_cb)

    await KNXSessionManager.rebuild_session(KEY, make_factory())
    sess = KNXSessionManager.get_session(KEY)
    xnew = sess.xknx
    assert xnew is not x1 and xnew is not x2, "rebuild 应创建新 XKNX"
    assert x1.stopped is True, "旧 XKNX 应被 stop"
    assert xnew.started is True
    # 所有 holder 的 setup_cb 用新 XKNX 重跑
    assert setups == [xnew, xnew]
    # 两个 holder 的回调都重注册到新 XKNX
    assert len(xnew.devices.cbs) == 2
    assert len(xnew.telegram_queue.cbs) == 2


def test_shared_session_refcount():
    asyncio.run(_shared_refcount())


def test_read_guard_blocks_teardown():
    asyncio.run(_read_guard_blocks_teardown())


def test_rebuild_recreates_and_reregisters():
    asyncio.run(_rebuild_recreates_and_reregisters())


def test_build_session_key_normalizes():
    k1 = build_session_key("TUNNELING", "1.2.3.4", 3671, "10.0.0.2", True)
    k2 = build_session_key("tunneling", "1.2.3.4", 3671, "10.0.0.2", True)
    assert k1 == k2
    # 缺省/空值归一化，保证同网关收敛到同一 key
    k3 = build_session_key("routing", None, None, "10.0.0.2", False)
    k4 = build_session_key("ROUTING", "", 0, "10.0.0.2", False)
    assert k3 == k4


if __name__ == "__main__":
    test_shared_session_refcount()
    test_read_guard_blocks_teardown()
    test_rebuild_recreates_and_reregisters()
    test_build_session_key_normalizes()
    print("all knx session tests passed")
