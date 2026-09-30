"""Data API routes"""

from typing import Optional
from fastapi import APIRouter, Depends, Query

from ..dependencies import get_storage
from ...storage import StorageInterface

router = APIRouter(tags=["Data"])


@router.get("/api/data/readings")
async def get_readings(
    asset: Optional[str] = Query(None),
    start_time: Optional[float] = Query(None),
    end_time: Optional[float] = Query(None),
    limit: int = Query(default=100, le=1000),
    active_only: bool = Query(default=True),
    storage: StorageInterface = Depends(get_storage)
):
    readings = await storage.query(
        asset=asset,
        start_time=start_time,
        end_time=end_time,
        limit=limit,
        active_only=active_only
    )
    return {"count": len(readings), "readings": [r.to_dict() for r in readings]}


@router.get("/api/data/trend")
async def get_point_trend(
    asset: str = Query(...),
    point: str = Query(...),
    start_time: Optional[float] = Query(None),
    end_time: Optional[float] = Query(None),
    limit: int = Query(default=1000, ge=1, le=5000),
    storage: StorageInterface = Depends(get_storage)
):
    """单点位历史趋势查询：服务端过滤，只返回 {timestamp, value, quality}

    timestamp 为 Unix 秒级时间戳，按时间倒序返回。
    """
    points = await storage.query_point_trend(
        asset=asset,
        point_name=point,
        start_time=start_time,
        end_time=end_time,
        limit=limit
    )
    return {"count": len(points), "points": points}


@router.delete("/api/data/readings")
async def delete_readings(
    before_timestamp: float = Query(...),
    storage: StorageInterface = Depends(get_storage)
):
    deleted = await storage.delete_old_readings(before_timestamp)
    return {"success": True, "deleted": deleted}
