"""XAgent Main Entry Point

All platforms use CLI mode (backend service only).
PyApp provides native WebView shell for each platform:
- Windows: WebView2
- Android: Android WebView
- Linux/macOS: GTK WebView (if available)
"""

import argparse
import logging
import platform
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


def main():
    """Main entry point - starts backend service on all platforms."""
    # Import xcore module first
    import XAgent.xcore

    # Parse arguments
    parser = argparse.ArgumentParser(description="XAgent IoT Gateway")
    parser.add_argument('--config', type=str, help='Config file path')
    parser.add_argument('--data-dir', type=str, help='Data directory path')
    parser.add_argument('--debug', action='store_true', help='Enable debug mode')
    parser.add_argument('--init-config', action='store_true', help='Create default config and exit')
    args = parser.parse_args()

    setup_logging(args.debug)

    # Initialize paths
    from XAgent.xcore.core.paths import AppPaths
    paths = AppPaths.initialize(Path(args.data_dir) if args.data_dir is not None else None)

    # Create default config if requested
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

    # Windows needs WindowsSelectorEventLoopPolicy for aiomqtt
    if platform.system() == "Windows":
        from asyncio import set_event_loop_policy, WindowsSelectorEventLoopPolicy
        set_event_loop_policy(WindowsSelectorEventLoopPolicy())
        patch_windows_selector()
        if args.debug:
            logger.info("Windows SelectorEventLoopPolicy set for aiomqtt")

    # Start backend service
    from XAgent.xcore.run import main as run_main
    run_main()


if __name__ == "__main__":
    main()
