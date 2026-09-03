"""Scheduler - Task scheduler for managing periodic and async tasks"""

import asyncio
import logging
import time
import warnings
from typing import Callable, Dict, List, Optional, Set
from dataclasses import dataclass, field
from enum import Enum
from datetime import datetime
import uuid

logger = logging.getLogger(__name__)

# 失败日志收敛：持久失败的任务（如采集断连）若每次都打完整堆栈会刷屏。
# 完整 ERROR(含 exc_info) 最多每 FAILURE_LOG_INTERVAL 秒输出一次，其余降级为单行 WARNING。
FAILURE_LOG_INTERVAL = 300.0


class TaskType(str, Enum):
    POLLING = "Polling"
    UPLOAD = "Upload"
    MAINTENANCE = "Maintenance"
    CUSTOM = "Custom"


class TaskStatus(str, Enum):
    """[DEPRECATED] TaskStatus is not used externally and will be removed in a future version."""
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"


@dataclass
class ScheduledTask:
    task_id: str
    name: str
    task_type: TaskType
    callback: Callable
    interval: Optional[float] = None
    initial_delay: float = 0
    args: tuple = field(default_factory=tuple)
    kwargs: dict = field(default_factory=dict)
    status: TaskStatus = TaskStatus.PENDING
    last_run: Optional[datetime] = None
    next_run: Optional[datetime] = None
    error_count: int = 0
    max_errors: int = 3
    last_full_error_log: float = 0.0  # 上次输出完整堆栈的 monotonic 时间(秒)，用于失败日志收敛
    _task: Optional[asyncio.Task] = None


class Scheduler:
    def __init__(self, max_workers: int = 10, task_timeout: int = 30):
        self.max_workers = max_workers
        self.task_timeout = task_timeout
        self._tasks: Dict[str, ScheduledTask] = {}
        self._running_tasks: Set[str] = set()
        self._running: bool = False
        self._lock = asyncio.Lock()
        self._semaphore = asyncio.Semaphore(max_workers)

    async def start(self):
        self._running = True
        logger.info(f"Scheduler started with {self.max_workers} max workers")

    async def stop(self):
        self._running = False
        await self.cancel_all()
        logger.info("Scheduler stopped")

    def add_task(
        self,
        name: str,
        callback: Callable,
        task_type: TaskType = TaskType.CUSTOM,
        interval: Optional[float] = None,
        initial_delay: float = 0,
        *args,
        **kwargs
    ) -> str:
        task_id = str(uuid.uuid4())
        task = ScheduledTask(
            task_id=task_id,
            name=name,
            task_type=task_type,
            callback=callback,
            interval=interval,
            initial_delay=initial_delay,
            args=args,
            kwargs=kwargs
        )
        
        if interval is not None and interval > 0:
            from datetime import timedelta
            task.next_run = datetime.now() + timedelta(seconds=initial_delay)
        
        self._tasks[task_id] = task
        logger.info(f"Task added: {name} ({task_id}) type={task_type.value}")
        return task_id

    async def start_task(self, task_id: str) -> bool:
        async with self._lock:
            if task_id not in self._tasks:
                logger.warning(f"Task {task_id} not found")
                return False
            
            task = self._tasks[task_id]
            if task._task is not None and not task._task.done():
                logger.warning(f"Task {task_id} is already running")
                return False
            
            task.status = TaskStatus.RUNNING
            self._running_tasks.add(task_id)
            
            if task.interval is not None and task.interval > 0:
                task._task = asyncio.create_task(self._run_periodic(task))
            else:
                task._task = asyncio.create_task(self._run_once(task))
            
            logger.info(f"Task started: {task.name} ({task_id})")
            return True

    async def stop_task(self, task_id: str) -> bool:
        async with self._lock:
            if task_id not in self._tasks:
                return False
            
            task = self._tasks[task_id]
            if task._task is not None and not task._task.done():
                task._task.cancel()
                try:
                    await task._task
                except asyncio.CancelledError:
                    pass
            
            task.status = TaskStatus.CANCELLED
            self._running_tasks.discard(task_id)
            logger.info(f"Task stopped: {task.name} ({task_id})")
            return True

    async def cancel_all(self):
        task_ids = list(self._tasks.keys())
        for task_id in task_ids:
            await self.stop_task(task_id)

    def _log_task_failure(
        self, task: ScheduledTask, summary: str, exc: Optional[BaseException] = None
    ) -> None:
        """告警收敛：同一任务持续失败时，完整 ERROR(含堆栈) 最多每 FAILURE_LOG_INTERVAL 秒输出一次，
        其余失败降级为单行 WARNING，避免刷屏；距上次完整日志已超过阈值时仍给完整堆栈便于排障。
        """
        now = time.monotonic()
        if now - task.last_full_error_log >= FAILURE_LOG_INTERVAL:
            if exc is not None:
                logger.error(summary, exc_info=exc)
            else:
                logger.error(summary)
            task.last_full_error_log = now
        else:
            logger.warning(
                f"{summary} (suppressed; {task.error_count} consecutive failures, "
                f"full traceback every {int(FAILURE_LOG_INTERVAL)}s)"
            )

    async def _run_once(self, task: ScheduledTask):
        async with self._semaphore:
            try:
                logger.debug(f"Executing task: {task.name}")
                task.last_run = datetime.now()
                
                if asyncio.iscoroutinefunction(task.callback):
                    await asyncio.wait_for(
                        task.callback(*task.args, **task.kwargs),
                        timeout=self.task_timeout
                    )
                else:
                    await asyncio.wait_for(
                        asyncio.to_thread(task.callback, *task.args, **task.kwargs),
                        timeout=self.task_timeout
                    )
                
                task.status = TaskStatus.COMPLETED
                task.error_count = 0
                logger.debug(f"Task completed: {task.name}")
                
            except asyncio.TimeoutError:
                task.error_count += 1
                task.status = TaskStatus.FAILED
                self._log_task_failure(task, f"Task timeout: {task.name}")
            except asyncio.CancelledError:
                task.status = TaskStatus.CANCELLED
                logger.info(f"Task cancelled: {task.name}")
                raise
            except Exception as e:
                task.error_count += 1
                task.status = TaskStatus.FAILED
                self._log_task_failure(
                    task, f"Task failed: {task.name}, error: {e}", exc=e
                )
            finally:
                self._running_tasks.discard(task.task_id)

    async def _run_periodic(self, task: ScheduledTask):
        if task.initial_delay > 0:
            await asyncio.sleep(task.initial_delay)

        # 退避基数：避免与采集间隔叠加过长；至少不低于任务硬超时
        backoff = (task.interval if (task.interval and task.interval > 0) else 0) or max(self.task_timeout, 5)

        while self._running:
            await self._run_once(task)

            if not self._running:
                break

            # Q9 修复：原行为在 max_errors 次错误后永久取消任务（一次网络抖动即永久停采集）。
            # 改为退避后持续重试 + 持续告警，不再取消任务。
            if task.max_errors > 0 and task.error_count >= task.max_errors:
                logger.error(
                    f"Task {task.name} reached max_errors ({task.max_errors}); "
                    f"backing off {backoff}s and retrying (collection will NOT be stopped)"
                )
                await asyncio.sleep(backoff)
                task.error_count = 0
                continue

            if task.interval and task.interval > 0:
                await asyncio.sleep(task.interval)
            else:
                break

    def get_task(self, task_id: str) -> Optional[ScheduledTask]:
        return self._tasks.get(task_id)

    def get_all_tasks(self) -> List[ScheduledTask]:
        return list(self._tasks.values())

    def get_running_tasks(self) -> List[ScheduledTask]:
        return [self._tasks[tid] for tid in self._running_tasks if tid in self._tasks]

    def get_tasks_by_type(self, task_type: TaskType) -> List[ScheduledTask]:
        return [t for t in self._tasks.values() if t.task_type == task_type]

    def remove_task(self, task_id: str) -> bool:
        if task_id in self._tasks:
            del self._tasks[task_id]
            return True
        return False
