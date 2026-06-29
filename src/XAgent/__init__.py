"""XAgent - IoT Gateway Backend Service

This package provides a FastAPI-based IoT gateway backend.
"""

__version__ = "0.1.0"

# Import main function for PyApp launcher
from XAgent.main import main

# Import create_app for Android bridge
from XAgent.xcore import create_app

__all__ = ["main", "create_app", "__version__"]
