"""Run script for XAgent Gateway with API server"""

import asyncio
import logging

from .core import ConfigManager, setup_logging
from .gateway import Gateway
from .api import app
from .api.dependencies import set_gateway_storage
from pyapp_runtime import set_server
import uvicorn

logger = logging.getLogger(__name__)


async def run_plugins(gateway: Gateway, shutdown_event: asyncio.Event):
    try:
        plugins_task = asyncio.create_task(gateway.start_plugins())

        await shutdown_event.wait()

        if not plugins_task.done():
            plugins_task.cancel()
            try:
                await plugins_task
            except asyncio.CancelledError:
                pass
    except asyncio.CancelledError:
        pass


async def async_main(host=None, port=None, stop_event=None, access_log=False):
    config_manager = ConfigManager()
    config = config_manager.load()

    setup_logging(config.logging)

    logger.info("Starting XAgent Gateway...")

    gateway = Gateway(config_manager=config_manager)
    await gateway.initialize()
    await gateway.start_core()

    # Gateway.initialize() 已经设置了依赖注入，无需重复调用

    shutdown_event = asyncio.Event()

    # 创建 uvicorn server（host/port 优先使用传入值，回退到配置）
    effective_host = host if host is not None else config.server.host
    effective_port = port if port is not None else config.server.port
    uvicorn_config = uvicorn.Config(
        app=app,
        host=effective_host,
        port=effective_port,
        reload=False,
        log_level=config.logging.level.lower(),
        access_log=access_log,
        log_config=None
    )
    server = uvicorn.Server(uvicorn_config)
    # 注册 server 引用，使 /api/shutdown 端点能翻转 server.should_exit。
    # 与 XAgentServer._stop_event 的 watch 机制互补：两条关闭路径都收敛到
    # server.should_exit = True。
    set_server(server)

    # 监听外部 stop_event：run_in_executor 阻塞等待，set 后立即唤醒，无轮询
    watch_task = None
    if stop_event is not None:
        async def _watch_stop():
            loop = asyncio.get_running_loop()
            await loop.run_in_executor(None, stop_event.wait)
            server.should_exit = True
            shutdown_event.set()
        watch_task = asyncio.create_task(_watch_stop())

    plugins_task = asyncio.create_task(run_plugins(gateway, shutdown_event))

    try:
        await server.serve()
    except KeyboardInterrupt:
        logger.info("Received keyboard interrupt")
        shutdown_event.set()
    finally:
        # 唤醒 _watch_stop 的 executor 线程，避免 asyncio.run 卡在 shutdown_default_executor
        if stop_event is not None:
            stop_event.set()
        if watch_task is not None and not watch_task.done():
            try:
                await watch_task
            except Exception as e:
                logger.debug(f"_watch_stop task ended: {e}")

        plugins_task.cancel()
        try:
            await plugins_task
        except (asyncio.CancelledError, KeyboardInterrupt):
            pass
        except Exception as e:
            logger.error(f"Error during shutdown: {e}")

        try:
            await gateway.stop()
        except Exception as e:
            logger.error(f"Error during gateway shutdown: {e}")
