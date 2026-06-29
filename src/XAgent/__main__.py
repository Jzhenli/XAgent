"""PyApp Entry Point - Backend Service with Config Support

This entry point is optimized for PyApp deployment:
- Starts backend service only (FastAPI + Gateway + Plugins)
- Supports command-line arguments for configuration
- No desktop UI dependencies (platforms use native shells)
"""
import logging
import argparse
from pathlib import Path

logger = logging.getLogger(__name__)


def setup_logging(debug: bool = False):
    """配置日志"""
    from XAgent.xcore.core.logging import _ensure_utf8_encoding
    _ensure_utf8_encoding()

    level = logging.DEBUG if debug else logging.INFO
    logging.basicConfig(
        level=level,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )


if __name__ == "__main__":
    # 命令行参数解析
    parser = argparse.ArgumentParser(description="XAgent IoT Gateway")
    parser.add_argument(
        '--config',
        type=str,
        help='Config file path'
    )
    parser.add_argument(
        '--data-dir',
        type=str,
        help='Data directory path (overrides default path)'
    )
    parser.add_argument(
        '--debug',
        action='store_true',
        help='Enable debug mode'
    )
    parser.add_argument(
        '--init-config',
        action='store_true',
        help='Create default config file and exit'
    )

    args = parser.parse_args()

    setup_logging(args.debug)

    # 初始化路径
    from XAgent.xcore.core.paths import AppPaths
    custom_base_dir = Path(args.data_dir) if args.data_dir else None
    paths = AppPaths.initialize(custom_base_dir)

    # 创建默认配置文件并退出
    if args.init_config:
        config_file = paths.config_file
        if not config_file.exists():
            from XAgent.xcore.core.config import ConfigManager
            ConfigManager(config_path=str(config_file), paths=paths)
            logger.info(f"Default config file created: {config_file}")
        else:
            logger.info(f"Config file already exists: {config_file}")
        exit(0)

    if args.debug:
        logger.info("Application path info:")
        for key, value in paths.get_all_paths_info().items():
            logger.info(f"  {key}: {value}")

    # 启动后端服务
    from XAgent.xcore.run import main
    main()
