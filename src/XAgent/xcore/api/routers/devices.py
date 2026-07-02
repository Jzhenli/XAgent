import logging
from fastapi import APIRouter, HTTPException, Depends, Query, status
from typing import List, Optional

from ..models.device import (
    DeviceConfig,
    PointConfig,
    DeviceStatus,
    DeviceCreateResponse,
    DeviceUpdateResponse,
    PointCreateResponse,
    DeviceListResponse,
    BatchOperationResult,
    DeviceReloadResponse,
    BatchDeviceReloadResponse,
    DiscoverPointsRequest,
    DiscoverPointsResponse,
    DiscoveredPoint,
    BatchAddPointsRequest,
    BatchAddPointsResponse,
    # 设备发现相关模型
    DiscoverDevicesRequest,
    DiscoverDevicesResponse,
    DiscoveredDeviceResponse,
    BatchAddDevicesRequest,
    BatchAddDevicesResponse,
    NetworkInterfaceResponse  # 新增：网卡信息响应模型
)
from ..services.device_service_db import DeviceService
from ..dependencies import get_app_state
from .config import verify_api_token

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/devices", tags=["Devices"])


def handle_value_error(e: ValueError) -> HTTPException:
    """统一处理 ValueError，返回合适的 HTTP 状态码
    
    Args:
        e: ValueError 异常
        
    Returns:
        HTTPException: 合适的 HTTP 异常
    """
    error_msg = str(e)
    
    if "not found" in error_msg:
        return HTTPException(status_code=404, detail=error_msg)
    elif "already exists" in error_msg:
        return HTTPException(status_code=409, detail=error_msg)
    elif "invalid" in error_msg or "cannot" in error_msg:
        return HTTPException(status_code=400, detail=error_msg)
    else:
        return HTTPException(status_code=400, detail=error_msg)


def get_device_service(state = Depends(get_app_state)):
    """获取设备服务实例"""
    if not state.gateway:
        raise HTTPException(
            status_code=500,
            detail="Gateway not initialized"
        )
    
    return DeviceService(
        metadata_manager=state.metadata_manager,
        plugin_loader=state.gateway.plugin_loader
    )


@router.post(
    "/", 
    response_model=DeviceCreateResponse, 
    status_code=status.HTTP_201_CREATED
)
async def create_device(
    device: DeviceConfig,
    service: DeviceService = Depends(get_device_service),
    token: str = Depends(verify_api_token)
):
    """创建新设备
    
    创建设备时会：
    1. 验证插件是否可用
    2. 创建设备配置文件
    3. 同步到数据库
    4. 加载插件实例
    
    Args:
        device: 设备配置
        
    Returns:
        创建的设备信息
        
    Raises:
        HTTPException: 400 - 设备已存在或插件不可用
        HTTPException: 500 - 内部服务器错误
    """
    try:
        created_device = await service.create_device(device)
        
        return DeviceCreateResponse(
            success=True,
            message=f"Device '{device.asset}' created successfully",
            asset=device.asset,
            plugin_id=f"{device.plugin.name}_{device.asset}",
            requires_reload=False
        )
    except ValueError as e:
        logger.error(f"Failed to create device: {e}")
        raise handle_value_error(e)
    except Exception as e:
        logger.error(f"Unexpected error creating device: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/", response_model=DeviceListResponse)
async def list_devices(
    status: Optional[DeviceStatus] = Query(None, description="Filter by status"),
    plugin_name: Optional[str] = Query(None, description="Filter by plugin name"),
    tags: Optional[List[str]] = Query(None, description="Filter by tags"),
    enabled: Optional[bool] = Query(None, description="Filter by enabled status"),
    service: DeviceService = Depends(get_device_service)
):
    """列出所有设备
    
    支持按状态、插件名称、标签、启用状态过滤
    
    Args:
        status: 设备状态过滤
        plugin_name: 插件名称过滤
        tags: 标签过滤
        enabled: 启用状态过滤
        
    Returns:
        设备列表
    """
    devices = await service.list_devices(
        status=status,
        plugin_name=plugin_name,
        tags=tags,
        enabled=enabled
    )
    
    return DeviceListResponse(
        count=len(devices),
        devices=devices
    )


@router.get("/latest")
async def get_devices_latest(
    active_only: bool = Query(default=True),
    state = Depends(get_app_state)
):
    """获取所有设备的最新数据
    
    Args:
        active_only: 是否只返回活跃设备的数据
        
    Returns:
        设备最新数据列表
    """
    from ...storage import StorageInterface
    
    storage = state.gateway.storage if state.gateway else None
    if not storage:
        from ..dependencies import get_storage
        storage = await get_storage()
    
    readings = await storage.get_latest_readings_by_device(active_only=active_only)
    return {"count": len(readings), "devices": [r.to_dict() for r in readings]}


@router.get("/connection-status")
async def get_devices_connection_status(
    service: DeviceService = Depends(get_device_service)
):
    """获取所有设备的运行时连接状态
    
    连接状态反映设备是否真正连接成功，与配置状态（active/inactive）不同。
    
    Returns:
        设备连接状态映射 {"asset": "online"|"offline", ...}
    """
    return service.get_devices_connection_status()


# ========== 固定路径路由（必须在/{asset}之前定义）==========

@router.get("/network-interfaces", response_model=List[NetworkInterfaceResponse])
async def get_network_interfaces(
    state = Depends(get_app_state),
    token: str = Depends(verify_api_token)
):
    """获取可用的网络接口列表

    用于多网卡环境下选择合适的网卡进行设备发现。
    使用psutil库获取网卡信息，只返回IPv4网卡，并按优先级排序（有线>无线>其他）。

    Returns:
        网络接口列表（包含IP地址、网络前缀、广播地址、优先级等信息）

    Raises:
        HTTPException: 500 - psutil库未安装或获取失败
    """
    try:
        # 导入设备发现服务（从 xcore/services 导入，向上两级）
        from ...services.device_auto_discovery_service import DeviceAutoDiscoveryService

        # 创建发现服务实例
        discovery_service = DeviceAutoDiscoveryService(state.gateway.plugin_loader)

        # 获取网络接口列表（异步调用）
        interfaces = await discovery_service.get_network_interfaces()

        # 转换为响应模型
        interface_responses = [
            NetworkInterfaceResponse(
                name=interface.name,
                ip_address=interface.ip_address,
                network_prefix=interface.network_prefix,
                network_address=interface.network_address,
                broadcast_address=interface.broadcast_address,
                description=interface.description,
                priority=interface.priority  # 添加优先级字段
            )
            for interface in interfaces
        ]
        
        return interface_responses
        
    except RuntimeError as e:
        logger.error(f"Failed to get network interfaces: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Unexpected error getting network interfaces: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error: {str(e)}"
        )


@router.get("/{asset}", response_model=DeviceConfig)
async def get_device(
    asset: str,
    service: DeviceService = Depends(get_device_service)
):
    """获取设备详情
    
    Args:
        asset: 设备资产标识
        
    Returns:
        设备配置
        
    Raises:
        HTTPException: 404 - 设备不存在
    """
    device = await service.get_device(asset)
    if not device:
        raise HTTPException(
            status_code=404,
            detail=f"Device '{asset}' not found"
        )
    return device


@router.put("/{asset}", response_model=DeviceUpdateResponse)
async def update_device(
    asset: str,
    updates: dict,
    service: DeviceService = Depends(get_device_service),
    token: str = Depends(verify_api_token)
):
    """更新设备配置
    
    支持部分更新，只需提供要修改的字段
    
    Args:
        asset: 设备资产标识
        updates: 更新内容
        
    Returns:
        更新结果
        
    Raises:
        HTTPException: 404 - 设备不存在
        HTTPException: 400 - 更新内容无效
    """
    try:
        updated_device = await service.update_device(asset, updates)
        
        updated_fields = list(updates.keys())
        
        return DeviceUpdateResponse(
            success=True,
            message=f"Device '{asset}' updated successfully",
            asset=asset,
            updated_fields=updated_fields
        )
    except ValueError as e:
        error_msg = str(e)
        if "not found" in error_msg:
            raise HTTPException(status_code=404, detail=error_msg)
        elif "already exists" in error_msg or "invalid" in error_msg:
            raise HTTPException(status_code=400, detail=error_msg)
        else:
            raise HTTPException(status_code=400, detail=error_msg)
    except Exception as e:
        logger.error(f"Error updating device {asset}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")


@router.delete("/{asset}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_device(
    asset: str,
    service: DeviceService = Depends(get_device_service),
    token: str = Depends(verify_api_token)
):
    """删除设备
    
    删除设备会：
    1. 停止插件实例
    2. 删除配置文件
    3. 从数据库软删除
    
    Args:
        asset: 设备资产标识
        
    Raises:
        HTTPException: 404 - 设备不存在
    """
    try:
        await service.delete_device(asset)
    except ValueError as e:
        raise handle_value_error(e)
    except Exception as e:
        logger.error(f"Error deleting device {asset}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post(
    "/{asset}/points", 
    response_model=PointCreateResponse,
    status_code=status.HTTP_201_CREATED
)
async def add_point_to_device(
    asset: str,
    point: PointConfig,
    service: DeviceService = Depends(get_device_service),
    token: str = Depends(verify_api_token)
):
    """向设备添加点位
    
    Args:
        asset: 设备资产标识
        point: 点位配置
        
    Returns:
        添加结果
        
    Raises:
        HTTPException: 404 - 设备不存在
        HTTPException: 400 - 点位已存在
    """
    try:
        await service.add_point(asset, point)
        
        return PointCreateResponse(
            success=True,
            message=f"Point '{point.name}' added to device '{asset}'",
            asset=asset,
            point_name=point.name,
            requires_reload=False
        )
    except ValueError as e:
        if "not found" in str(e):
            raise handle_value_error(e)
        else:
            raise handle_value_error(e)
    except Exception as e:
        logger.error(f"Error adding point to device {asset}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")


@router.get("/{asset}/points", response_model=List[PointConfig])
async def list_device_points(
    asset: str,
    service: DeviceService = Depends(get_device_service)
):
    """列出设备的所有点位
    
    Args:
        asset: 设备资产标识
        
    Returns:
        点位列表
        
    Raises:
        HTTPException: 404 - 设备不存在
    """
    device = await service.get_device(asset)
    if not device:
        raise HTTPException(
            status_code=404,
            detail=f"Device '{asset}' not found"
        )
    return device.points


@router.delete(
    "/{asset}/points/{point_name}",
    status_code=status.HTTP_204_NO_CONTENT
)
async def remove_point_from_device(
    asset: str,
    point_name: str,
    service: DeviceService = Depends(get_device_service),
    token: str = Depends(verify_api_token)
):
    """从设备移除点位
    
    Args:
        asset: 设备资产标识
        point_name: 点位名称
        
    Raises:
        HTTPException: 404 - 设备或点位不存在
    """
    try:
        await service.delete_point(asset, point_name)
    except ValueError as e:
        raise handle_value_error(e)
    except Exception as e:
        logger.error(f"Error removing point {point_name} from device {asset}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")


@router.put("/{asset}/points/{point_name}", response_model=PointCreateResponse)
async def update_point(
    asset: str,
    point_name: str,
    updates: dict,
    service: DeviceService = Depends(get_device_service),
    token: str = Depends(verify_api_token)
):
    """更新点位配置
    
    Args:
        asset: 设备资产标识
        point_name: 点位名称
        updates: 更新内容
        
    Returns:
        更新结果
        
    Raises:
        HTTPException: 404 - 设备或点位不存在
    """
    try:
        await service.update_point(asset, point_name, updates)
        
        return PointCreateResponse(
            success=True,
            message=f"Point '{point_name}' updated in device '{asset}'",
            asset=asset,
            point_name=point_name,
            requires_reload=False
        )
    except ValueError as e:
        raise handle_value_error(e)
    except Exception as e:
        logger.error(f"Error updating point {point_name} in device {asset}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/batch", response_model=BatchOperationResult)
async def batch_create_devices(
    devices: List[DeviceConfig],
    service: DeviceService = Depends(get_device_service),
    token: str = Depends(verify_api_token)
):
    """批量创建设备
    
    Args:
        devices: 设备列表
        
    Returns:
        批量操作结果
    """
    result = await service.batch_create_devices(devices)
    
    return BatchOperationResult(
        total=result['total'],
        succeeded=result['succeeded'],
        failed=result['failed'],
        details=result['details']
    )


@router.post("/reload", response_model=BatchDeviceReloadResponse)
async def reload_devices(
    assets: Optional[List[str]] = None,
    service: DeviceService = Depends(get_device_service),
    token: str = Depends(verify_api_token)
):
    """Reload device plugins (hot reload)
    
    This endpoint reloads device plugins without restarting the application.
    Use this when device point configurations have changed.
    
    Args:
        assets: List of device asset names to reload. If None, reloads all enabled devices.
        
    Returns:
        Reload results for each device
    """
    try:
        result = await service.reload_devices(assets)
        
        return BatchDeviceReloadResponse(
            success=True,
            message=f"Reloaded {result['succeeded']}/{result['total']} devices successfully",
            **result
        )
    except Exception as e:
        logger.error(f"Failed to reload devices: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to reload devices: {str(e)}"
        )


@router.post("/{asset}/reload", response_model=DeviceReloadResponse)
async def reload_device(
    asset: str,
    service: DeviceService = Depends(get_device_service),
    token: str = Depends(verify_api_token)
):
    """Reload a single device plugin (hot reload)
    
    This endpoint reloads a specific device plugin without restarting the application.
    Use this when a device's point configuration has changed.
    
    Args:
        asset: Device asset name
        
    Returns:
        Reload result
    """
    try:
        await service.reload_device(asset)
        
        logger.info(f"Device {asset} reloaded successfully")
        
        return DeviceReloadResponse(
            success=True,
            message=f"Device '{asset}' reloaded successfully",
            asset=asset,
            reload_status="success"
        )
    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Failed to reload device {asset}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to reload device {asset}: {str(e)}"
        )


@router.post("/export")
async def export_devices(
    assets: Optional[List[str]] = None,
    service: DeviceService = Depends(get_device_service),
    token: str = Depends(verify_api_token)
):
    """导出设备配置
    
    Args:
        assets: 要导出的设备列表，None 表示导出所有
        
    Returns:
        导出的设备配置
    """
    return await service.export_devices(assets)


@router.post("/import", response_model=BatchOperationResult)
async def import_devices(
    data: dict,
    overwrite: bool = False,
    service: DeviceService = Depends(get_device_service),
    token: str = Depends(verify_api_token)
):
    """导入设备配置
    
    Args:
        data: 导入的设备配置
        overwrite: 是否覆盖已存在的设备
        
    Returns:
        导入结果
    """
    result = await service.import_devices(data, overwrite)
    
    return BatchOperationResult(
        total=result['total'],
        succeeded=result['succeeded'],
        failed=result['failed'],
        details=result['details']
    )


# ========== 设备发现API ==========

@router.post("/discover/bacnet", response_model=DiscoverDevicesResponse)
async def discover_bacnet_devices(
    request: DiscoverDevicesRequest,
    state = Depends(get_app_state),
    token: str = Depends(verify_api_token)
):
    """发现网络中的BACnet设备
    
    通过发送Who-Is广播，自动发现网络中的BACnet设备。
    设备收到广播后会返回I-Am响应，包含设备ID、地址等信息。
    
    Args:
        request: 发现请求参数
            - network_range: 网络范围（可选）
            - device_id_range: 设备ID范围（可选）
            - timeout: 发现超时时间（秒）
            
    Returns:
        发现的设备列表
        
    Raises:
        HTTPException: 400 - 参数错误
        HTTPException: 500 - bacpypes3未安装或发现失败
        HTTPException: 504 - 发现超时（无设备响应）
    """
    try:
        # 导入设备发现服务（从 xcore/services 导入，向上两级）
        from ...services.device_auto_discovery_service import DeviceAutoDiscoveryService
        
        # 创建发现服务实例
        discovery_service = DeviceAutoDiscoveryService(state.gateway.plugin_loader)
        
        # 转换device_id_range为tuple
        device_id_range = None
        if request.device_id_range:
            device_id_range = tuple(request.device_id_range)
        
        # 执行设备发现
        discovered_devices = await discovery_service.discover_devices(
            network_range=request.network_range,
            device_id_range=device_id_range,
            timeout=request.timeout,
            interface_ip=request.interface_ip
        )
        
        # 转换为响应模型
        devices = [
            DiscoveredDeviceResponse(
                device_id=device.device_id,
                address=device.address,
                port=device.port,
                device_name=device.device_name,
                vendor_name=device.vendor_name,
                model_name=device.model_name,
                object_count=device.object_count
            )
            for device in discovered_devices
        ]
        
        return DiscoverDevicesResponse(
            success=True,
            devices=devices,
            total=len(devices)
        )
        
    except ValueError as e:
        # 参数错误
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        # bacpypes3未安装或发现失败
        error_msg = str(e)
        if "bacpypes3" in error_msg:
            raise HTTPException(status_code=500, detail=error_msg)
        else:
            raise HTTPException(status_code=504, detail=error_msg)
    except Exception as e:
        logger.error(f"Device discovery failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=504,
            detail=f"Device discovery failed or timeout: {str(e)}"
        )


# ========== 点位发现和批量添加API ==========

@router.post("/{asset}/discover-points", response_model=DiscoverPointsResponse)
async def discover_device_points(
    asset: str,
    request: DiscoverPointsRequest,
    state = Depends(get_app_state),
    token: str = Depends(verify_api_token)
):
    """发现设备中的点位
    
    自动发现BACnet设备中的对象（点位），支持：
    - 按对象类型过滤（可选）
    - 自动读取对象属性（objectName, description等）
    - 自动判断可写性
    - 数据类型映射
    
    Args:
        asset: 设备资产标识
        request: 发现请求参数
        
    Returns:
        发现的点位列表
        
    Raises:
        HTTPException: 404 - 设备不存在
        HTTPException: 500 - 设备未连接或发现失败
        HTTPException: 504 - 发现超时
    """
    try:
        # 检查设备是否存在
        device_service = get_device_service(state)
        device = await device_service.get_device(asset)
        if not device:
            raise HTTPException(
                status_code=404,
                detail=f"Device '{asset}' not found"
            )
        
        # 检查插件是否为BACnet
        if device.plugin.name != "bacnet":
            raise HTTPException(
                status_code=400,
                detail=f"Device '{asset}' is not a BACnet device"
            )
        
        # 导入发现服务（从 xcore/services 导入，向上两级）
        from ...services.device_discovery_service import DeviceDiscoveryService
        
        # 创建发现服务实例
        discovery_service = DeviceDiscoveryService(state.gateway.plugin_loader)
        
        # 执行点位发现
        result = await discovery_service.discover_points(
            device_asset=asset,
            object_types=request.object_types
        )
        
        # 转换为响应模型
        points = [
            DiscoveredPoint(**point)
            for point in result['points']
        ]
        
        return DiscoverPointsResponse(
            success=result['success'],
            points=points,
            total=result['total']
        )
        
    except ValueError as e:
        error_msg = str(e)
        if "not found" in error_msg:
            raise HTTPException(status_code=404, detail=error_msg)
        elif "not connected" in error_msg:
            raise HTTPException(status_code=500, detail=error_msg)
        else:
            raise HTTPException(status_code=400, detail=error_msg)
    except RuntimeError as e:
        # bacpypes3未安装
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"Failed to discover points for device '{asset}': {e}", exc_info=True)
        raise HTTPException(
            status_code=504,
            detail=f"Point discovery failed or timeout: {str(e)}"
        )


@router.post("/{asset}/points/batch", response_model=BatchAddPointsResponse)
async def batch_add_points_to_device(
    asset: str,
    request: BatchAddPointsRequest,
    service: DeviceService = Depends(get_device_service),
    token: str = Depends(verify_api_token)
):
    """批量添加点位到设备
    
    批量添加多个点位，支持：
    - 自动验证点位配置
    - 批量添加，提高效率
    - 详细的成功/失败统计
    
    Args:
        asset: 设备资产标识
        request: 批量添加请求
        
    Returns:
        批量添加结果
        
    Raises:
        HTTPException: 404 - 设备不存在
        HTTPException: 500 - 批量添加失败
    """
    try:
        # 执行批量添加
        result = await service.batch_add_points(asset, request.points)
        
        return BatchAddPointsResponse(
            success=True,
            message=f"Batch added {result['succeeded']}/{result['total']} points to device '{asset}'",
            asset=asset,
            total=result['total'],
            succeeded=result['succeeded'],
            failed=result['failed'],
            details=result['details']
        )
        
    except ValueError as e:
        error_msg = str(e)
        if "not found" in error_msg:
            raise HTTPException(status_code=404, detail=error_msg)
        else:
            raise HTTPException(status_code=400, detail=error_msg)
    except Exception as e:
        logger.error(f"Failed to batch add points to device '{asset}': {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Batch add points failed: {str(e)}"
        )
