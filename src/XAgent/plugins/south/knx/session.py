"""KNX 共享会话管理（K2/K3 收敛）：按网关/多播组共享单个 XKNX 实例。

设计目标（对应文档 §K2/K3）：
- 同一 (connection_type, gateway_ip, gateway_port, local_ip, route_back) 的多台 KNX 设备
  共享一个 XKNX 连接：
  - routing 模式 → 同一多播组仅 1 个多播 socket；
  - tunneling 模式 → 同一网关仅 1 条隧道，远低于网关 4 槽上限。
- 引用计数 + 会话锁 + 读守卫，解决文档 §K2「难题 2/3」：
  - 单设备卸载只释放引用，不拖垮共享会话；仅最后一个引用释放者才真正 stop XKNX。
  - 关闭/重建期间进行中的读快速等待，避免对已停止/替换中的 XKNX 读写出错。
- link 级重建由会话持有者统一处理：xknx 自带 auto_reconnect 已覆盖大部分瞬时断链；
  持久的 link 失效由插件触发 ``rebuild_session`` 重建并重新 setup 所有 holder 的设备。

复用 M1 的共享会话模式；插件侧保留 ``enable_session_sharing=False`` 回退到每设备独占 XKNX。
"""
import asyncio
import logging
import time
from typing import Any, Awaitable, Callable, Dict, Optional, Tuple

logger = logging.getLogger(__name__)

# (connection_type, gateway_ip, gateway_port, local_ip, route_back)
SessionKey = Tuple[str, str, int, str, bool]


def build_session_key(
    connection_type: str,
    gateway_ip: Optional[str],
    gateway_port: Optional[int],
    local_ip: Optional[str],
    route_back: bool,
) -> SessionKey:
    """构造会话收敛 key。

    routing 模式下 gateway_ip 仅用于发现，多播组固定，因此按 (connection_type, local_ip)
    即可收敛到同一多播 socket；tunneling 模式按网关地址收敛到同一隧道。统一用全字段 key
    既覆盖两者又对参数差异天然区分。
    """
    return (
        (connection_type or "").lower(),
        gateway_ip or "",
        int(gateway_port or 0),
        local_ip or "",
        bool(route_back),
    )


class _ReadGuard:
    """异步上下文管理器：进入期间计入在途读计数，供 teardown/rebuild 等待其排空。"""

    def __init__(self, session: "KNXSession"):
        self._session = session

    async def __aenter__(self) -> "_ReadGuard":
        async with self._session._cond:
            # 若正在关闭/重建，等待其结束（重建完成后 XKNX 已换新，读可安全继续）
            while self._session._closing:
                await self._session._cond.wait()
            if self._session.xknx is None:
                raise RuntimeError("KNX session has no active XKNX")
            self._session._in_flight += 1
        return self

    async def __aexit__(self, *exc) -> None:
        async with self._session._cond:
            self._session._in_flight -= 1
            self._session._cond.notify_all()


class KNXSession:
    """单个共享 XKNX 会话：引用计数 + 锁 + 读守卫 + 重建。"""

    def __init__(self, key: SessionKey, factory: Callable[[], Awaitable[Any]]):
        self.key = key
        # factory: 无参协程，返回「已 start」的 XKNX 实例
        self._factory = factory
        self.xknx: Optional[Any] = None
        self._refcount = 0
        self._holders: Dict[str, dict] = {}
        self._lock = asyncio.Lock()
        self._cond = asyncio.Condition()
        self._closing = False
        self._rebuilding = False
        self._in_flight = 0

    async def acquire(
        self,
        instance_id: str,
        device_updated_cb,
        telegram_cb,
        setup_cb,
    ) -> Any:
        async with self._lock:
            if self._closing:
                raise RuntimeError(f"KNX session {self.key} is closing")
            if self.xknx is None:
                self.xknx = await self._factory()
            self._refcount += 1
            self._holders[instance_id] = {
                "device_updated_cb": device_updated_cb,
                "telegram_cb": telegram_cb,
                "setup_cb": setup_cb,
            }
            # 注册本 holder 的回调（多槽追加，各实例独立过滤归属）
            self._register_cb(self.xknx, device_updated_cb, telegram_cb)
        return self.xknx

    async def release(self, instance_id: str) -> None:
        async with self._lock:
            holder = self._holders.pop(instance_id, None)
            if holder is None:
                return
            self._refcount -= 1
            if self.xknx is not None:
                try:
                    self.xknx.devices.unregister_device_updated_cb(holder["device_updated_cb"])
                except Exception:
                    logger.debug("unregister_device_updated_cb failed", exc_info=True)
                try:
                    self.xknx.telegram_queue.unregister_telegram_received_cb(holder["telegram_cb"])
                except Exception:
                    logger.debug("unregister_telegram_received_cb failed", exc_info=True)
            if self._refcount <= 0:
                await self._do_teardown()

    async def _do_teardown(self) -> None:
        async with self._cond:
            self._closing = True
            deadline = time.monotonic() + 5.0
            while self._in_flight > 0 and time.monotonic() < deadline:
                try:
                    await asyncio.wait_for(self._cond.wait(), timeout=deadline - time.monotonic())
                except asyncio.TimeoutError:
                    logger.warning("KNX session teardown timed out waiting for in-flight reads")
                    break
            xknx = self.xknx
            self.xknx = None
        if xknx is not None:
            try:
                await xknx.stop()
            except Exception:
                logger.debug("Error stopping shared KNX xknx", exc_info=True)
        self._closing = False

    async def rebuild(self, factory: Callable[[], Awaitable[Any]]) -> None:
        """统一重建链路：停掉旧 XKNX、建新、重注册所有 holder 回调并 re-setup 设备。

        整个重建过程持有 session._lock：避免在 "旧已停/新未建" 空窗期有并发 acquire
        创建出第二个孤立 XKNX（orphan race）——该孤立实例既不被会话持有、回调也未注册到
        真实会话上，会造成死连接/串数据。持锁期间只阻塞同会话的 acquire/release（罕见事件），
        read guard 仅用 _cond，不会与之死锁。
        """
        async with self._lock:
            if self._rebuilding:
                return
            self._rebuilding = True
            try:
                async with self._cond:
                    self._closing = True
                    deadline = time.monotonic() + 5.0
                    while self._in_flight > 0 and time.monotonic() < deadline:
                        try:
                            await asyncio.wait_for(self._cond.wait(), timeout=deadline - time.monotonic())
                        except asyncio.TimeoutError:
                            logger.warning("KNX session rebuild timed out waiting for in-flight reads")
                            break
                    old = self.xknx
                    if old is not None:
                        try:
                            await old.stop()
                        except Exception:
                            logger.debug("Error stopping old xknx during rebuild", exc_info=True)
                    self.xknx = None
                new_xknx = await factory()
                self.xknx = new_xknx
                for holder in self._holders.values():
                    self._register_cb(new_xknx, holder["device_updated_cb"], holder["telegram_cb"])
                for holder in self._holders.values():
                    try:
                        await holder["setup_cb"](new_xknx)
                    except Exception:
                        logger.error("Error re-setting up holder devices during rebuild", exc_info=True)
                async with self._cond:
                    self._closing = False
            finally:
                self._rebuilding = False

    @staticmethod
    def _register_cb(xknx, device_updated_cb, telegram_cb) -> None:
        try:
            xknx.devices.register_device_updated_cb(device_updated_cb)
        except Exception:
            logger.debug("register_device_updated_cb failed", exc_info=True)
        try:
            xknx.telegram_queue.register_telegram_received_cb(telegram_cb)
        except Exception:
            logger.debug("register_telegram_received_cb failed", exc_info=True)

    def read_guard(self) -> _ReadGuard:
        return _ReadGuard(self)


class KNXSessionManager:
    """进程级 KNX 共享会话注册表（单例）。"""

    _sessions: Dict[SessionKey, KNXSession] = {}
    _global_lock = asyncio.Lock()

    @classmethod
    async def acquire(
        cls,
        instance_id: str,
        key: SessionKey,
        factory: Callable[[], Awaitable[Any]],
        device_updated_cb,
        telegram_cb,
        setup_cb,
    ) -> Any:
        async with cls._global_lock:
            session = cls._sessions.get(key)
            if session is None:
                session = KNXSession(key, factory)
                cls._sessions[key] = session
        return await session.acquire(instance_id, device_updated_cb, telegram_cb, setup_cb)

    @classmethod
    async def release(cls, instance_id: str, key: SessionKey) -> None:
        async with cls._global_lock:
            session = cls._sessions.get(key)
            if session is None:
                return
        await session.release(instance_id)
        async with cls._global_lock:
            if session._refcount <= 0 and session.xknx is None:
                cls._sessions.pop(key, None)

    @classmethod
    async def rebuild_session(cls, key: SessionKey, factory: Callable[[], Awaitable[Any]]) -> None:
        async with cls._global_lock:
            session = cls._sessions.get(key)
            if session is None:
                return
        await session.rebuild(factory)

    @classmethod
    def get_session(cls, key: SessionKey) -> Optional[KNXSession]:
        return cls._sessions.get(key)
