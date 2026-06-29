"""XAgent Main Entry Point

All platforms use CLI mode (backend service only).
PyApp provides native WebView shell for each platform:
- Windows: WebView2
- Android: Android WebView
- Linux/macOS: GTK WebView (if available)
"""

import argparse
import asyncio
import logging
import os
import platform
import sys
import threading
from pathlib import Path

logger = logging.getLogger(__name__)


def setup_logging(debug: bool = False):
    """Configure logging with UTF-8 encoding."""
    from XAgent.xcore.core.logging import _ensure_utf8_encoding
    _ensure_utf8_encoding()

    level = logging.DEBUG if debug else logging.INFO
    logging.basicConfig(
        level=level,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )


def patch_windows_selector():
    """Fix Windows SelectorEventLoop WinError 10038 for aiomqtt.

    Windows select() only supports sockets. When event loop closes
    with non-socket resources, it triggers WinError 10038.
    Reference: https://bugs.python.org/issue33350
    """
    from selectors import SelectSelector

    _original_select = SelectSelector._select

    def _patched_select(self, r, w, x, timeout=None):
        try:
            return _original_select(self, r, w, x, timeout)
        except OSError as e:
            if hasattr(e, 'winerror') and e.winerror == 10038:
                return [], [], []
            raise

    SelectSelector._select = _patched_select


_env_initialized = False
_env_paths = None


def _init_env(data_dir=None, debug=False):
    """共享初始化：路径、日志、Windows 事件循环修复。

    路径优先级：显式 data_dir > 环境变量 APP_DATA_DIR > platformdirs 默认。
    bridge 场景下 data_dir=None，自动读 APP_DATA_DIR（由 bridge 设置）。
    幂等：CLI 路径下 main() 与 XAgentServer.run() 都会调用，第二次直接返回。
    """
    global _env_initialized, _env_paths
    if _env_initialized:
        return _env_paths

    from XAgent.xcore.core.paths import AppPaths
    env_dir = os.environ.get("APP_DATA_DIR")
    effective_dir = data_dir or env_dir
    paths = AppPaths.initialize(Path(effective_dir) if effective_dir else None)

    setup_logging(debug)

    if platform.system() == "Windows":
        from asyncio import set_event_loop_policy, WindowsSelectorEventLoopPolicy
        set_event_loop_policy(WindowsSelectorEventLoopPolicy())
        patch_windows_selector()
        if debug:
            logger.info("Windows SelectorEventLoopPolicy set for aiomqtt")

    _env_initialized = True
    _env_paths = paths
    return paths


class XAgentServer:
    """XAgent 后端服务适配器。

    兼容 pyapp bridge 的 server 契约（.run() + .should_exit），
    封装 Gateway + uvicorn + plugins 的完整生命周期。
    """

    def __init__(self, host="0.0.0.0", port=None, access_log=False):
        self._stop_event = threading.Event()
        self._host = host
        self._port = port
        self._access_log = access_log

    @property
    def should_exit(self):
        return self._stop_event.is_set()

    @should_exit.setter
    def should_exit(self, value):
        if value:
            self._stop_event.set()

    def run(self):
        _init_env()
        from XAgent.xcore.run import async_main
        try:
            asyncio.run(async_main(
                host=self._host,
                port=self._port,
                stop_event=self._stop_event,
                access_log=self._access_log
            ))
        except KeyboardInterrupt:
            logger.info("Received keyboard interrupt")


def create_server(host="0.0.0.0", port=None, access_log=False):
    """创建 XAgent 后端服务实例（不启动），供 bridge/测试/嵌入式使用。"""
    return XAgentServer(host=host, port=port, access_log=access_log)


def main():
    """Main entry point - starts backend service on all platforms."""
    import XAgent.xcore

    parser = argparse.ArgumentParser(description="XAgent IoT Gateway")
    parser.add_argument('--config', type=str, help='Config file path')
    parser.add_argument('--data-dir', type=str, help='Data directory path')
    parser.add_argument('--debug', action='store_true', help='Enable debug mode')
    parser.add_argument('--init-config', action='store_true', help='Create default config and exit')
    args = parser.parse_args()

    paths = _init_env(args.data_dir, args.debug)

    if args.init_config:
        config_file = paths.config_file
        if not config_file.exists():
            from XAgent.xcore.core.config import ConfigManager
            ConfigManager(config_path=str(config_file), paths=paths)
            logger.info(f"Default config file created: {config_file}")
        else:
            logger.info(f"Config file already exists: {config_file}")
        return

    if args.debug:
        logger.info("Application paths:")
        for key, value in paths.get_all_paths_info().items():
            logger.info(f"  {key}: {value}")

    server = create_server()
    server.run()

    non_daemon = [t for t in threading.enumerate()
                  if t.is_alive() and t != threading.current_thread() and not t.daemon]
    if non_daemon:
        logger.warning(f"Non-daemon threads preventing exit: {[t.name for t in non_daemon]}")
        os._exit(0)
    else:
        sys.exit(0)


if __name__ == "__main__":
    main()
