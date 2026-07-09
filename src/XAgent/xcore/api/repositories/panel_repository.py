"""项目管理仓库 - 数据库操作层"""

import logging
import json
import aiosqlite
from typing import List, Optional

from ..models.panel import (
    PanelType,
    PanelData,
    PanelResponse
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
        data: PanelData,
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
            data: 项目数据
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
                data.model_dump_json(),
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
    
    async def list(
        self,
        type: Optional[PanelType] = None,
        enabled: Optional[bool] = None
    ) -> List[PanelResponse]:
        """列出项目
        
        Args:
            type: 按类型筛选
            enabled: 按启用状态筛选
            
        Returns:
            项目列表
        """
        conditions = []
        params = []
        
        if type:
            conditions.append("type = ?")
            params.append(type.value)
        
        if enabled is not None:
            conditions.append("enabled = ?")
            params.append(enabled)
        
        where_clause = " AND ".join(conditions) if conditions else "1=1"
        
        query = f"""
            SELECT panel_id, name, type, description, data, enabled, created_at, updated_at
            FROM panel_registry
            WHERE {where_clause}
            ORDER BY updated_at DESC
        """
        
        rows = []
        async with self._db.execute(query, params) as cursor:
            async for row in cursor:
                rows.append(row)
        
        return [self._parse_row(row) for row in rows]
    
    async def update(
        self,
        panel_id: str,
        name: Optional[str] = None,
        description: Optional[str] = None,
        data: Optional[PanelData] = None,
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
            data_json = data.model_dump_json()
        
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
            data=PanelData(**data_dict),
            enabled=row[5],
            createdAt=row[6],
            updatedAt=row[7]
        )