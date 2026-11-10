"""项目管理仓库 - 数据库操作层"""

import logging
import json
import time
import aiosqlite
from typing import Any, Callable, List, Optional, Tuple

from ..models.panel import (
    PanelType,
    PanelResponse,
    PanelBriefResponse
)

logger = logging.getLogger(__name__)


class PanelRepository:
    """项目管理仓库 - 数据库操作层
    
    负责所有 panel_registry 表的数据库操作，包括：
    - CRUD 操作
    - 查询过滤
    - 数据解析
    """
    
    def __init__(self, db: aiosqlite.Connection):
        self._db = db
    
    async def exists(self, panel_id: str) -> bool:
        """检查项目是否存在
        
        Args:
            panel_id: 项目ID
            
        Returns:
            是否存在
        """
        async with self._db.execute(
            "SELECT panel_id FROM panel_registry WHERE panel_id = ?",
            [panel_id]
        ) as cursor:
            row = await cursor.fetchone()
            return row is not None
    
    async def create(
        self,
        panel_id: str,
        name: str,
        type: PanelType,
        description: Optional[str],
        data: dict,
        enabled: bool,
        created_at: float,
        updated_at: float
    ) -> PanelResponse:
        """创建项目
        
        Args:
            panel_id: 项目ID
            name: 项目名称
            type: 项目类型
            description: 项目描述
            data: 项目数据（JSON）
            enabled: 是否启用
            created_at: 创建时间戳
            updated_at: 更新时间戳
            
        Returns:
            创建的项目响应
        """
        await self._db.execute(
            """
            INSERT INTO panel_registry
            (panel_id, name, type, description, data, enabled, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            [
                panel_id,
                name,
                type.value,
                description,
                json.dumps(data),
                enabled,
                created_at,
                updated_at
            ]
        )
        await self._db.commit()
        
        return PanelResponse(
            id=panel_id,
            name=name,
            type=type,
            description=description,
            data=data,
            enabled=enabled,
            createdAt=created_at,
            updatedAt=updated_at
        )
    
    async def get(self, panel_id: str) -> Optional[PanelResponse]:
        """获取项目详情
        
        Args:
            panel_id: 项目ID
            
        Returns:
            项目详情，不存在返回None
        """
        async with self._db.execute(
            """
            SELECT panel_id, name, type, description, data, enabled, created_at, updated_at
            FROM panel_registry
            WHERE panel_id = ?
            """,
            [panel_id]
        ) as cursor:
            row = await cursor.fetchone()
        
        if not row:
            return None
        
        return self._parse_row(row)
    
    def _build_where_clause(
        self,
        type: Optional[PanelType] = None,
        enabled: Optional[bool] = None
    ) -> Tuple[str, List[Any]]:
        """构建查询条件

        Args:
            type: 按类型筛选
            enabled: 按启用状态筛选

        Returns:
            (where条件字符串, 参数列表)
        """
        conditions = []
        params: List[Any] = []

        if type is not None:
            conditions.append("type = ?")
            params.append(type.value)

        if enabled is not None:
            conditions.append("enabled = ?")
            params.append(enabled)

        return (" AND ".join(conditions) if conditions else "1=1", params)

    async def list(
        self,
        type: Optional[PanelType] = None,
        enabled: Optional[bool] = None
    ) -> List[PanelResponse]:
        """列出项目（含完整 data 字段）

        Args:
            type: 按类型筛选
            enabled: 按启用状态筛选

        Returns:
            项目列表
        """
        return await self._fetch_all(
            "panel_id, name, type, description, data, enabled, created_at, updated_at",
            self._parse_row,
            type=type,
            enabled=enabled
        )

    async def _fetch_all(
        self,
        columns: str,
        parser: Callable,
        type: Optional[PanelType] = None,
        enabled: Optional[bool] = None
    ) -> List[Any]:
        """按条件查询并解析所有行（list / list_brief 共用查询逻辑，仅 SELECT 列与解析函数不同）

        Args:
            columns: SELECT 列清单
            parser: 行解析函数（_parse_row / _parse_brief_row）
            type: 按类型筛选
            enabled: 按启用状态筛选

        Returns:
            解析后的模型列表
        """
        where_clause, params = self._build_where_clause(type, enabled)

        query = f"""
            SELECT {columns}
            FROM panel_registry
            WHERE {where_clause}
            ORDER BY updated_at DESC
        """

        rows = []
        async with self._db.execute(query, params) as cursor:
            async for row in cursor:
                rows.append(row)

        return [parser(row) for row in rows]

    async def list_brief(
        self,
        type: Optional[PanelType] = None,
        enabled: Optional[bool] = None
    ) -> List[PanelBriefResponse]:
        """列出项目概要（不查询 data 字段，避免大数据量传输）

        Args:
            type: 按类型筛选
            enabled: 按启用状态筛选

        Returns:
            项目概要列表（不含 data）
        """
        return await self._fetch_all(
            "panel_id, name, type, description, enabled, created_at, updated_at",
            self._parse_brief_row,
            type=type,
            enabled=enabled
        )

    async def get_brief(self, panel_id: str) -> Optional[PanelBriefResponse]:
        """获取单个项目概要（不查询 data 字段，用于轻量校验/展示）

        Args:
            panel_id: 项目ID

        Returns:
            项目概要，不存在返回None
        """
        async with self._db.execute(
            """
            SELECT panel_id, name, type, description, enabled, created_at, updated_at
            FROM panel_registry
            WHERE panel_id = ?
            """,
            [panel_id]
        ) as cursor:
            row = await cursor.fetchone()

        if not row:
            return None

        return self._parse_brief_row(row)

    # ---------- app_settings 键值设置 ----------

    async def get_setting(self, key: str) -> Optional[str]:
        """读取全局设置

        Args:
            key: 设置键

        Returns:
            设置值，不存在返回None
        """
        async with self._db.execute(
            "SELECT value FROM app_settings WHERE key = ?",
            [key]
        ) as cursor:
            row = await cursor.fetchone()

        return row[0] if row else None

    async def get_setting_with_meta(self, key: str) -> Optional[Tuple[str, float]]:
        """读取全局设置及更新时间

        Args:
            key: 设置键

        Returns:
            (设置值, 更新时间戳)，不存在返回None
        """
        async with self._db.execute(
            "SELECT value, updated_at FROM app_settings WHERE key = ?",
            [key]
        ) as cursor:
            row = await cursor.fetchone()

        return (row[0], row[1]) if row else None

    async def list_settings(self) -> List[Tuple[str, str, float]]:
        """列出全部全局设置

        Returns:
            (key, value, updated_at) 元组列表，按 key 排序
        """
        async with self._db.execute(
            "SELECT key, value, updated_at FROM app_settings ORDER BY key"
        ) as cursor:
            rows = await cursor.fetchall()

        return [(row[0], row[1], row[2]) for row in rows]

    async def set_setting(self, key: str, value: str) -> float:
        """写入全局设置（upsert）

        Args:
            key: 设置键
            value: 设置值

        Returns:
            写入的 updated_at 时间戳（供响应复用，保证与 GET 读回一致）
        """
        updated_at = time.time()
        await self._db.execute(
            """
            INSERT INTO app_settings (key, value, updated_at)
            VALUES (?, ?, ?)
            ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
            """,
            [key, value, updated_at]
        )
        await self._db.commit()
        return updated_at

    async def delete_setting(self, key: str) -> None:
        """删除全局设置（不存在时静默）

        Args:
            key: 设置键
        """
        await self._db.execute(
            "DELETE FROM app_settings WHERE key = ?",
            [key]
        )
        await self._db.commit()

    async def delete_and_clear_setting(self, panel_id: str, setting_key: str) -> bool:
        """单事务内删除面板并清除指向它的全局设置（原子操作）

        仅当 setting_key 对应的值等于 panel_id 时才清除该设置，
        避免误清其他键值；面板不存在时不做任何修改。

        Args:
            panel_id: 面板ID
            setting_key: 需要联动清理的全局设置键

        Returns:
            面板存在且已删除返回True，面板不存在返回False
        """
        async with self._db.execute(
            "SELECT 1 FROM panel_registry WHERE panel_id = ?",
            [panel_id]
        ) as cursor:
            if not await cursor.fetchone():
                return False

        # 两次 DELETE 处于同一事务，commit 前对其他连接不可见
        await self._db.execute(
            "DELETE FROM panel_registry WHERE panel_id = ?",
            [panel_id]
        )
        await self._db.execute(
            "DELETE FROM app_settings WHERE key = ? AND value = ?",
            [setting_key, panel_id]
        )
        await self._db.commit()
        return True
    
    async def update(
        self,
        panel_id: str,
        name: Optional[str] = None,
        description: Optional[str] = None,
        data: Optional[dict] = None,
        enabled: Optional[bool] = None,
        updated_at: float = None
    ) -> Optional[PanelResponse]:
        """更新项目
        
        Args:
            panel_id: 项目ID
            name: 新名称（可选）
            description: 新描述（可选）
            data: 新数据（可选，完整替换）
            enabled: 新启用状态（可选）
            updated_at: 更新时间戳
            
        Returns:
            更新后的项目，不存在返回None
        """
        # 构建更新字段
        data_json = None
        if data:
            data_json = json.dumps(data)
        
        await self._db.execute(
            """
            UPDATE panel_registry
            SET
                name = COALESCE(?, name),
                description = COALESCE(?, description),
                data = COALESCE(?, data),
                enabled = COALESCE(?, enabled),
                updated_at = ?
            WHERE panel_id = ?
            """,
            [
                name,
                description,
                data_json,
                enabled,
                updated_at,
                panel_id
            ]
        )
        await self._db.commit()
        
        return await self.get(panel_id)
    
    async def delete(self, panel_id: str) -> bool:
        """删除项目
        
        Args:
            panel_id: 项目ID
            
        Returns:
            是否删除成功（不存在返回False）
        """
        if not await self.exists(panel_id):
            return False
        
        await self._db.execute(
            "DELETE FROM panel_registry WHERE panel_id = ?",
            [panel_id]
        )
        await self._db.commit()
        
        return True
    
    def _parse_row(self, row) -> PanelResponse:
        """解析数据库行
        
        Args:
            row: 数据库行
            
        Returns:
            项目响应模型
        """
        try:
            data_dict = json.loads(row[4]) if row[4] else {}
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse data JSON for panel {row[0]}: {e}")
            data_dict = {}
        
        return PanelResponse(
            id=row[0],
            name=row[1],
            type=PanelType(row[2]),
            description=row[3],
            data=data_dict,
            # enabled 列无 NOT NULL 约束，历史数据可能为 NULL，回退为默认启用
            enabled=bool(row[5]) if row[5] is not None else True,
            createdAt=row[6],
            updatedAt=row[7]
        )

    def _parse_brief_row(self, row) -> PanelBriefResponse:
        """解析数据库行为项目概要（不含 data 字段）

        Args:
            row: 数据库行（panel_id, name, type, description, enabled, created_at, updated_at）

        Returns:
            项目概要响应模型
        """
        return PanelBriefResponse(
            id=row[0],
            name=row[1],
            type=PanelType(row[2]),
            description=row[3],
            # enabled 列无 NOT NULL 约束，历史数据可能为 NULL，回退为默认启用
            enabled=bool(row[4]) if row[4] is not None else True,
            createdAt=row[5],
            updatedAt=row[6]
        )