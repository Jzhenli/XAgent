"""KNX South Plugin - Data acquisition and control for KNX devices using xknx library"""

import asyncio
import logging
import time
from contextlib import asynccontextmanager
from typing import Any, Dict, List, Optional

from XAgent.xcore.plugins.south import SouthPluginBase
from XAgent.xcore.storage.interface import Reading
from XAgent.xcore.transform import StandardDataPoint
from .converter import KNXConverter
from .constants import (
    DPT_MAIN_TO_STANDARD,
    KNX_DEFAULT_DPT,
    LEGACY_DATA_TYPE_TO_DPT,
    dpt_main_number,
)
from .session import KNXSessionManager, build_session_key

logger = logging.getLogger(__name__)

KNX_AVAILABLE = None
_XKNX = None
_ConnectionConfig = None
_ConnectionType = None
_Sensor = None
_RemoteValueSensor = None
_ConversionError = None
_GroupAddress = None
_XknxConnectionState = None


def _check_knx_available():
    global KNX_AVAILABLE, _XKNX, _ConnectionConfig, _ConnectionType
    global _Sensor, _RemoteValueSensor, _ConversionError, _GroupAddress
    global _XknxConnectionState

    if KNX_AVAILABLE is not None:
        return KNX_AVAILABLE

    try:
        from xknx import XKNX
        from xknx.devices import Sensor
        from xknx.exceptions import ConversionError
        from xknx.remote_value import RemoteValueSensor
        from xknx.telegram import GroupAddress
        from xknx.io import ConnectionConfig, ConnectionType
        from xknx.core.connection_manager import XknxConnectionState

        _XKNX = XKNX
        _ConnectionConfig = ConnectionConfig
        _ConnectionType = ConnectionType
        _Sensor = Sensor
        _RemoteValueSensor = RemoteValueSensor
        _ConversionError = ConversionError
        _GroupAddress = GroupAddress
        _XknxConnectionState = XknxConnectionState
        KNX_AVAILABLE = True
    except ImportError as e:
        KNX_AVAILABLE = False
        if "xknx" in str(e):
            logger.warning("xknx not installed, KNX plugin will not work. Install with: pip install xknx")
        else:
            # xknx 已安装但导入失败（如 cryptography/cffi 的二进制依赖与运行环境不符），
            # 此时报"未安装"会误导排查，需给出真实异常
            logger.warning("xknx is installed but failed to import, KNX plugin will not work: %s", e, exc_info=True)
    return KNX_AVAILABLE


class KNXPlugin(SouthPluginBase):
    """
    KNX 南向插件
    
    支持 KNX 协议，可读写以下数据类型：
    - Switch/Binary: 开关量
    - Climate: 温度
    - Light: 灯光（亮度、颜色）
    - Cover: 遮阳帘
    - Sensor: 通用传感器
    
    连接模式配置 (connection_type):
    - automatic: 自动模式，依次尝试TCP隧道→UDP隧道→路由模式（默认）
    - tunneling: UDP隧道模式，需要gateway_ip
    - tunneling_tcp: TCP隧道模式，需要gateway_ip
    - routing: 路由模式，使用多播通信，不占用连接槽

    注：secure 模式（tunneling_tcp_secure / routing_secure）尚未实现安全凭据配置，
    暂从可选值中移除，避免用户选择后必然因缺少凭据而连接失败。
    
    注意：
    - 当指定gateway_ip时，automatic模式可能只尝试TUNNELING
    - routing模式适合解决连接数满的问题
    - routing模式依赖多播，可能不适用于跨网段环境
    """
    
    __plugin_name__ = "knx"

    @classmethod
    def config_schema(cls) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "gateway_ip": {"type": "string", "default": "192.168.1.100", "title": "网关IP地址"},
                "gateway_port": {"type": "integer", "default": 3671, "title": "网关端口"},
                "local_ip": {"type": ["string", "null"], "default": None, "title": "本地IP地址"},
                "route_back": {"type": "boolean", "default": False, "title": "路由回传"},
                "enable_session_sharing": {"type": "boolean", "default": True, "title": "KNX 会话收敛（多设备共享同一 XKNX 连接，K2/K3）"},
                "connection_type": {"type": "string", "default": "automatic", "enum": ["automatic", "tunneling", "tunneling_tcp", "routing"], "title": "连接模式"},
                "interval": {"type": "number", "default": 5, "title": "轮询间隔(秒)"},
                "reconnect_interval": {"type": "number", "default": 5, "title": "重连间隔(秒)"},
                "heartbeat_timeout": {"type": "number", "default": 2.0, "title": "心跳超时(秒)"},
                "heartbeat_retries": {"type": "integer", "default": 2, "title": "心跳重试次数"},
                "point_timeout": {"type": "number", "default": 3.0, "title": "点位超时(秒)"},
                "point_retries": {"type": "integer", "default": 2, "title": "点位重试次数"},
                "sync_mode": {"type": "string", "default": "smart", "enum": ["passive", "always", "smart"], "title": "同步模式"},
                "sync_interval": {"type": "number", "default": 60, "title": "同步间隔(分钟)，smart模式下超过该时间未更新的点位才主动sync"},
                "max_concurrent_syncs": {"type": "integer", "default": 5, "title": "最大并发同步数"},
            },
        }

    @classmethod
    def capabilities(cls) -> List[str]:
        return [
            "read_group_address",
            "write_group_address",
        ]

    HEARTBEAT_TIMEOUT = 2.0
    HEARTBEAT_RETRIES = 2
    HEARTBEAT_RETRY_INTERVAL = 0.3
    POINT_TIMEOUT = 3.0
    POINT_RETRIES = 2
    # 连续心跳失败达到该次数才判定连接失效并重建，避免偶发超时就销毁连接
    MAX_HEARTBEAT_FAILURES = 3
    POINT_RETRY_INTERVAL = 0.5
    
    DEFAULT_SYNC_MODE = "smart"
    DEFAULT_SYNC_INTERVAL = 60
    DEFAULT_MAX_CONCURRENT_SYNCS = 5
    
    def _get_base_type(self, data_type: str, point_config: Dict[str, Any]) -> str:
        """
        将 data_type(DPT 字符串)转换为基础类型

        Args:
            data_type: KNX DPT 字符串(如 "5.010")
            point_config: 点位配置

        Returns:
            基础类型(如 "bool", "int", "float", "string")
        """
        return self._standard_type_for_dpt(data_type)

    @staticmethod
    def _dpt_main_number(dpt: Any) -> Optional[int]:
        """解析 DPT 主号,非法返回 None(统一委托 constants,避免双实现漂移)"""
        return dpt_main_number(dpt)

    def _standard_type_for_dpt(self, dpt: Any) -> str:
        """DPT 主号 → 标准数据类型;未映射的主号 warning + string 兜底"""
        main = self._dpt_main_number(dpt)
        if main is None:
            logger.warning(
                "Invalid KNX data_type %r, fallback to standard type 'string'", dpt
            )
            return "string"
        standard = DPT_MAIN_TO_STANDARD.get(main)
        if standard is None:
            logger.warning(
                "Unmapped KNX DPT main number %s (from %r), "
                "fallback to standard type 'string'",
                main, dpt,
            )
            return "string"
        return standard

    def _normalize_points_data_types(self, points: List[Dict[str, Any]]) -> None:
        """点位 data_type 归一化:旧语义名 → DPT(warning),非法值回退默认 DPT(warning)。

        顶层与 config 子对象同时覆盖,保证 converter 读取一致。
        """
        for point in points:
            if not isinstance(point, dict):
                continue
            name = point.get("name") or "<unnamed>"
            config_section = point.get("config") if isinstance(point.get("config"), dict) else {}
            raw = config_section.get("data_type", point.get("data_type"))

            if raw is None:
                # 未配置 data_type:沿用旧版默认(switch → 1.001),不告警
                dpt = KNX_DEFAULT_DPT
            else:
                dpt = str(raw).strip()
                legacy = LEGACY_DATA_TYPE_TO_DPT.get(dpt)
                if legacy is not None:
                    logger.warning(
                        "Point %s: legacy data_type %r is deprecated, "
                        "migrated to DPT %r", name, raw, legacy,
                    )
                    dpt = legacy
                elif dpt_main_number(dpt) is None:
                    logger.warning(
                        "Point %s: unrecognized data_type %r, "
                        "fallback to DPT %r", name, raw, KNX_DEFAULT_DPT,
                    )
                    dpt = KNX_DEFAULT_DPT

            point["data_type"] = dpt
            if "data_type" in config_section:
                config_section["data_type"] = dpt
    
    def _create_data_converter(self) -> KNXConverter:
        """创建数据转换器"""
        return KNXConverter()
    
    def __init__(self, config: Dict[str, Any], storage: Any, event_bus: Any):
        super().__init__(config, storage, event_bus)
        
        self._gateway_ip = config.get("gateway_ip", "192.168.1.100")
        self._gateway_port = config.get("gateway_port", 3671)
        self._local_ip = config.get("local_ip")
        self._route_back = config.get("route_back", False)
        self._connection_type = config.get("connection_type", "automatic")
        self._interval = config.get("interval", 5)
        self._reconnect_interval = config.get("reconnect_interval", 5)
        
        self._heartbeat_timeout = config.get("heartbeat_timeout", self.HEARTBEAT_TIMEOUT)
        self._heartbeat_retries = config.get("heartbeat_retries", self.HEARTBEAT_RETRIES)
        self._point_timeout = config.get("point_timeout", self.POINT_TIMEOUT)
        self._point_retries = config.get("point_retries", self.POINT_RETRIES)
        
        self._sync_mode = config.get("sync_mode", self.DEFAULT_SYNC_MODE)
        self._sync_interval = config.get("sync_interval", self.DEFAULT_SYNC_INTERVAL)
        self._max_concurrent_syncs = config.get("max_concurrent_syncs", self.DEFAULT_MAX_CONCURRENT_SYNCS)
        
        self._points: List[Dict[str, Any]] = config.get("points", [])
        self._normalize_points_data_types(self._points)
        self._xknx: Any = None
        self._device_online = False
        self._offline_counter = 0
        self._last_reconnect_time: float = 0.0
        self._devices: Dict[str, Any] = {}
        self._write_devices: Dict[str, Any] = {}
        self._point_order: List[str] = []
        
        self._semaphore: Optional[asyncio.Semaphore] = None
        self._last_telegram_time: Dict[str, float] = {}

        # K1：链路活跃度判定。路由模式下 xknx 不会关闭 IP_MULTICAST_LOOP，
        # 自己发出的帧会被自己收回（自回环），直接采样 cemi 计数会恒为"在线"。
        # 故用 telegram_received_cb 按源地址过滤自回环，只统计外部入站帧。
        self._external_inbound_count: int = 0
        # K1 窗口法：计数器单调递增（不重置），每轮 poll 记录基线，
        # 心跳失败时比较"本轮间隔内新增的外部入站帧"，避免只在 poll 执行那几毫秒采样而漏掉总线流量。
        self._probe_baseline: int = 0
        self._own_ia: Any = None

        self._connect_lock = asyncio.Lock()
        self._heartbeat_fail_count = 0
        self._last_conn_state: Optional[str] = None

        # K2/K3：共享会话收敛。enable_session_sharing=False 回退到每设备独占 XKNX。
        self._enable_session_sharing = config.get("enable_session_sharing", True)
        self._session_key: Optional[tuple] = None
        self._instance_id = str(id(self))
        self._connected = False
        # 难题 1：xknx 设备名全局唯一（asset_name::point_name），避免共享会话下同名冲突/串数据
        self._xknx_name_to_point: Dict[str, str] = {}

        if not self._points:
            logger.warning(f"No points configured for KNX device {self._asset_name}")
    
    def _on_device_updated(self, device: Any) -> None:
        """xknx设备状态更新回调（同步），用于维护_last_telegram_time。

        共享会话下多台设备的 xknx 设备名统一为 asset_name::point_name，
        此处通过映射反查本插件的点名，过滤掉其它共享实例的设备更新。
        """
        xknx_name = device.name
        point = self._xknx_name_to_point.get(xknx_name)
        if point is not None:
            self._last_telegram_time[point] = time.time()
            logger.debug(f"Device {xknx_name} updated via telegram")

    def _on_telegram(self, telegram: Any) -> None:
        """K1 链路活跃度回调（同步）：统计"外部"入站帧。

        路由模式下 xknx 不会关闭 IP_MULTICAST_LOOP，本机发出的帧会被自己收回，
        形成自回环，若直接据此判定总线活跃会恒为在线（假阳性）。
        这里按源地址过滤掉本机 IA，只统计来自其它设备的外部入站帧，
        作为链路真实活跃度的辅助信号。
        """
        try:
            src = getattr(telegram, "source_address", None)
            if src is not None and self._own_ia is not None and src != self._own_ia:
                self._external_inbound_count += 1
        except Exception:
            pass

    # ----- K2/K3 共享会话支撑方法 -----
    def _build_connection_config(self):
        """构造 xknx ConnectionConfig（共享/独占模式共用）。"""
        if _ConnectionConfig is None:
            logger.error("ConnectionConfig is not available")
            return None
        return _ConnectionConfig(
            connection_type=self._get_connection_type(),
            gateway_ip=self._gateway_ip,
            gateway_port=self._gateway_port,
            local_ip=self._local_ip if self._local_ip else None,
            route_back=self._route_back,
            auto_reconnect=True,
            auto_reconnect_wait=self._reconnect_interval
        )

    def _build_session_key(self):
        """构造会话收敛 key：同一网关/多播组的设备共享一个 XKNX 实例。"""
        return build_session_key(
            self._connection_type, self._gateway_ip, self._gateway_port,
            self._local_ip, self._route_back,
        )

    def _make_factory(self):
        """返回无参协程工厂：创建一个「已 start」的 XKNX（不含回调，回调由会话管理器注册）。"""
        connection_config = self._build_connection_config()

        async def _factory():
            if _XKNX is None:
                raise RuntimeError("XKNX is not available")
            xknx = _XKNX(connection_config=connection_config)
            await xknx.start()
            return xknx

        return _factory

    async def _rebuild_self(self, xknx) -> None:
        """共享会话重建后被会话管理器调用：把本插件重新绑定到新 XKNX 并重建设备映射。"""
        self._xknx = xknx
        try:
            self._own_ia = xknx.current_address
        except Exception:
            self._own_ia = None
        self._connected = True
        self._device_online = False
        self._offline_counter = 0
        self._heartbeat_fail_count = 0
        await self._setup_devices()

    @asynccontextmanager
    async def _session_read_guard(self):
        """读路径守卫：共享会话关闭/重建期间进行中的读等待，避免读写已 stop 的 XKNX。"""
        if self._enable_session_sharing and self._session_key is not None:
            session = KNXSessionManager.get_session(self._session_key)
            if session is not None and session.xknx is not None:
                async with session.read_guard():
                    yield
                return
        yield

    async def connect(self) -> bool:
        if not _check_knx_available():
            logger.error("xknx is not installed. Install it with: pip install xknx")
            return False

        # 防止 poll() 与写命令并发触发重建，导致两个 XKNX 实例同时 start
        async with self._connect_lock:
            # 已持有连接：共享会话下不要单方面 teardown，按状态决定复用或重建
            if self._xknx is not None:
                if self._enable_session_sharing and self._session_key is not None:
                    state = await self._get_connection_state()
                    if state != "DISCONNECTED":
                        return True
                    # 共享会话已断开：由会话管理器统一重建，不要单方面停止（会拖垮其它设备）
                    logger.warning("Shared KNX session disconnected; rebuilding before reconnect")
                    try:
                        await KNXSessionManager.rebuild_session(self._session_key, self._make_factory())
                    except Exception:
                        logger.error("Failed to rebuild shared KNX session", exc_info=True)
                        return False
                    return self._xknx is not None
                # 独占模式：释放旧实例后再重建（避免隧道槽位泄漏）
                logger.warning(
                    "Releasing existing KNX connection before reconnect to avoid "
                    "exhausting gateway tunnelling slots"
                )
                await self._teardown_xknx()

            try:
                logger.info(f"Connecting to KNX gateway {self._gateway_ip}:{self._gateway_port}...")

                if self._connection_type.lower() == "routing":
                    xknx_logger = logging.getLogger('xknx.cemi')
                    xknx_logger.setLevel(logging.ERROR)
                    logger.info("ROUTING mode: adjusted xknx.cemi log level to ERROR to suppress expected warnings")

                connection_config = self._build_connection_config()
                if connection_config is None:
                    return False

                if self._enable_session_sharing:
                    if _XKNX is None:
                        logger.error("XKNX is not available")
                        return False
                    # K2/K3：按网关/多播组共享单个 XKNX，引用计数归零才真正 stop
                    key = self._build_session_key()
                    self._session_key = key
                    self._xknx = await KNXSessionManager.acquire(
                        self._instance_id, key, self._make_factory(),
                        self._on_device_updated, self._on_telegram, self._rebuild_self,
                    )
                else:
                    if _XKNX is None:
                        logger.error("XKNX is not available")
                        return False
                    self._xknx = _XKNX(
                        connection_config=connection_config,
                        device_updated_cb=self._on_device_updated,
                        telegram_received_cb=self._on_telegram,
                    )
                    await self._xknx.start()

                # 捕获本机 IA，供 _on_telegram 过滤自回环
                try:
                    self._own_ia = self._xknx.current_address
                except Exception:
                    self._own_ia = None
                if self._own_ia is None:
                    # 路由模式下若取不到本机 IA，自回环无法被过滤，K1 外部入站信号将失效，
                    # 此时心跳失败仍会走"无外部入站"分支（等于原行为），仅作告警以便排查。
                    logger.warning(
                        "KNX current_address is None; cannot filter self-loopback, "
                        "K1 external-inbound link signal disabled"
                    )

                self._connected = True
                self._device_online = False
                self._offline_counter = 0

                await self._setup_devices()

                logger.info(f"Connected to KNX gateway {self._gateway_ip}:{self._gateway_port}")
                logger.info("Waiting for first heartbeat to confirm device online status...")
                return True

            except Exception as e:
                logger.error(f"Error connecting to KNX gateway: {e}")
                self._connected = False
                self._device_online = False
                self._offline_counter = 0

                # 共享会话下连接失败时释放引用，避免会话泄漏
                if self._enable_session_sharing and self._session_key is not None:
                    try:
                        await KNXSessionManager.release(self._instance_id, self._session_key)
                    except Exception:
                        logger.debug("Error releasing shared KNX session", exc_info=True)
                    self._session_key = None

                if self._xknx is not None:
                    try:
                        await self._xknx.stop()
                    except Exception:
                        logger.debug("Error stopping xknx during connect failure", exc_info=True)
                    finally:
                        self._xknx = None

                try:
                    await self._create_offline_reading()
                except Exception:
                    logger.debug("Error creating offline reading during connect failure", exc_info=True)

                return False
    
    def _get_connection_type(self) -> Optional[Any]:
        """将配置字符串转换为ConnectionType枚举
        
        Returns:
            ConnectionType枚举值，如果_ConnectionType不可用则返回None
        """
        if _ConnectionType is None:
            logger.warning("ConnectionType not available, using default")
            return None
        
        type_mapping = {
            "automatic": _ConnectionType.AUTOMATIC,
            "tunneling": _ConnectionType.TUNNELING,
            "tunneling_tcp": _ConnectionType.TUNNELING_TCP,
            "routing": _ConnectionType.ROUTING,
        }
        
        conn_type_str = self._connection_type.lower().strip()
        connection_type = type_mapping.get(conn_type_str)
        
        if connection_type is None:
            logger.warning(f"Unknown connection_type '{self._connection_type}', using AUTOMATIC")
            return _ConnectionType.AUTOMATIC
        
        self._validate_connection_config(conn_type_str)
        
        logger.info(f"Using connection type: {conn_type_str.upper()}")
        return connection_type
    
    def _validate_connection_config(self, conn_type_str: str) -> None:
        """验证连接配置的合理性
        
        Args:
            conn_type_str: 连接类型字符串
        """
        if conn_type_str in ("tunneling", "tunneling_tcp"):
            if not self._gateway_ip:
                logger.warning(
                    f"Connection type '{conn_type_str}' requires gateway_ip, "
                    f"but no gateway_ip is configured"
                )
        elif conn_type_str in ("routing",):
            if self._gateway_ip:
                logger.info(
                    f"Connection type '{conn_type_str}' uses multicast, "
                    f"gateway_ip '{self._gateway_ip}' will be used for discovery only"
                )
    
    async def _teardown_xknx(self) -> None:
        """停止并释放当前 XKNX 实例。

        xknx 的 stop() 会经 knxip_interface -> Tunnel.disconnect() 向网关发送
        DISCONNECT_REQUEST，真正释放网关的 tunnelling 槽位。先清空引用再 stop，
        避免 stop 抛异常时残留引用，也防止重入。
        """
        xknx = self._xknx
        self._xknx = None
        self._connected = False
        self._device_online = False
        self._offline_counter = 0
        self._heartbeat_fail_count = 0
        self._last_conn_state = None
        self._devices.clear()
        self._write_devices.clear()

        if xknx is None:
            return
        try:
            await xknx.stop()
        except Exception:
            logger.debug("Error stopping xknx instance", exc_info=True)

    async def _handle_connection_lost(self) -> None:
        """处理连接丢失。

        共享会话下，链路失效影响所有共享该 XKNX 的设备，不能单方面 teardown，
        由会话持有者统一 rebuild（重建 XKNX 并 re-setup 所有 holder）。
        独占模式保持原行为：停止本实例 XKNX。
        """
        logger.warning(f"KNX device {self._asset_name} connection lost")
        if self._enable_session_sharing and self._session_key is not None:
            try:
                await KNXSessionManager.rebuild_session(self._session_key, self._make_factory())
                return
            except Exception:
                logger.error("Shared KNX session rebuild failed", exc_info=True)
        await self._teardown_xknx()

    async def disconnect(self) -> None:
        if self._enable_session_sharing and self._session_key is not None and self._xknx is not None:
            # 仅释放本实例引用；引用计数归零时才真正停止共享 XKNX
            # （难题2：单设备卸载不能拖垮仍在用的共享会话）
            await KNXSessionManager.release(self._instance_id, self._session_key)
            self._session_key = None
            self._xknx = None
            self._connected = False
            self._device_online = False
            self._offline_counter = 0
            self._heartbeat_fail_count = 0
            self._devices.clear()
            self._write_devices.clear()
            self._xknx_name_to_point.clear()
            logger.info(f"Released shared KNX session for {self._asset_name}")
            return
        await self._teardown_xknx()
        logger.info(f"Disconnected from KNX gateway {self._gateway_ip}:{self._gateway_port}")
    
    async def _setup_devices(self) -> None:
        if not self._xknx or not self._points:
            return

        self._devices.clear()
        self._write_devices.clear()
        self._point_order.clear()
        self._xknx_name_to_point.clear()

        for point in self._points:
            point_name = point.get("name")
            group_address = self._get_point_config(point, "group_address")
            status_address = self._get_point_config(point, "status_address")
            control_address = self._get_point_config(point, "control_address")
            # data_type 已在 __init__ 归一化为 DPT 字符串
            dpt = point.get("data_type", KNX_DEFAULT_DPT)
            writable = self._get_point_config(point, "writable", False)

            read_address = status_address or group_address
            write_address = control_address or group_address

            if not point_name:
                continue

            if not read_address and not write_address:
                logger.warning(f"No address configured for point {point_name}")
                continue

            # K2 难题1：共享会话下 xknx 设备名须全局唯一，避免同名设备串数据
            xknx_name = f"{self._asset_name}::{point_name}"
            self._xknx_name_to_point[xknx_name] = point_name
            # 幂等：同名设备已存在于共享 XKNX（如本插件断连后重连，旧实例未清）则先移除，
            # 否则 xknx.Devices.async_add 仅 append，会出现重复设备导致串数据/冗余处理。
            if xknx_name in self._xknx.devices:
                try:
                    self._xknx.devices.async_remove(self._xknx.devices[xknx_name])
                except Exception:
                    logger.debug("Failed to remove existing xknx device %s", xknx_name, exc_info=True)
            try:
                # 读设备:DPT 非法时抛 ConversionError(整个点位跳过,写也不该建);
                # 无读地址时返回 None(只写点位,继续建写 RemoteValue)
                device = self._create_read_device(xknx_name, read_address, dpt)

                write_rv = None
                if writable and write_address:
                    write_rv = self._create_write_remote_value(xknx_name, write_address, dpt)
                    if write_rv is None:
                        logger.error(
                            f"Point {point_name}: invalid DPT {dpt!r} for write, "
                            f"point will be read-only"
                        )

                if device is None and write_rv is None:
                    logger.error(
                        f"Point {point_name}: neither readable nor writable, skip point"
                    )
                    self._xknx_name_to_point.pop(xknx_name, None)
                    continue

                if device is not None:
                    self._devices[point_name] = {
                        "device": device,
                        "config": point,
                        "dpt": dpt,
                        "read_address": read_address,
                        "write_address": write_address
                    }
                    self._point_order.append(point_name)
                if write_rv is not None:
                    # 只写点位只进写集合,不进读集合,
                    # 避免读路径/心跳取到 device=None 误判连接异常
                    self._write_devices[point_name] = {
                        "write_rv": write_rv,
                        "config": point,
                        "dpt": dpt,
                        "address": write_address
                    }
                logger.debug(
                    f"Created sensor for point {point_name}: dpt={dpt}, "
                    f"read={read_address}, write={write_address}, writable={write_rv is not None}"
                )
            except Exception as e:
                logger.error(f"Error creating device for point {point_name}: {e}")
                self._xknx_name_to_point.pop(xknx_name, None)

    def _create_read_device(self, name: str, read_address: Optional[str], dpt: str) -> Any:
        """创建读路径设备:xknx Sensor(value_type=DPT)。

        Sensor 内部是 RemoteValueSensor,挂入 xknx.devices 后:
        - 自动接收总线 telegram(主动上报),passive/smart 同步模式依赖此路径;
        - 支持 device.sync() 主动发 GroupValueRead。
        """
        if not self._xknx:
            return None

        if not read_address:
            logger.warning(f"No read address for point {name}, skip read device")
            return None

        try:
            read_ga = _GroupAddress(read_address)
        except Exception as e:
            logger.error(f"Invalid group address {read_address!r}: {e}")
            return None

        try:
            device = _Sensor(
                self._xknx, name=name,
                group_address_state=read_ga, value_type=dpt,
            )
        except _ConversionError as e:
            logger.error(
                f"Point {name}: invalid DPT {dpt!r} for read: {e}. "
                f"Hint: main-number-only forms (e.g. '16') are not supported by xknx "
                f"for all main numbers - use a full sub number (e.g. '16.001')"
            )
            return None

        # xknx >=3.x 使用 Devices.async_add (同步方法); 旧版为 add
        try:
            self._xknx.devices.async_add(device)
        except AttributeError:
            self._xknx.devices.add(device)

        return device

    def _create_write_remote_value(self, name: str, write_address: str, dpt: str) -> Any:
        """创建写路径 RemoteValue(value_type=DPT),可脱离设备类独立 group write。"""
        try:
            write_ga = _GroupAddress(write_address)
        except Exception as e:
            logger.error(f"Invalid group address {write_address!r}: {e}")
            return None

        try:
            return _RemoteValueSensor(
                self._xknx,
                group_address=write_ga,  # writable 判定依据
                value_type=dpt,
                device_name=name,
                feature_name="Write",
            )
        except _ConversionError as e:
            logger.error(
                f"Point {name}: invalid DPT {dpt!r} for write: {e}. "
                f"Hint: main-number-only forms (e.g. '16') are not supported by xknx "
                f"for all main numbers - use a full sub number (e.g. '16.001')"
            )
            return None
    
    async def _get_connection_state(self) -> Optional[str]:
        """安全读取 xknx 连接状态名称（CONNECTED/CONNECTING/DISCONNECTED）。"""
        if not self._xknx:
            return None
        try:
            state = self._xknx.connection_manager.state
            name = state.name if state is not None else None
            self._last_conn_state = name
            return name
        except Exception:
            return self._last_conn_state

    async def _reconnect_with_backoff(self) -> bool:
        """仅在连接对象层面未建立时重建，并做间隔节流。

        _device_online 仅表示"尚未收到数据"，不应触发重建；链路恢复交由
        xknx 内建的 auto_reconnect 处理，避免插件层反复新建实例导致端口 churn
        与网关槽位泄漏。
        """
        if self._connected and self._xknx:
            return True
        now = time.time()
        if now - self._last_reconnect_time < self._reconnect_interval:
            return False
        self._last_reconnect_time = now
        self._offline_counter += 1
        logger.info(f"Attempting reconnect to KNX gateway (attempt {self._offline_counter})")
        return await self.connect()

    async def poll(self) -> List[Reading]:
        poll_start = time.time()

        # 仅在连接对象层面未建立时才重建连接（含节流）
        if not await self._reconnect_with_backoff():
            return await self._create_offline_reading()

        # xknx 正在自动重连中：本轮跳过，不干扰其内部恢复。
        # 注意：重连中是"暂无新数据"，并非"设备离线"，不能发离线读数，
        # 否则前端会把设备从 online 闪一下 offline 再跳回 online（误告警）。
        if await self._get_connection_state() == "CONNECTING":
            logger.debug("KNX connection is reconnecting internally, skipping this poll cycle")
            return []

        # K1：窗口基线（计数器单调递增，此处只记录基线，不归零）
        self._probe_baseline = self._external_inbound_count

        if not self._point_order:
            logger.warning("No points configured")
            return []

        heartbeat_point = self._point_order[0]
        heartbeat_device_info = self._devices.get(heartbeat_point)

        if not heartbeat_device_info:
            logger.error(f"Heartbeat point {heartbeat_point} not found")
            return []

        heartbeat_success = await self._read_with_retry(
            heartbeat_device_info["device"],
            heartbeat_device_info["dpt"],
            self._heartbeat_timeout,
            self._heartbeat_retries,
            self.HEARTBEAT_RETRY_INTERVAL
        )

        if heartbeat_success is None:
            self._heartbeat_fail_count += 1
            # K1：本轮间隔内新增的外部入站帧——区分"链路真死"与"仅本设备静默"
            link_alive = (self._external_inbound_count - self._probe_baseline) > 0
            if self._heartbeat_fail_count < self.MAX_HEARTBEAT_FAILURES:
                logger.warning(
                    f"Heartbeat failed ({self._heartbeat_fail_count}/"
                    f"{self.MAX_HEARTBEAT_FAILURES}), keeping connection"
                )
                # 容忍期内保留上一轮状态，不发 offline reading（避免前端闪烁 offline，
                # 与 MAX_HEARTBEAT_FAILURES 的容忍设计自相矛盾）。
                return []
            # 超出容忍：区分链路真死与仅本设备静默
            if link_alive:
                logger.warning(
                    f"Heartbeat failed {self.MAX_HEARTBEAT_FAILURES} times but external "
                    f"inbound seen this window; link is alive (device may be silent), keeping connection"
                )
                return []
            logger.error(
                f"Heartbeat failed {self.MAX_HEARTBEAT_FAILURES} times and no external "
                f"inbound this window, rebuilding KNX connection"
            )
            await self._handle_connection_lost()
            return await self._create_offline_reading()

        self._device_online = True
        self._offline_counter = 0
        self._heartbeat_fail_count = 0
        logger.debug(f"Heartbeat point {heartbeat_point} success, device online")
        
        remaining_points = self._point_order[1:]
        
        if self._sync_mode == "passive":
            raw_data = await self._read_states_passive(remaining_points)
        elif self._sync_mode == "always":
            raw_data = await self._read_states_with_sync(remaining_points)
        else:
            raw_data = await self._read_states_smart(remaining_points)
        
        heartbeat_value = self._get_device_state(
            heartbeat_device_info["device"],
            heartbeat_device_info["dpt"]
        )
        
        raw_data[heartbeat_point] = heartbeat_value
        
        points_data = self.convert_data(raw_data, self._points, context={
            "device_id": self._asset_name,
            "connection_status": "connected" if self._connected else "disconnected"
        })
        
        if not points_data:
            return []
        
        standard_points = [StandardDataPoint(**p) for p in points_data]
        reading = self.create_reading_from_points(standard_points)
        
        if self.storage:
            await self.storage.write(reading)
        
        await self.publish_readings([reading])
        
        poll_duration = time.time() - poll_start
        successful_count = sum(1 for p in points_data if p.get("quality") == "good")
        await self._update_performance_stats(poll_duration, len(self._point_order), successful_count)
        
        logger.info(
            f"Poll completed for {self._asset_name}: "
            f"{len(self._point_order)} points in {poll_duration:.2f}s "
            f"(avg: {self._performance_stats['avg_poll_time']:.2f}s, mode={self._sync_mode})"
        )
        
        return [reading]
    
    async def _read_with_retry(
        self,
        device: Any,
        dpt: str,
        timeout: float,
        max_retries: int,
        retry_interval: float
    ) -> Any:
        for attempt in range(max_retries + 1):
            try:
                value = await asyncio.wait_for(
                    self._read_device_value(device, dpt),
                    timeout=timeout
                )
                return value
            except asyncio.TimeoutError:
                logger.warning(f"Device {device.name if device else 'unknown'} timeout after {timeout}s (attempt {attempt + 1}/{max_retries + 1})")
                if attempt < max_retries:
                    await asyncio.sleep(retry_interval)
            except Exception as e:
                logger.error(f"Error reading device: {e}")
                if attempt < max_retries:
                    await asyncio.sleep(retry_interval)

        return None

    async def _read_device_value(self, device: Any, dpt: str) -> Any:
        if not device:
            logger.debug(f"Device is None for dpt {dpt}")
            return None

        try:
            if _XknxConnectionState is None:
                return None
            conn_state = self._xknx.connection_manager.state
            if conn_state == _XknxConnectionState.CONNECTED:
                self._last_conn_state = conn_state.name
            elif conn_state == _XknxConnectionState.DISCONNECTED:
                # 真正断开才判定连接丢失；CONNECTING 由 xknx 内建 auto_reconnect 恢复
                logger.warning(f"KNX disconnected (state={conn_state.name}), cannot read device {device.name}")
                self._connected = False
                self._device_online = False
                return None
            else:
                # CONNECTING：xknx 正在自动重连，本轮读取跳过，不干扰恢复
                logger.debug(f"KNX reconnecting (state={conn_state.name}), skip read device {device.name}")
                return None

            logger.debug(f"Reading device {device.name}, dpt={dpt}")

            # 共享会话下用读守卫包裹实际读写，避免会话正在 teardown/rebuild 时
            # 对已被 stop 的 XKNX 做 device.sync() 引发异常或脏数据。
            async with self._session_read_guard():
                if hasattr(device, 'sync'):
                    logger.debug(f"Calling sync on device {device.name}")
                    await device.sync(wait_for_result=True)
                    logger.debug(f"Sync completed for device {device.name}")

                value = self._extract_device_value(device, dpt)
            if value is None:
                logger.warning(f"Could not read value from device {device.name}")
            return value

        except Exception as e:
            logger.error(f"Error reading device value: {e}", exc_info=True)
            return None

    def _extract_device_value(self, device: Any, dpt: str) -> Any:
        """从 xknx Sensor 提取状态值,并按 DPT 主号归一化为 Python 原生类型。

        - DPT 1/2.xxx:xknx 读出 Switch 等枚举成员(bool(枚举) 恒为 True,陷阱),
          必须取 .value 转 bool;
        - DPT 232.600:RGBColor dataclass → {"r","g","b"} dict(与写路径对称);
        - 其余(int/float/str)由 xknx DPT 层直接给出,透传。
        """
        if not device:
            return None

        try:
            value = device.sensor_value.value
        except AttributeError:
            logger.error(f"Device {device.name} has no sensor_value, dpt={dpt}")
            return None

        return self._normalize_dpt_value(value, dpt)

    def _normalize_dpt_value(self, value: Any, dpt: str) -> Any:
        """按 DPT 主号归一化读值"""
        if value is None:
            return None

        main = self._dpt_main_number(dpt)
        if main in (1, 2):
            # 循环剥壳至原生类型:
            # DPT 1.x 读出 Switch 枚举(.value 一层即 bool);
            # DPT 2.x 读出 SwitchControl dataclass(.value 仍是 Switch 枚举,需两层)。
            # bool(枚举成员) 恒为 True,必须剥到底再转。
            inner = value
            while hasattr(inner, "value") and not isinstance(inner, bool):
                inner = inner.value
            return bool(inner)
        if main == 232:
            # RGBColor dataclass(字段 red/green/blue)→ dict,与旧版 {"r","g","b"} 表示一致
            return {
                "r": getattr(value, "red", 0),
                "g": getattr(value, "green", 0),
                "b": getattr(value, "blue", 0),
            }
        return value

    def _get_device_state(self, device: Any, dpt: str) -> Any:
        """直接读取设备状态（不发送KNX请求）"""
        return self._extract_device_value(device, dpt)
    
    async def write_setpoint(self, asset: str, point: str, value: Any) -> bool:
        if not self._connected or not self._xknx:
            logger.error("Not connected to KNX gateway")
            return False

        write_device_info = self._write_devices.get(point)
        if write_device_info:
            write_rv = write_device_info["write_rv"]
            dpt = write_device_info["dpt"]
            address = write_device_info["address"]
            point_config = write_device_info.get("config")

            raw_value = self._reverse_transform_value(value, point_config) if point_config else value
            logger.debug(f"Reverse transform: {value!r} -> {raw_value!r} (dpt={dpt})")
            if raw_value is None and value is not None:
                logger.error(f"Failed to reverse transform value {value} for point {point}")
                return False

            success = await self._write_device_value(write_rv, dpt, raw_value)
            if success:
                logger.info(f"Successfully wrote value {value} to point {point} at address {address}")
            return success

        device_info = self._devices.get(point)
        if not device_info:
            logger.error(f"Point {point} not found in configuration")
            return False

        # 可写点位必然注册在 _write_devices(见 _setup_devices);
        # 走到这里说明点位存在但不可写(或写 RemoteValue 创建失败)
        logger.warning(f"Point {point} is not writable")
        return False

    def _normalize_write_value(self, value: Any, dpt: str) -> Any:
        """写值归一化。

        - DPT 232.600(RGB):接受 {"r","g","b"} dict / "r,g,b" 字符串 / tuple,
          统一转为 xknx 要求的 {"red","green","blue"};
        - 其余 DPT 透传,值类型/值域由 xknx 编码层校验(ConversionError 拒绝,不钳位)。
        """
        main = self._dpt_main_number(dpt)
        if main != 232:
            return value

        if isinstance(value, dict) and "red" in value:
            return value
        rgb = self._parse_rgb(value)
        return {"red": rgb[0], "green": rgb[1], "blue": rgb[2]}

    @staticmethod
    def _parse_rgb(value: Any) -> tuple:
        """将多种 RGB 表示解析为 (r,g,b) 元组：
        - dict: {"r":..,"g":..,"b":..} / {"red":..,"green":..,"blue":..}
        - 字符串: "r,g,b" / '((r,g,b),None)' 等
        - tuple/list: (r,g,b)
        """
        if isinstance(value, (tuple, list)):
            return tuple(int(c) for c in value[:3])
        if isinstance(value, dict):
            return (
                int(value.get("r", value.get("red", 0))),
                int(value.get("g", value.get("green", 0))),
                int(value.get("b", value.get("blue", 0))),
            )
        if isinstance(value, str):
            s = value.strip()
            # 兼容 "((r, g, b), None)" 这类 xknx 原始表示
            if s.startswith("("):
                # 取最外层元组的第一个元素的三个数字
                inner = s.split(")", 1)[0].lstrip("(").strip("(")
                nums = [float(x) for x in inner.replace(" ", "").split(",") if x]
                return tuple(int(x) for x in nums[:3])
            nums = [float(x) for x in s.replace(" ", "").split(",") if x]
            return tuple(int(x) for x in nums[:3])
        raise ValueError(f"Unsupported RGB value: {value!r}")

    async def _write_device_value(self, write_rv: Any, dpt: str, value: Any) -> bool:
        """写值:RemoteValueSensor.set(value)(同步编码 + group write)。

        值类型/值域校验由 xknx 编码层拒绝式完成(ConversionError),不钳位:
        - DPT 1.001 只接受 bool/0/1(及 xknx 认可的 on/off 字符串),
          其它任意 truthy 字符串一律编码失败显式报错,修复旧版 if value: 歧义;
        - DPT 5.001 严格 0-100,5.010 严格 0-255,越界即失败。
        """
        if not write_rv:
            return False

        logger.debug(
            f"Writing to point: dpt={dpt}, value={value!r}, value_type={type(value).__name__}"
        )

        # 与读路径对称：用会话守卫包裹写操作，避免共享会话正在 teardown/rebuild 时
        # 对已被 stop 的 XKNX 发出写命令而抛异常或产生脏数据（文档 K2 要求读写均守卫）。
        async with self._session_read_guard():
            try:
                normalized = self._normalize_write_value(value, dpt)
                write_rv.set(normalized)
                return True
            except Exception as e:
                logger.error(f"Failed to write value {value!r} (dpt={dpt}): {e}")
                return False
    
    async def _read_states_passive(self, point_names: List[str]) -> Dict[str, Any]:
        """
        被动模式：直接读取设备状态
        
        不发送任何KNX请求，仅读取xknx维护的设备状态。
        依赖设备主动上报状态变化。
        
        Args:
            point_names: 要读取的点位名称列表
        
        Returns:
            点位数据字典
        """
        raw_data = {}
        
        for point_name in point_names:
            device_info = self._devices.get(point_name)
            if not device_info:
                raw_data[point_name] = None
                continue

            value = self._get_device_state(
                device_info["device"],
                device_info["dpt"]
            )
            raw_data[point_name] = value

            if value is not None:
                logger.debug(f"[Passive] Read {point_name}: value={value}")
            else:
                logger.warning(f"[Passive] Point {point_name} has no state (device may not have reported)")

        return raw_data
    
    async def _read_states_with_sync(self, point_names: List[str]) -> Dict[str, Any]:
        """
        主动模式：并发sync后读取状态
        
        对所有点位发送GroupValueRead请求，使用并发优化。
        适用于需要最高实时性的场景。
        
        Args:
            point_names: 要读取的点位名称列表
        
        Returns:
            点位数据字典
        """
        if not point_names:
            return {}
        
        if self._semaphore is None:
            self._semaphore = asyncio.Semaphore(self._max_concurrent_syncs)
        
        async def sync_and_read(point_name: str) -> tuple:
            """sync单个点位并读取状态"""
            async with self._semaphore:
                device_info = self._devices.get(point_name)
                if not device_info:
                    return (point_name, None)

                device = device_info["device"]
                dpt = device_info["dpt"]

                try:
                    if hasattr(device, 'sync'):
                        await device.sync(wait_for_result=True)
                        self._last_telegram_time[point_name] = time.time()
                        logger.debug(f"[Always] Synced {point_name}")
                except Exception as e:
                    logger.error(f"[Always] Sync failed for {point_name}: {e}")
                    return (point_name, None)

                value = self._get_device_state(device, dpt)
                return (point_name, value)
        
        tasks = [sync_and_read(name) for name in point_names]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        raw_data = {}
        for result in results:
            if isinstance(result, Exception):
                logger.error(f"[Always] Error in concurrent sync: {result}")
                continue
            point_name, value = result
            raw_data[point_name] = value
        
        return raw_data
    
    async def _read_states_smart(self, point_names: List[str]) -> Dict[str, Any]:
        """
        智能模式：按需sync
        
        根据上次更新时间判断是否需要sync：
        - 超过sync_interval分钟无更新的点位：主动sync
        - 其他点位：被动读取
        
        Args:
            point_names: 要读取的点位名称列表
        
        Returns:
            点位数据字典
        """
        if not point_names:
            return {}
        
        now = time.time()
        # sync_interval 单位为分钟，转换为秒作为阈值
        sync_threshold = self._sync_interval * 60
        
        points_to_sync = []
        points_passive = []
        
        for point_name in point_names:
            last_time = self._last_telegram_time.get(point_name, 0)
            if (now - last_time) > sync_threshold:
                points_to_sync.append(point_name)
            else:
                points_passive.append(point_name)
        
        if points_to_sync:
            logger.info(
                f"[Smart] Syncing {len(points_to_sync)} points "
                f"(last update > {self._sync_interval} minutes ago)"
            )
        
        sync_data = {}
        if points_to_sync:
            sync_data = await self._sync_points_concurrent(points_to_sync)
        
        passive_data = {}
        for point_name in points_passive:
            device_info = self._devices.get(point_name)
            if device_info:
                passive_data[point_name] = self._get_device_state(
                    device_info["device"],
                    device_info["dpt"]
                )
        
        return {**passive_data, **sync_data}
    
    async def _sync_points_concurrent(self, point_names: List[str]) -> Dict[str, Any]:
        """
        并发sync指定点位
        
        Args:
            point_names: 要sync的点位名称列表
        
        Returns:
            点位数据字典
        """
        if not point_names:
            return {}
        
        if self._semaphore is None:
            self._semaphore = asyncio.Semaphore(self._max_concurrent_syncs)
        
        async def sync_single(point_name: str) -> tuple:
            async with self._semaphore:
                device_info = self._devices.get(point_name)
                if not device_info:
                    return (point_name, None)

                device = device_info["device"]
                dpt = device_info["dpt"]

                try:
                    if hasattr(device, 'sync'):
                        await device.sync(wait_for_result=True)
                        self._last_telegram_time[point_name] = time.time()
                except Exception as e:
                    logger.error(f"[Smart] Sync failed for {point_name}: {e}")
                    return (point_name, None)

                value = self._get_device_state(device, dpt)
                return (point_name, value)
        
        tasks = [sync_single(name) for name in point_names]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        raw_data = {}
        for result in results:
            if isinstance(result, Exception):
                logger.error(f"[Smart] Error in concurrent sync: {result}")
                continue
            point_name, value = result
            raw_data[point_name] = value
        
        return raw_data
