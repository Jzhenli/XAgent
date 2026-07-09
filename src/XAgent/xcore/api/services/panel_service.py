"""项目管理服务 - 业务逻辑层"""

import logging
import aiosqlite
from typing import List, Optional

from ..models.panel import (
    PanelCreate,
    PanelUpdate,
    PanelResponse,
    PanelType
)
from ..repositories.panel_repository import PanelRepository

logger = logging.getLogger(__name__)


class PanelService:
    """项目管理服务 - 业务逻辑层
    
    负责项目管理相关的业务逻辑，包括：
    - 数据验证
    - 业务规则处理
    - 调用 Repository 进行数据操作
    
    数据库操作委托给 PanelRepository 处理。
    """
    
    def __init__(self, db: aiosqlite.Connection):
        """初始化服务
        
        Args:
            db: 数据库连接
        """
        self._repo = PanelRepository(db)
    
    async def create_panel(self, panel: PanelCreate) -> PanelResponse:
        """创建项目
        
        Args:
            panel: 创建请求
            
        Returns:
            创建的项目
            
        Raises:
            ValueError: 项目已存在
        """
        # 业务规则：检查是否已存在
        if await self._repo.exists(panel.id):
            raise ValueError(f"Panel {panel.id} already exists")
        
        # 使用默认配置或提供的配置
        data = panel.data or {}
        
        # 调用 Repository 创建
        result = await self._repo.create(
            panel_id=panel.id,
            name=panel.name,
            type=panel.type,
            description=panel.description,
            data=data,
            enabled=True,
            created_at=panel.createdAt,
            updated_at=panel.updatedAt
        )
        
        logger.info(f"Panel created: {panel.id}")
        return result
    
    async def get_panel(self, panel_id: str) -> Optional[PanelResponse]:
        """获取项目详情
        
        Args:
            panel_id: 项目ID
            
        Returns:
            项目详情，不存在返回None
        """
        return await self._repo.get(panel_id)
    
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
        return await self._repo.list(type=type, enabled=enabled)
    
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
        # 业务规则：检查是否存在
        if not await self._repo.exists(panel_id):
            raise ValueError(f"Panel {panel_id} not found")
        
        # 调用 Repository 更新
        result = await self._repo.update(
            panel_id=panel_id,
            name=updates.name,
            description=updates.description,
            data=updates.data,
            enabled=updates.enabled,
            updated_at=updates.updatedAt
        )
        
        logger.info(f"Panel updated: {panel_id}")
        return result
    
    async def delete_panel(self, panel_id: str) -> None:
        """删除项目（物理删除）
        
        Args:
            panel_id: 项目ID
            
        Raises:
            ValueError: 项目不存在
        """
        # 调用 Repository 删除
        if not await self._repo.delete(panel_id):
            raise ValueError(f"Panel {panel_id} not found")
        
        logger.info(f"Panel deleted permanently: {panel_id}")