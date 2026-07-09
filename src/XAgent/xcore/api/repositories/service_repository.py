"""北向服务配置仓库 - 数据库为中心的配置管理

此模块提供北向服务配置的数据库操作功能，包括：
- 服务配置的CRUD操作
- 服务状态管理
- 配置版本控制
- 配置历史查询
"""

import json
import logging
import time
import hashlib
from typing import Any, Dict, List, Optional
from dataclasses import replace as dataclass_replace
import aiosqlite

from ...config.service_config import ServiceConfig

logger = logging.getLogger(__name__)


class ServiceRepository:
    """北向服务配置仓库 - 数据库操作层"""

    def __init__(self, db: aiosqlite.Connection):
        self._db = db

    async def get_service(self, name: str) -> Optional[ServiceConfig]:
        """获取服务配置

        Args:
            name: 服务名称

        Returns:
            服务配置，如果不存在返回None
        """
        async with self._db.execute(
            """
            SELECT name, display_name, description, protocol,
                   connection_config, adapter_config, upload_config, command_config,
                   enabled, status, priority, metadata, tags, statistics,
                   created_at, updated_at, created_by, updated_by
            FROM service_registry
            WHERE name = ?
            """,
            (name,)
        ) as cursor:
            row = await cursor.fetchone()
            if not row:
                return None

            return ServiceConfig(
                name=row[0],
                display_name=row[1],
                description=row[2],
                protocol=row[3],
                connection_config=json.loads(row[4]) if row[4] else {},
                adapter_config=json.loads(row[5]) if row[5] else {},
                upload_config=json.loads(row[6]) if row[6] else {},
                command_config=json.loads(row[7]) if row[7] else {},
                enabled=bool(row[8]),
                status=row[9] or "offline",
                priority=row[10] or 0,
                metadata=json.loads(row[11]) if row[11] else {},
                tags=json.loads(row[12]) if row[12] else [],
                statistics=json.loads(row[13]) if row[13] else {},
                created_at=row[14] or time.time(),
                updated_at=row[15] or time.time(),
                created_by=row[16],
                updated_by=row[17]
            )

    async def list_services(
        self,
        enabled: Optional[bool] = None,
        protocol: Optional[str] = None,
        status: Optional[str] = None
    ) -> List[ServiceConfig]:
        """列出服务

        Args:
            enabled: 按启用状态过滤
            protocol: 按协议类型过滤
            status: 按状态过滤

        Returns:
            服务列表
        """
        conditions = []
        params = []

        if enabled is not None:
            conditions.append("enabled = ?")
            params.append(1 if enabled else 0)

        if protocol:
            conditions.append("protocol = ?")
            params.append(protocol)

        if status:
            conditions.append("status = ?")
            params.append(status)

        where_clause = " AND ".join(conditions) if conditions else "1=1"

        query = f"""
            SELECT name, display_name, description, protocol,
                   connection_config, adapter_config, upload_config, command_config,
                   enabled, status, priority, metadata, tags, statistics,
                   created_at, updated_at, created_by, updated_by
            FROM service_registry
            WHERE {where_clause}
            ORDER BY priority DESC, name
        """

        services = []
        async with self._db.execute(query, params) as cursor:
            async for row in cursor:
                services.append(ServiceConfig(
                    name=row[0],
                    display_name=row[1],
                    description=row[2],
                    protocol=row[3],
                    connection_config=json.loads(row[4]) if row[4] else {},
                    adapter_config=json.loads(row[5]) if row[5] else {},
                    upload_config=json.loads(row[6]) if row[6] else {},
                    command_config=json.loads(row[7]) if row[7] else {},
                    enabled=bool(row[8]),
                    status=row[9] or "offline",
                    priority=row[10] or 0,
                    metadata=json.loads(row[11]) if row[11] else {},
                    tags=json.loads(row[12]) if row[12] else [],
                    statistics=json.loads(row[13]) if row[13] else {},
                    created_at=row[14] or time.time(),
                    updated_at=row[15] or time.time(),
                    created_by=row[16],
                    updated_by=row[17]
                ))

        return services

    async def create_service(
        self,
        service: ServiceConfig,
        user: Optional[str] = None
    ) -> ServiceConfig:
        """创建服务

        Args:
            service: 服务配置
            user: 操作用户

        Returns:
            创建的服务配置

        Raises:
            ValueError: 如果服务已存在
        """
        now = time.time()
        config_json = json.dumps(service.to_dict(), sort_keys=True)
        config_hash = self._compute_hash(config_json)

        try:
            await self._db.execute(
                """
                INSERT INTO service_registry (
                    name, display_name, description, protocol,
                    connection_config, adapter_config, upload_config, command_config,
                    enabled, status, priority, metadata, tags, statistics,
                    config_hash, created_at, updated_at, created_by, updated_by
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    service.name,
                    service.display_name,
                    service.description,
                    service.protocol,
                    json.dumps(service.connection_config),
                    json.dumps(service.adapter_config),
                    json.dumps(service.upload_config),
                    json.dumps(service.command_config),
                    1 if service.enabled else 0,
                    service.status,
                    service.priority,
                    json.dumps(service.metadata),
                    json.dumps(service.tags),
                    json.dumps(service.statistics),
                    config_hash,
                    now,
                    now,
                    user,
                    user
                )
            )
        except aiosqlite.IntegrityError as e:
            if 'UNIQUE constraint' in str(e):
                raise ValueError(f"Service '{service.name}' already exists")
            raise ValueError(f"Failed to create service '{service.name}': {e}")

        await self._save_config_version(
            'service', service.name, service.to_dict(),
            'create', user, now
        )

        await self._db.commit()

        service.version = 1
        service.created_at = now
        service.updated_at = now
        service.created_by = user
        service.updated_by = user

        logger.info(f"Service created: {service.name} by {user}")
        return service

    async def update_service(
        self,
        name: str,
        updates: Dict[str, Any],
        user: Optional[str] = None
    ) -> ServiceConfig:
        """更新服务

        Args:
            name: 服务名称
            updates: 更新内容
            user: 操作用户

        Returns:
            更新后的服务配置

        Raises:
            ValueError: 如果服务不存在
        """
        service = await self.get_service(name)
        if not service:
            raise ValueError(f"Service '{name}' not found")

        old_config = service.to_dict()

        for key, value in updates.items():
            if key == 'name':
                continue
            if hasattr(service, key):
                setattr(service, key, value)

        now = time.time()
        service.updated_at = now
        service.updated_by = user
        service.version += 1

        config_json = json.dumps(service.to_dict(), sort_keys=True)
        config_hash = self._compute_hash(config_json)

        await self._db.execute(
            """
            UPDATE service_registry SET
                display_name = ?, description = ?, protocol = ?,
                connection_config = ?, adapter_config = ?, upload_config = ?, command_config = ?,
                enabled = ?, status = ?, priority = ?, metadata = ?, tags = ?, statistics = ?,
                config_hash = ?, updated_at = ?, updated_by = ?
            WHERE name = ?
            """,
            (
                service.display_name,
                service.description,
                service.protocol,
                json.dumps(service.connection_config),
                json.dumps(service.adapter_config),
                json.dumps(service.upload_config),
                json.dumps(service.command_config),
                1 if service.enabled else 0,
                service.status,
                service.priority,
                json.dumps(service.metadata),
                json.dumps(service.tags),
                json.dumps(service.statistics),
                config_hash,
                now,
                user,
                name
            )
        )

        await self._save_config_version(
            'service', name, service.to_dict(),
            'update', user, now, old_config
        )

        await self._db.commit()

        logger.info(f"Service updated: {name} v{service.version} by {user}")
        return service

    async def replace_service(
        self,
        name: str,
        service: ServiceConfig,
        user: Optional[str] = None
    ) -> ServiceConfig:
        """全量替换服务配置

        Args:
            name: 服务名称
            service: 新的服务配置
            user: 操作用户

        Returns:
            更新后的服务配置

        Raises:
            ValueError: 如果服务不存在
        """
        existing = await self.get_service(name)
        if not existing:
            raise ValueError(f"Service '{name}' not found")

        old_config = existing.to_dict()
        now = time.time()

        # 使用 dataclass_replace 创建新对象，避免修改传入对象
        updated_service = dataclass_replace(
            service,
            version=existing.version + 1,
            updated_at=now,
            updated_by=user,
            created_at=existing.created_at,
            created_by=existing.created_by
        )

        config_json = json.dumps(updated_service.to_dict(), sort_keys=True)
        config_hash = self._compute_hash(config_json)

        await self._db.execute(
            """
            UPDATE service_registry SET
                display_name = ?, description = ?, protocol = ?,
                connection_config = ?, adapter_config = ?, upload_config = ?, command_config = ?,
                enabled = ?, status = ?, priority = ?, metadata = ?, tags = ?, statistics = ?,
                config_hash = ?, version = ?, updated_at = ?, updated_by = ?
            WHERE name = ?
            """,
            (
                updated_service.display_name,
                updated_service.description,
                updated_service.protocol,
                json.dumps(updated_service.connection_config),
                json.dumps(updated_service.adapter_config),
                json.dumps(updated_service.upload_config),
                json.dumps(updated_service.command_config),
                1 if updated_service.enabled else 0,
                updated_service.status,
                updated_service.priority,
                json.dumps(updated_service.metadata),
                json.dumps(updated_service.tags),
                json.dumps(updated_service.statistics),
                config_hash,
                updated_service.version,
                now,
                user,
                name
            )
        )

        await self._save_config_version(
            'service', name, updated_service.to_dict(),
            'update', user, now, old_config
        )

        await self._db.commit()

        logger.info(f"Service replaced: {name} v{updated_service.version} by {user}")
        return updated_service

    async def delete_service(
        self,
        name: str,
        user: Optional[str] = None
    ) -> None:
        """删除服务

        Args:
            name: 服务名称
            user: 操作用户

        Raises:
            ValueError: 如果服务不存在
        """
        service = await self.get_service(name)
        if not service:
            raise ValueError(f"Service '{name}' not found")

        await self._db.execute(
            "DELETE FROM service_registry WHERE name = ?",
            (name,)
        )

        await self._save_config_version(
            'service', name, service.to_dict(),
            'delete', user, time.time()
        )

        await self._db.commit()

        logger.info(f"Service deleted: {name} by {user}")

    async def update_status(
        self,
        name: str,
        status: str,
        statistics: Optional[Dict[str, Any]] = None
    ) -> None:
        """更新服务状态

        Args:
            name: 服务名称
            status: 新状态
            statistics: 统计信息
        """
        if statistics:
            await self._db.execute(
                """
                UPDATE service_registry SET
                    status = ?, statistics = ?, updated_at = ?
                WHERE name = ?
                """,
                (status, json.dumps(statistics), time.time(), name)
            )
        else:
            await self._db.execute(
                """
                UPDATE service_registry SET
                    status = ?, updated_at = ?
                WHERE name = ?
                """,
                (status, time.time(), name)
            )

        await self._db.commit()

    async def _save_config_version(
        self,
        entity_type: str,
        entity_id: str,
        config: Dict[str, Any],
        change_type: str,
        changed_by: Optional[str],
        changed_at: float,
        old_config: Optional[Dict[str, Any]] = None
    ) -> None:
        """保存配置版本"""
        config_json = json.dumps(config, sort_keys=True)
        config_hash = self._compute_hash(config_json)

        async with self._db.execute(
            """
            SELECT MAX(version) FROM config_versions
            WHERE entity_type = ? AND entity_id = ?
            """,
            (entity_type, entity_id)
        ) as cursor:
            row = await cursor.fetchone()
            max_version = row[0] if row and row[0] else 0

        version = max_version + 1
        previous_version = max_version if max_version > 0 else None

        await self._db.execute(
            """
            INSERT INTO config_versions (
                entity_type, entity_id, version, config, config_hash,
                change_type, changed_by, changed_at, previous_version
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                entity_type, entity_id, version, config_json, config_hash,
                change_type, changed_by, changed_at, previous_version
            )
        )

    def _compute_hash(self, content: str) -> str:
        """计算配置哈希值"""
        return hashlib.md5(content.encode()).hexdigest()

    async def commit(self) -> None:
        """提交当前事务"""
        await self._db.commit()