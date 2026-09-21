"""bacpypes3 运行时补丁

设备轮询（南向插件）与设备发现服务在创建 bacpypes3 应用前
统一调用 patch_bacpypes()，保证补丁幂等地全局生效。
"""

import logging

logger = logging.getLogger(__name__)

_patched = False


def patch_bacpypes() -> bool:
    """应用 bacpypes3 运行时补丁，幂等，可重复调用。

    Returns:
        补丁是否生效（bacpypes3 未安装或导入失败时返回 False）
    """
    global _patched
    if _patched:
        return True

    try:
        from bacpypes3.errors import DecodingError
        from bacpypes3.ipv4 import IPv4DatagramServer
        from bacpypes3.ipv4.bvll import BVLLCodec
        from bacpypes3.pdu import PDU
    except ImportError as e:
        logger.debug("Skip bacpypes3 patches, import failed: %s", e)
        return False

    _patch_bvll_codec(BVLLCodec, DecodingError, PDU)
    _patch_datagram_server(IPv4DatagramServer)

    _patched = True
    logger.debug("bacpypes3 runtime patches applied")
    return True


def _patch_bvll_codec(BVLLCodec, DecodingError, PDU) -> None:
    """吞掉畸形/非 BACnet UDP 报文的 DecodingError。

    bacpypes3 的 UDP 收包是 fire-and-forget 协程
    (datagram_received -> asyncio.ensure_future)，BVLL 解码失败无人捕获，
    事件循环会记 "Task exception was never retrieved" ERROR 噪音，
    此处将这类杂包降级为 debug 日志。
    """
    original_confirmation = BVLLCodec.confirmation

    async def confirmation(self, pdu: PDU) -> None:
        try:
            await original_confirmation(self, pdu)
        except DecodingError as exc:
            logger.debug(
                "Ignored malformed/non-BACnet UDP packet from %s: %s",
                getattr(pdu, "pduSource", "unknown"),
                exc,
            )

    BVLLCodec.confirmation = confirmation


def _patch_datagram_server(IPv4DatagramServer) -> None:
    """修复 close() 时 UDP endpoint 尚未创建完成导致的 socket 泄漏。

    IPv4DatagramServer 用后台任务创建 UDP endpoint（端口被占用/网卡
    未就绪时每秒重试），若 close() 时任务仍未完成，原实现没有 transport
    可关，之后才创建出的 socket 将永远无人关闭、泄漏成常驻监听。
    此处在 close 时取消未完成任务，并让完成回调容忍被取消的任务，
    避免 asyncio 记 "Exception in callback" 噪音。
    """
    original_close = IPv4DatagramServer.close
    original_local_cb = IPv4DatagramServer.set_local_transport_protocol
    original_broadcast_cb = IPv4DatagramServer.set_broadcast_transport_protocol

    def _task_ok(task) -> bool:
        return task.done() and not task.cancelled() and task.exception() is None

    def set_local_transport_protocol(self, address, task) -> None:
        if _task_ok(task):
            original_local_cb(self, address, task)

    def set_broadcast_transport_protocol(self, address, task) -> None:
        if _task_ok(task):
            original_broadcast_cb(self, address, task)

    def close(self) -> None:
        for task in getattr(self, "_transport_tasks", ()):
            if not task.done():
                task.cancel()
        original_close(self)

    IPv4DatagramServer.set_local_transport_protocol = set_local_transport_protocol
    IPv4DatagramServer.set_broadcast_transport_protocol = set_broadcast_transport_protocol
    IPv4DatagramServer.close = close
