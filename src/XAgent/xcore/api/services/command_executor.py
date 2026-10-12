"""Command Executor Service - Async command execution system"""

import asyncio
import logging
import time
from typing import Any, Dict, List, Optional
from collections import OrderedDict

from ..models.command import CommandStatus, ControlCommand
from ...core.plugin_loader import PluginType, PluginLoader
from ...core.interfaces import ILifecycle

logger = logging.getLogger(__name__)


class CommandExecutor(ILifecycle):
    """Async command execution system

    单协程 worker 串行消费命令队列。每条命令在独立 task 中执行，并受
    hard_timeout（放弃式硬超时）约束：超时后 worker 放弃等待并继续消费
    后续命令，命令立即标记为 FAILED（终态保护：后台任务完成后不覆盖）；
    被放弃的后台任务（孤儿）可能仍在执行插件写操作。

    worker 具备自愈能力：意外死亡时通过 done-callback 自动重建（异常栈
    会完整落日志），连续快速失败超过 _max_worker_restarts 次则停止自愈。
    """

    # worker 自愈熔断阈值：连续 N 次意外死亡后放弃自动重启
    _max_worker_restarts = 5
    # 过期命令的周期清理间隔（秒）
    _cleanup_interval = 30.0

    def __init__(self, max_history: int = 100, default_timeout: float = 30.0,
                 hard_timeout: float = 60.0):
        self.max_history = max_history
        self.default_timeout = default_timeout
        # 单条命令执行的放弃式硬超时：超时后 worker 不再等待该命令
        self.hard_timeout = hard_timeout

        self._commands: OrderedDict[str, ControlCommand] = OrderedDict()
        self._queue: asyncio.Queue = asyncio.Queue()
        self._running: bool = False
        self._worker_task: Optional[asyncio.Task] = None
        self._cleanup_task: Optional[asyncio.Task] = None
        # 被放弃等待的后台执行任务（持有引用防 GC；stop 时统一取消）
        self._orphan_tasks: set = set()
        # worker 连续意外死亡计数（正常消费一条命令即重置）
        self._restart_failures: int = 0
        self._plugin_loader: Optional[PluginLoader] = None

    @property
    def is_running(self) -> bool:
        """检查命令执行器是否正在运行"""
        return self._running

    def set_plugin_loader(self, plugin_loader: PluginLoader) -> None:
        self._plugin_loader = plugin_loader

    async def start(self) -> None:
        if self._running:
            return
        self._running = True
        self._restart_failures = 0
        self._worker_task = self._spawn_worker()
        self._cleanup_task = asyncio.create_task(self._cleanup_loop())
        logger.info("Command Executor started")

    async def stop(self) -> None:
        if not self._running:
            return
        self._running = False
        if self._cleanup_task:
            self._cleanup_task.cancel()
            try:
                await self._cleanup_task
            except asyncio.CancelledError:
                pass
            self._cleanup_task = None
        if self._worker_task:
            if not self._worker_task.done():
                self._worker_task.cancel()
                try:
                    await self._worker_task
                except asyncio.CancelledError:
                    pass
                except BaseException as e:
                    # 清理路径兜底：worker 终止异常不能中断 shutdown 流程
                    logger.error(f"Command worker raised during stop: {e!r}")
            else:
                # 已终止的 worker：检索其异常，避免 "never retrieved" 静默
                if not self._worker_task.cancelled():
                    exc = self._worker_task.exception()
                    if exc is not None:
                        logger.error(f"Command worker was dead with: {exc!r}")
            self._worker_task = None
        # 取消仍在后台执行的孤儿任务（尽力而为：插件若吞取消则无法终止，
        # 最多等待 5 秒避免拖死 shutdown 流程）
        if self._orphan_tasks:
            for t in list(self._orphan_tasks):
                if not t.done():
                    t.cancel()
            try:
                await asyncio.wait(set(self._orphan_tasks), timeout=5.0)
            except Exception as e:
                logger.error(f"Error waiting for orphaned command tasks: {e}")
            for t in self._orphan_tasks:
                if t.done() and not t.cancelled():
                    exc = t.exception()
                    if exc is not None:
                        logger.error(f"Orphaned command task ended with: {exc!r}")
            self._orphan_tasks.clear()
        logger.info("Command Executor stopped")

    def _spawn_worker(self) -> asyncio.Task:
        """创建 worker task 并挂载存活监控回调"""
        task = asyncio.create_task(self._worker_loop())
        task.add_done_callback(self._on_worker_done)
        return task

    def _on_worker_done(self, task: asyncio.Task) -> None:
        """worker 存活监控：意外死亡时完整落日志并自动重建（带熔断）"""
        if task is not self._worker_task:
            # 已被更新的 worker 替代（stop/submit 重建场景）
            return
        if not self._running:
            # 主动 stop 导致的退出，无需自愈
            return
        if task.cancelled():
            reason = "cancelled unexpectedly"
        else:
            exc = task.exception()
            if exc is None:
                # 循环自然退出（_running 刚被置 False 的窗口），无需自愈
                return
            reason = f"died with exception: {exc!r}"
            logger.error(f"Command worker {reason}", exc_info=exc)
        self._restart_failures += 1
        if self._restart_failures > self._max_worker_restarts:
            logger.critical(
                f"Command worker failed {self._restart_failures} times in a row; "
                "giving up auto-restart. New commands will be rejected until restart."
            )
            return
        logger.warning(
            f"Restarting command worker after {reason} "
            f"(consecutive failure #{self._restart_failures})"
        )
        self._worker_task = self._spawn_worker()

    async def submit_command(
        self,
        command_id: str,
        target_service: str,
        target_asset: str,
        operation: str,
        parameters: Dict[str, Any],
        expiry: Optional[int] = None
    ) -> bool:
        if not self._running:
            logger.error(f"Command rejected (executor not running): {command_id}")
            return False
        if self._restart_failures > self._max_worker_restarts:
            # 自愈熔断已打开：worker 持续崩溃时拒绝入队，避免拉起-崩溃死循环
            logger.error(
                f"Command rejected (worker auto-restart circuit-breaker open): "
                f"{command_id}"
            )
            return False
        # worker 意外死亡时自动拉起（本方法从检查到 put 之间除队列 put 外
        # 无其他 await，事件循环内原子，不会产生双 worker）
        worker = self._worker_task
        if worker is None or worker.done():
            logger.warning("Command worker not alive; restarting it on submit")
            self._worker_task = self._spawn_worker()

        expiry_timestamp = None
        if expiry:
            expiry_timestamp = time.time() + expiry

        command = ControlCommand(
            command_id=command_id,
            target_service=target_service,
            target_asset=target_asset,
            operation=operation,
            parameters=parameters,
            status=CommandStatus.ACCEPTED,
            expiry=expiry_timestamp
        )

        self._commands[command_id] = command
        self._enforce_history_limit()

        await self._queue.put(command)

        logger.info(f"Command submitted: {command_id} -> {target_service}.{operation}")
        return True

    async def _worker_loop(self):
        while self._running:
            try:
                # 无超时阻塞取队列：规避 wait_for(queue.get) 在 Python < 3.12
                # 的超时/完成竞态丢命令问题；过期清理由 _cleanup_loop 独立承担
                command = await self._queue.get()
                await self._execute_with_hard_timeout(command)
                # 正常消费一条即重置自愈熔断计数
                self._restart_failures = 0
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Error in command worker loop: {e}")

    async def _execute_with_hard_timeout(self, command: ControlCommand):
        """在独立 task 中执行命令，超过 hard_timeout 后放弃等待。

        放弃等待（而非取消等待）是关键：若插件协程吞掉取消（CancelledError），
        wait_for 式的"取消并等待终止"会永久悬挂、拖死整个 worker；放弃式
        超时保证 worker 永不被单条命令卡死。
        """
        if command.expiry and time.time() > command.expiry:
            command.status = CommandStatus.EXPIRED
            command.updated_at = time.time()
            logger.warning(f"Command expired: {command.command_id}")
            return

        command.status = CommandStatus.EXECUTING
        command.updated_at = time.time()

        logger.info(f"Executing command: {command.command_id}")

        exec_task = asyncio.create_task(self._execute_command(command))
        exec_task.add_done_callback(
            lambda t, cmd=command: self._on_exec_task_done(t, cmd)
        )
        self._orphan_tasks.add(exec_task)
        if len(self._orphan_tasks) > 100:
            logger.warning(
                f"Orphaned command tasks accumulating: {len(self._orphan_tasks)} "
                "(plugin coroutines ignoring cancellation are leaking)"
            )
        done, pending = await asyncio.wait({exec_task}, timeout=self.hard_timeout)

        if exec_task in pending:
            # 放弃等待：任务成为孤儿。保留引用（stop 时统一取消，兼防 GC）。
            # 其真实结果/异常由 _on_exec_task_done 兜底记录，此处不再等待。
            logger.warning(
                f"Command abandoned after {self.hard_timeout}s hard timeout, "
                f"background task may still be running: {command.command_id}"
            )
            if command.status not in (
                CommandStatus.FAILED, CommandStatus.COMPLETED, CommandStatus.EXPIRED
            ):
                command.status = CommandStatus.FAILED
                command.error = f"Execution timeout after {self.hard_timeout}s"
                command.updated_at = time.time()
        else:
            self._orphan_tasks.discard(exec_task)
            # 正常结束：取出异常，避免 "Task exception was never retrieved" 静默
            exc = exec_task.exception()
            if exc is not None:
                logger.error(
                    f"Command task raised unexpectedly: {command.command_id}: {exc!r}"
                )

    def _on_exec_task_done(self, task: asyncio.Task, command: ControlCommand) -> None:
        """执行任务的完成兜底：检索异常，避免 "never retrieved" 静默。

        时序说明：本回调注册先于 asyncio.wait 的 waiter，task 完成时回调
        先于 worker 唤醒执行，因此无论正常完成还是被放弃的孤儿，task 此刻
        仍在 _orphan_tasks 中。处理是幂等的：回调先 discard，随后 worker
        收割路径的 discard 为 no-op；_execute_command 全捕获异常，正常完成
        时 exception() 为 None，不会产生日志。真正需要兜底的是"被放弃的
        孤儿任务在后台异常退出"的场景。
        """
        if task not in self._orphan_tasks:
            return
        self._orphan_tasks.discard(task)
        if task.cancelled():
            return
        exc = task.exception()
        if exc is not None:
            logger.error(
                f"Abandoned command task raised unexpectedly: "
                f"{command.command_id}: {exc!r}"
            )

    async def _execute_command(self, command: ControlCommand):
        """执行单条命令并写入终态。由 _execute_with_hard_timeout 的独立 task 调用。"""
        try:
            result = await self._dispatch_to_plugin(command)
        except asyncio.TimeoutError:
            if command.status != CommandStatus.FAILED:
                command.status = CommandStatus.FAILED
                command.error = "Command timeout"
                command.updated_at = time.time()
                logger.error(f"Command timeout: {command.command_id}")
            return

        except Exception as e:
            if command.status != CommandStatus.FAILED:
                command.status = CommandStatus.FAILED
                command.error = str(e)
                command.updated_at = time.time()
                logger.error(f"Command failed: {command.command_id}, error: {e}")
            else:
                # 终态保护：命令已被硬超时标记 FAILED，仅记录孤儿真实异常
                logger.info(
                    f"Abandoned command failed in background: "
                    f"{command.command_id}, error: {e}"
                )
            return

        # 终态保护：worker 已因硬超时把命令标记为 FAILED 时不覆盖状态，
        # 仅记录后台任务的真实结果
        if command.status == CommandStatus.FAILED:
            logger.info(
                f"Abandoned command actually completed in background: "
                f"{command.command_id}, result: {result}"
            )
            return

        command.result = result
        command.status = CommandStatus.COMPLETED
        command.updated_at = time.time()
        logger.info(f"Command completed: {command.command_id}")

    async def _cleanup_loop(self):
        """周期清理已过期的未消费命令（原逻辑内嵌在 worker 的 wait_for 超时分支中）"""
        while self._running:
            try:
                await asyncio.sleep(self._cleanup_interval)
                self._cleanup_expired_commands()
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Error in command cleanup loop: {e}")

    async def _dispatch_to_plugin(self, command: ControlCommand) -> Any:
        if self._plugin_loader is None:
            raise RuntimeError("Plugin loader not set")

        south_plugins = self._plugin_loader.get_plugins_by_type(PluginType.SOUTH)

        target_plugin = None
        for plugin in south_plugins:
            if plugin.plugin_id.endswith(f"_{command.target_asset}"):
                target_plugin = plugin
                break
            if plugin.name == command.target_service:
                target_plugin = plugin

        if target_plugin is None:
            raise RuntimeError(f"Target service not found: {command.target_service}")

        instance = target_plugin.instance

        if command.operation == "write_setpoint":
            if not hasattr(instance, "write_setpoint"):
                raise AttributeError(f"Plugin {command.target_service} does not support write_setpoint")

            return await asyncio.wait_for(
                instance.write_setpoint(
                    command.target_asset,
                    command.parameters.get("point"),
                    command.parameters.get("value")
                ),
                timeout=self.default_timeout
            )

        elif command.operation == "execute_operation":
            if not hasattr(instance, "execute_operation"):
                raise AttributeError(f"Plugin {command.target_service} does not support execute_operation")

            return await asyncio.wait_for(
                instance.execute_operation(
                    command.target_asset,
                    command.operation,
                    command.parameters
                ),
                timeout=self.default_timeout
            )

        else:
            raise ValueError(f"Unknown operation: {command.operation}")

    def _cleanup_expired_commands(self):
        now = time.time()
        expired = [
            cmd_id for cmd_id, cmd in self._commands.items()
            if cmd.expiry and now > cmd.expiry and cmd.status in [CommandStatus.PENDING, CommandStatus.ACCEPTED]
        ]

        for cmd_id in expired:
            self._commands[cmd_id].status = CommandStatus.EXPIRED
            logger.debug(f"Command expired: {cmd_id}")

    def _enforce_history_limit(self):
        while len(self._commands) > self.max_history:
            self._commands.popitem(last=False)

    def get_command_status(self, command_id: str) -> Optional[Dict[str, Any]]:
        command = self._commands.get(command_id)
        if command is None:
            return None

        return {
            "command_id": command.command_id,
            "status": command.status.value,
            "result": command.result,
            "error": command.error,
            "created_at": command.created_at,
            "updated_at": command.updated_at
        }

    def get_command_history(self, limit: int = 50) -> List[Dict[str, Any]]:
        commands = list(self._commands.values())[-limit:]
        return [
            {
                "command_id": c.command_id,
                "target_service": c.target_service,
                "operation": c.operation,
                "status": c.status.value,
                "created_at": c.created_at
            }
            for c in reversed(commands)
        ]
