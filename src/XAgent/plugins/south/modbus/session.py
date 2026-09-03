"""Modbus 共享会话层（连接收敛核心）。

目标：把连接数从 O(设备数) 收敛为 O(网关/端点数)：
- 同一连接 Key（串口参数 / host:port）只创建一个 client
- 引用计数（holder 集合，按 instance_id 幂等）管理生命周期
- 每个 (会话, slave_id) 独立的从站熔断，防止单个死从站触发 pymodbus
  的 connection_lost() 关闭共享连接、拖垮同总线上所有设备
- 可选总线锁：RTU 需要（防跨实例串扰），TCP 不需要（MBAP 事务 ID 多路复用）

设计要点（与方案 §M1 第 3 层一致）：
- 会话层**不自行重建 client**。pymodbus 自带 reconnect_delay 自动重连，
  持有者只保存 session 引用、通过 session.client 拿到当前对象即可。
- 熔断阈值（默认 2）刻意小于 pymodbus 的 count_until_disconnect(=retries+3)，
  从而在 pymodbus 累计失败关闭连接之前就停止向死从站发请求。
"""

import asyncio
import logging
import time
from typing import Any, Awaitable, Callable, Dict, Optional

logger = logging.getLogger(__name__)


class CircuitBreaker:
    """按 (会话, slave_id) 的从站级熔断。

    连续失败达到阈值即 OPEN，期间不再发起请求（避免 pymodbus 递减
    count_until_disconnect）。冷却期后进入 half-open 放行一次探测，
    成功则恢复，失败则按指数退避延长冷却。
    """

    CLOSED = "closed"
    OPEN = "open"

    def __init__(self, threshold: int = 2, cooldown_base: float = 30.0, cooldown_max: float = 300.0):
        self.threshold = threshold
        self.cooldown_base = cooldown_base
        self.cooldown_max = cooldown_max
        self.consecutive_failures = 0
        self.state = self.CLOSED
        self.opened_at = 0.0
        self.cooldown_attempts = 0

    def is_open(self) -> bool:
        if self.state != self.OPEN:
            return False
        cooldown = min(self.cooldown_base * (2 ** max(0, self.cooldown_attempts - 1)), self.cooldown_max)
        if time.time() - self.opened_at >= cooldown:
            # half-open：放行一次探测（保留一次失败余量，使其能再次 OPEN）
            self.state = self.CLOSED
            self.consecutive_failures = self.threshold - 1
            return False
        return True

    def record_success(self) -> None:
        self.consecutive_failures = 0
        self.state = self.CLOSED
        self.cooldown_attempts = 0

    def record_failure(self) -> None:
        self.consecutive_failures += 1
        if self.consecutive_failures >= self.threshold:
            self.state = self.OPEN
            self.opened_at = time.time()
            self.cooldown_attempts += 1


class _ModbusSession:
    def __init__(self, key, client_factory, disconnect_fn, bus_lock, instance_id, breaker_threshold=2):
        self.key = key
        self.client_factory: Callable[[], Awaitable[Any]] = client_factory
        self.disconnect_fn: Callable[[Any], Awaitable[None]] = disconnect_fn
        self.bus_lock: Optional[asyncio.Lock] = bus_lock
        self.holders: set = {instance_id}
        self.client: Optional[Any] = None
        self._breakers: Dict[Any, CircuitBreaker] = {}
        self._breaker_threshold = breaker_threshold

    async def ensure_client(self) -> None:
        # 调用方（ModbusSessionManager.acquire）已用 _global_lock 串行化，
        # 故此处无需 per-session 建连锁；client 为 None 时直接创建即可。
        if self.client is None:
            self.client = await self.client_factory()

    def get_breaker(self, slave_id) -> CircuitBreaker:
        b = self._breakers.get(slave_id)
        if b is None:
            b = CircuitBreaker(threshold=self._breaker_threshold)
            self._breakers[slave_id] = b
        return b


class ModbusSessionManager:
    """按连接 Key 管理共享会话（模块级单例）。"""

    _sessions: Dict[tuple, _ModbusSession] = {}
    _global_lock = asyncio.Lock()

    @classmethod
    async def acquire(cls, instance_id, key, client_factory, disconnect_fn,
                     use_bus_lock: bool = True, breaker_threshold: int = 2) -> _ModbusSession:
        async with cls._global_lock:
            session = cls._sessions.get(key)
            if session is None:
                bus_lock = asyncio.Lock() if use_bus_lock else None
                session = _ModbusSession(
                    key, client_factory, disconnect_fn, bus_lock, instance_id, breaker_threshold
                )
                cls._sessions[key] = session
            else:
                session.holders.add(instance_id)
            try:
                await session.ensure_client()
            except Exception:
                # 建连失败：本 holder 退出；若无其他持有者则清理，避免残留空会话
                session.holders.discard(instance_id)
                if not session.holders:
                    cls._sessions.pop(key, None)
                raise
            return session

    @classmethod
    async def release(cls, instance_id, key) -> None:
        async with cls._global_lock:
            session = cls._sessions.get(key)
            if session is None:
                return
            session.holders.discard(instance_id)
            if not session.holders:
                try:
                    if session.client is not None:
                        await session.disconnect_fn(session.client)
                except Exception as e:
                    logger.debug(f"Error disconnecting shared client for {key}: {e}")
                cls._sessions.pop(key, None)

    @classmethod
    def reset_for_testing(cls) -> None:
        cls._sessions.clear()
