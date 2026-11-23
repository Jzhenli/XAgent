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
        from bacpypes3.apdu import AbortReason
        from bacpypes3.appservice import ClientSSM
        from bacpypes3.errors import DecodingError
        from bacpypes3.ipv4 import IPv4DatagramServer
        from bacpypes3.ipv4.bvll import BVLLCodec
        from bacpypes3.pdu import PDU
    except ImportError as e:
        logger.debug("Skip bacpypes3 patches, import failed: %s", e)
        return False

    _patch_bvll_codec(BVLLCodec, DecodingError, PDU)
    _patch_datagram_server(IPv4DatagramServer)
    _patch_client_ssm(ClientSSM, AbortReason)

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


def _patch_client_ssm(ClientSSM, AbortReason) -> None:
    """修复 ClientSSM 重试在 transport 关闭后无限自复制的问题。

    await_confirmation_timeout 超时重发时，indication() 会先调度下一轮
    timer 再下发 UDP；若 transport 已关闭，sendto 抛出的 AttributeError
    （非 CommuncationError）不被捕获，且 indication() 重置的 retryCount
    使重试计数永远无法超限——每个在途请求变成每 apduTimeout 自我复制
    一轮的无限 timer 链，刷屏 "Task exception was never retrieved"。

    此处让重试异常走与"重试超限"相同的 abort 路径：
    set_state(ABORTED) 会 stop_timer() 掐断链条，并从 clientTransactions
    移除；abort PDU 回给应用层使其 future 正常 resolve。
    """
    original_await_confirmation_timeout = ClientSSM.await_confirmation_timeout

    async def await_confirmation_timeout(self) -> None:
        try:
            await original_await_confirmation_timeout(self)
        except Exception as exc:
            logger.debug(
                "ClientSSM retry failed (invokeID=%s), aborting transaction: %r",
                getattr(self, "invokeID", "?"),
                exc,
            )
            try:
                abort_pdu = self.abort(AbortReason.noResponse)
            except Exception as abort_error:
                logger.debug("ClientSSM abort failed: %r", abort_error)
                return
            try:
                await self.response(abort_pdu)
            except Exception as response_error:
                logger.debug("ClientSSM abort response failed: %r", response_error)

    ClientSSM.await_confirmation_timeout = await_confirmation_timeout


async def abort_pending_transactions(app) -> int:
    """Abort 应用上所有在途的事务状态机。

    在关闭 Application 前调用：每个 ClientSSM/ServerSSM 的 abort() 会
    stop_timer() 并从事务列表移除，防止关闭后僵尸 timer 引用已关闭的
    transport。ClientSSM 额外把 abort PDU 回给应用层，使在途的
    app.request() future 正常 resolve。返回成功 abort 的事务数。
    """
    from bacpypes3.apdu import AbortReason

    aborted = 0
    asap = getattr(app, "asap", None)
    for ssm in list(getattr(asap, "clientTransactions", None) or []):
        try:
            abort_pdu = ssm.abort(AbortReason.noResponse)
            await ssm.response(abort_pdu)
            aborted += 1
        except Exception as exc:
            logger.debug("Abort pending client transaction failed: %r", exc)
    # ServerSSM 的 abort 按库语义不回通知应用层
    for ssm in list(getattr(asap, "serverTransactions", None) or []):
        try:
            ssm.abort(AbortReason.noResponse)
            aborted += 1
        except Exception as exc:
            logger.debug("Abort pending server transaction failed: %r", exc)
    return aborted
