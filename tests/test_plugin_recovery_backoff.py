"""插件恢复退避的回归测试（不依赖完整 XAgent 运行环境）。"""

import asyncio
import importlib.util
import sys
import types
import unittest
from pathlib import Path

_PKG = "_review_fakepkg"
_PLUGIN_PKG = _PKG + ".plugin"
_LIFECYCLE_NAME = _PLUGIN_PKG + ".lifecycle"


def _module(name: str, package: bool = False) -> types.ModuleType:
    module = sys.modules.get(name)
    if module is None:
        module = types.ModuleType(name)
        sys.modules[name] = module
    if package:
        module.__path__ = []
    return module


def _load_lifecycle():
    _module(_PKG, True)
    _module(_PLUGIN_PKG, True)

    types_mod = _module(_PLUGIN_PKG + ".types")

    class PluginType:
        SOUTH = "south"

    class PluginStatus:
        RUNNING = "running"
        ERROR = "error"

    class PluginInfo:
        def __init__(self, plugin_id, name):
            self.plugin_id = plugin_id
            self.name = name

    types_mod.PluginType = PluginType
    types_mod.PluginStatus = PluginStatus
    types_mod.PluginInfo = PluginInfo

    registry_mod = _module(_PLUGIN_PKG + ".registry")
    registry_mod.PluginRegistry = type("PluginRegistry", (), {})

    event_bus_mod = _module(_PKG + ".event_bus")
    event_bus_mod.EventBus = type("EventBus", (), {})
    event_bus_mod.EventType = type("EventType", (), {})
    event_bus_mod.Event = type("Event", (), {})

    scheduler_mod = _module(_PKG + ".scheduler")
    scheduler_mod.Scheduler = type("Scheduler", (), {})
    scheduler_mod.TaskType = type("TaskType", (), {})

    exceptions_mod = _module(_PKG + ".exceptions")
    for name in ("PluginLoadError", "PluginStartError", "PluginStopError"):
        setattr(exceptions_mod, name, type(name, (Exception,), {}))

    path = (
        Path(__file__).resolve().parents[1]
        / "src"
        / "XAgent"
        / "xcore"
        / "core"
        / "plugin"
        / "lifecycle.py"
    )
    spec = importlib.util.spec_from_file_location(_LIFECYCLE_NAME, str(path))
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module, PluginInfo


_lifecycle, _PluginInfo = _load_lifecycle()


class RecoveryBackoffTests(unittest.TestCase):
    def setUp(self):
        self.lifecycle = _lifecycle.PluginLifecycle(None, None, None)

    def test_backoff_does_not_overflow_after_many_failures(self):
        self.lifecycle._recovery_failures["p"] = 1025
        self.lifecycle._register_recovery_failure(_PluginInfo("p", "p"))
        wait = self.lifecycle._next_recovery_at["p"] - _lifecycle.time.monotonic()
        self.assertGreaterEqual(wait, 599)
        self.assertLessEqual(wait, 600)

    def test_unload_clears_backoff_when_stop_fails(self):
        async def failing_stop(plugin_id):
            raise _lifecycle.PluginStopError("p", "stop failed")

        self.lifecycle.stop_plugin = failing_stop
        self.lifecycle._recovery_failures["p"] = 3
        self.lifecycle._next_recovery_at["p"] = 123.0

        with self.assertRaises(_lifecycle.PluginStopError):
            asyncio.run(self.lifecycle.unload_plugin("p"))

        self.assertNotIn("p", self.lifecycle._recovery_failures)
        self.assertNotIn("p", self.lifecycle._next_recovery_at)

    def test_recovery_checks_current_time_per_plugin(self):
        clock = [0.0]
        original_monotonic = _lifecycle.time.monotonic
        _lifecycle.time.monotonic = lambda: clock[0]
        self.addCleanup(setattr, _lifecycle.time, "monotonic", original_monotonic)

        class Registry:
            def get_failed_plugins(self):
                return [_PluginInfo("a", "a"), _PluginInfo("b", "b")]

        async def advancing_start(plugin_id):
            clock[0] += 100.0
            return True

        self.lifecycle.registry = Registry()
        self.lifecycle.start_plugin = advancing_start
        self.lifecycle._next_recovery_at["b"] = 50.0

        asyncio.run(self.lifecycle.recover_failed_plugins())

        self.assertEqual(clock[0], 200.0)


if __name__ == "__main__":
    unittest.main()
