"""项目管理服务 - 业务逻辑层"""

import logging
import aiosqlite
from typing import List, Optional, Tuple

from ..models.panel import (
    PanelCreate,
    PanelUpdate,
    PanelResponse,
    PanelBriefResponse,
    PanelType
)
from ..repositories.panel_repository import PanelRepository

logger = logging.getLogger(__name__)

# app_settings 中存储首页面板ID的键
HOMEPAGE_SETTING_KEY = "homepage_panel_id"


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

    async def list_panels_brief(
        self,
        type: Optional[PanelType] = None,
        enabled: Optional[bool] = None
    ) -> List[PanelBriefResponse]:
        """列出项目概要（不含 data 字段）

        用于项目概览场景，避免加载/传输体积较大的 data 数据。

        Args:
            type: 按类型筛选
            enabled: 按启用状态筛选

        Returns:
            项目概要列表
        """
        return await self._repo.list_brief(type=type, enabled=enabled)

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
        # 单事务内删除面板并联动清除首页设置（原子操作，见 repo.delete_and_clear_setting）
        if not await self._repo.delete_and_clear_setting(panel_id, HOMEPAGE_SETTING_KEY):
            raise ValueError(f"Panel {panel_id} not found")

        logger.info(f"Panel deleted permanently: {panel_id}")

    async def get_homepage(self) -> Tuple[Optional[str], Optional[PanelBriefResponse]]:
        """获取首页设置（读时校验，自动清理脏数据）

        无论面板通过哪条路径被删除/禁用（直接删除、配置导入替换等），
        读取时都会校验面板存在且启用，失效时自动清除设置并视为未设置。

        Returns:
            (panel_id, panel概要)，未设置或已失效返回 (None, None)
        """
        panel_id = await self._repo.get_setting(HOMEPAGE_SETTING_KEY)
        if not panel_id:
            return None, None

        panel = await self._repo.get_brief(panel_id)
        if not panel or not panel.enabled:
            # 脏数据自愈：清除指向已删除/已禁用面板的首页设置
            await self._repo.delete_setting(HOMEPAGE_SETTING_KEY)
            logger.warning(f"Cleared stale homepage setting: panel {panel_id} not found or disabled")
            return None, None

        return panel_id, panel

    async def set_homepage(self, panel_id: str) -> PanelBriefResponse:
        """设置首页面板

        Args:
            panel_id: 面板ID

        Returns:
            设置为首页的面板概要

        Raises:
            ValueError: 面板不存在 / 面板已禁用
        """
        panel = await self._repo.get_brief(panel_id)
        if not panel:
            raise ValueError(f"Panel {panel_id} not found")
        if not panel.enabled:
            raise ValueError(f"Panel {panel_id} is disabled")

        await self._repo.set_setting(HOMEPAGE_SETTING_KEY, panel_id)
        logger.info(f"Homepage set to panel: {panel_id}")
        return panel

    async def clear_homepage(self) -> None:
        """取消首页设置"""
        await self._repo.delete_setting(HOMEPAGE_SETTING_KEY)
        logger.info("Homepage setting cleared")