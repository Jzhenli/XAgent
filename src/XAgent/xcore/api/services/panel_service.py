"""项目管理服务（数据库为中心）"""

import logging
import json
from typing import List, Optional

from ..models.panel import (
    PanelCreate,
    PanelUpdate,
    PanelResponse,
    PanelType,
    PanelData
)

logger = logging.getLogger(__name__)


class PanelService:
    """项目管理服务"""

    def __init__(self, db):
        self._db = db

    async def create_panel(self, panel: PanelCreate) -> PanelResponse:
        """创建项目

        Args:
            panel: 创建请求

        Returns:
            创建的项目

        Raises:
            ValueError: 项目已存在
        """
        # 检查是否已存在
        existing = await self._db.fetchone(
            "SELECT panel_id FROM panel_registry WHERE panel_id = ?",
            [panel.id]
        )

        if existing:
            raise ValueError(f"Panel {panel.id} already exists")

        # 使用默认配置或提供的配置
        data = panel.data or PanelData()

        # 插入数据库
        await self._db.execute(
            """
            INSERT INTO panel_registry
            (panel_id, name, type, description, data, enabled, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            [
                panel.id,
                panel.name,
                panel.type.value,
                panel.description,
                data.model_dump_json(),
                True,
                panel.createdAt,
                panel.updatedAt
            ]
        )
        await self._db.commit()

        logger.info(f"Panel created: {panel.id}")

        return PanelResponse(
            id=panel.id,
            name=panel.name,
            type=panel.type,
            description=panel.description,
            data=data,
            enabled=True,
            createdAt=panel.createdAt,
            updatedAt=panel.updatedAt
        )

    async def get_panel(self, panel_id: str) -> Optional[PanelResponse]:
        """获取项目详情

        Args:
            panel_id: 项目ID

        Returns:
            项目详情，不存在返回None
        """
        row = await self._db.fetchone(
            """
            SELECT panel_id, name, type, description, data, enabled, created_at, updated_at
            FROM panel_registry
            WHERE panel_id = ?
            """,
            [panel_id]
        )

        if not row:
            return None

        return self._parse_row(row)

    async def list_panels(
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

        rows = await self._db.fetchall(
            f"""
            SELECT panel_id, name, type, description, data, enabled, created_at, updated_at
            FROM panel_registry
            WHERE {where_clause}
            ORDER BY updated_at DESC
            """,
            params
        )

        return [self._parse_row(row) for row in rows]

    async def update_panel(
        self,
        panel_id: str,
        updates: PanelUpdate
    ) -> PanelResponse:
        """更新项目（完整替换模式）

        Args:
            panel_id: 项目ID
            updates: 更新内容

        Returns:
            更新后的项目

        Raises:
            ValueError: 项目不存在

        Note:
            采用完整替换模式：如果提供data字段，直接覆盖原data；
            如果不提供data字段，保留原data不变。
            前端需发送完整的data对象。
        """
        # 检查是否存在
        existing = await self._db.fetchone(
            "SELECT panel_id FROM panel_registry WHERE panel_id = ?",
            [panel_id]
        )

        if not existing:
            raise ValueError(f"Panel {panel_id} not found")

        # 完整替换模式：如果提供了data，直接覆盖；否则保留原值
        data_json = None
        if updates.data:
            data_json = updates.data.model_dump_json()

        # 更新数据库
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
                updates.name,
                updates.description,
                data_json,
                updates.enabled,
                updates.updatedAt,
                panel_id
            ]
        )
        await self._db.commit()

        logger.info(f"Panel updated: {panel_id}")

        return await self.get_panel(panel_id)

    async def delete_panel(self, panel_id: str) -> None:
        """删除项目（物理删除）

        Args:
            panel_id: 项目ID

        Raises:
            ValueError: 项目不存在
        """
        # 检查是否存在
        existing = await self.get_panel(panel_id)
        if not existing:
            raise ValueError(f"Panel {panel_id} not found")

        # 物理删除
        await self._db.execute(
            "DELETE FROM panel_registry WHERE panel_id = ?",
            [panel_id]
        )
        await self._db.commit()

        logger.info(f"Panel deleted permanently: {panel_id}")

    def _parse_row(self, row) -> PanelResponse:
        """解析数据库行"""
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