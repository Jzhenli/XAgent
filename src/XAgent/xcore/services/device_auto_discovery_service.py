"""设备自动发现服务

负责发送BACnet Who-Is广播，收集设备I-Am响应，
自动发现网络中的BACnet设备。

两层架构设计：
1. 设备轮询层（plugin.py）：使用共享实例，端口 47809
2. 设备发现层（本服务）：使用临时实例，端口 47808（标准端口）

使用 bacpypes3 的正确API：
- NormalApplication（IPv4应用）
- who_is() 方法发送广播并等待响应
- I-Am响应自动收集在返回的Future中

设备发现使用标准端口 47808 的原因：
- BACnet 标准端口，最大兼容性
- 某些保守的 BACnet 设备可能只接受来自标准端口的广播
- 临时创建，发现完成后立即关闭，不占用资源

支持多网卡环境：
- 使用psutil库获取网卡信息（更稳定可靠）
- 可以指定网卡IP地址
- 可以自动列出可用网卡
- 只获取IPv4网卡，过滤IPv6等
- 按优先级排序（有线>无线>其他）
"""

import asyncio
import logging
import ipaddress
import socket
import psutil
import re
from typing import List, Optional, Tuple, Any
from dataclasses import dataclass

logger = logging.getLogger(__name__)


@dataclass
class DiscoveredDevice:
    """发现的设备信息"""
    device_id: int
    address: str
    port: int
    device_name: Optional[str] = None
    vendor_name: Optional[str] = None
    model_name: Optional[str] = None
    object_count: Optional[int] = None


@dataclass
class NetworkInterface:
    """网卡信息"""
    name: str
    ip_address: str
    network_prefix: int
    network_address: str
    broadcast_address: str
    description: str = ""
    priority: int = 0  # 优先级（数值越小优先级越高）


class DeviceAutoDiscoveryService:
    """设备自动发现服务
    
    通过发送BACnet Who-Is广播，自动发现网络中的BACnet设备。
    使用 bacpypes3.ipv4.app.NormalApplication 和 who_is() 方法。
    
    支持多网卡环境，可以指定使用哪个网卡发送广播。
    """

    def __init__(self, plugin_loader: Any = None):
        """初始化服务

        Args:
            plugin_loader: 插件加载器（用于获取BACnet插件实例）
        """
        self.plugin_loader = plugin_loader

    def _parse_device_address(self, source_address: str) -> Tuple[str, int]:
        """解析设备地址和端口

        bacpypes3 的 pduSource 通常是 "IP:Port" 格式，
        也可能是纯 IP 或 Address(...) 对象字符串。
        """
        DEFAULT_PORT = 47808

        # 尝试 "IP:Port" 格式
        if ':' in source_address:
            parts = source_address.rsplit(':', 1)
            try:
                port = int(parts[1])
                ipaddress.ip_address(parts[0])  # 验证 IP 合法性
                return parts[0], port
            except ValueError:
                pass  # 非标准格式，按无端口处理

        # 从任意格式中提取 IPv4 地址（兼容 Address('...') 等）
        match = re.search(r'(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})', source_address)
        if match:
            return match.group(1), DEFAULT_PORT

        raise ValueError(f"Cannot parse address format: {source_address}")
    
    def _calculate_network_prefix(self, netmask: str) -> int:
        """从子网掩码计算网络前缀
        
        Args:
            netmask: 子网掩码（如"255.255.255.0"）
            
        Returns:
            网络前缀（如24）
        """
        try:
            network = ipaddress.IPv4Network(f"0.0.0.0/{netmask}", strict=False)
            return network.prefixlen
        except Exception as e:
            logger.warning(f"Failed to calculate network prefix from netmask {netmask}: {e}")
            return 24  # 默认返回24
    
    def _get_interface_priority(self, interface_name: str, description: str) -> int:
        """计算网卡优先级
        
        优先级规则：
        - 以太网（有线）：优先级 1（最高）
        - Wi-Fi（无线）：优先级 2
        - 其他：优先级 3（最低）
        
        Args:
            interface_name: 卡名称
            description: 网卡描述
            
        Returns:
            优先级数值（越小越优先）
        """
        # 网卡名称或描述中的关键词
        name_lower = interface_name.lower()
        desc_lower = description.lower()
        
        # 有线网卡关键词
        ethernet_keywords = ['ethernet', '以太', '有线', 'eth', 'en', 'lan', 'local area']
        
        # 无线网卡关键词
        wifi_keywords = ['wi-fi', 'wifi', '无线', 'wireless', 'wl', 'wlan']
        
        # 检查是否为有线网卡
        # 修正：正确的any()逻辑 - 检查关键词是否在名称或描述中
        if any(keyword in name_lower for keyword in ethernet_keywords) or \
           any(keyword in desc_lower for keyword in ethernet_keywords):
            return 1  # 最高优先级
        
        # 检查是否为无线网卡
        if any(keyword in name_lower for keyword in wifi_keywords) or \
           any(keyword in desc_lower for keyword in wifi_keywords):
            return 2  # 中等优先级
        
        # 其他网卡
        return 3  # 低优先级
    
    async def get_network_interfaces(self) -> List[NetworkInterface]:
        """获取所有可用的IPv4网络接口
        
        使用psutil库获取网卡信息，过滤IPv6等非IPv4地址，
        并按优先级排序（有线>无线>其他）。
        
        Returns:
            网络接口列表（已按优先级排序）
            
        Raises:
            RuntimeError: psutil库未安装或获取失败
        """
        try:
            # 使用psutil获取网卡地址信息
            net_if_addrs = psutil.net_if_addrs()
            net_if_stats = psutil.net_if_stats()
            
            interfaces = []
            
            for interface_name, addr_list in net_if_addrs.items():
                # 检查网卡是否启用
                if interface_name not in net_if_stats:
                    continue
                
                stats = net_if_stats[interface_name]
                if not stats.isup:  # 网卡未启用，跳过
                    continue
                
                # 遍历地址列表，只获取IPv4地址
                for addr in addr_list:
                    # 只处理IPv4地址（family == socket.AF_INET）
                    if addr.family != socket.AF_INET:
                        continue
                    
                    # IPv4地址信息
                    ip_address = addr.address
                    
                    # 过滤掉无效地址
                    # 1. 127.0.0.0/8 - 回环地址（本地回环，无法发送网络广播）
                    # 2. 169.254.0.0/16 - APIPA地址（自动私有IP，说明网卡未正确连接）
                    try:
                        ip_obj = ipaddress.IPv4Address(ip_address)
                        if ip_obj.is_loopback:
                            logger.debug(f"Skipping loopback address: {ip_address}")
                            continue
                        if ip_obj in ipaddress.IPv4Network('169.254.0.0/16'):
                            logger.debug(f"Skipping APIPA address: {ip_address} (interface not properly connected)")
                            continue
                    except Exception as e:
                        logger.warning(f"Invalid IP address format: {ip_address}, error: {e}")
                        continue
                    
                    netmask = addr.netmask
                    broadcast = addr.broadcast if addr.broadcast else ""
                    
                    # 计算网络前缀
                    network_prefix = self._calculate_network_prefix(netmask)
                    
                    # 计算网络地址
                    try:
                        network = ipaddress.IPv4Network(
                            f"{ip_address}/{network_prefix}",
                            strict=False
                        )
                        network_address = str(network.network_address)
                        broadcast_address = broadcast or str(network.broadcast_address)
                    except Exception as e:
                        logger.warning(f"Failed to calculate network for {ip_address}: {e}")
                        continue
                    
                    # 计算优先级
                    priority = self._get_interface_priority(interface_name, interface_name)
                    
                    interface = NetworkInterface(
                        name=interface_name,
                        ip_address=ip_address,
                        network_prefix=network_prefix,
                        network_address=network_address,
                        broadcast_address=broadcast_address,
                        description=interface_name,
                        priority=priority
                    )
                    
                    interfaces.append(interface)
                    
                    logger.debug(
                        f"Found IPv4 network interface: {interface_name} "
                        f"{ip_address}/{network_prefix} (priority: {priority})"
                    )
            
            # 按优先级排序（数值越小优先级越高）
            interfaces.sort(key=lambda x: x.priority)
            
            logger.info(
                f"Found {len(interfaces)} IPv4 network interfaces "
                f"(sorted by priority: wired > wireless > others)"
            )
            
            return interfaces
            
        except ImportError:
            logger.error("psutil library not installed")
            raise RuntimeError("psutil library not installed. psutil is usually pre-installed.")
        except Exception as e:
            logger.error(f"Failed to get network interfaces: {e}", exc_info=True)
            raise RuntimeError(f"Failed to get network interfaces: {str(e)}")
    
    async def _read_device_property(
        self,
        app,
        device_address: str,
        object_identifier: str,
        property_name: str,
        timeout: float = 3.0
    ) -> Optional[str]:
        """读取设备属性（用于发现后的详情 enrichment）

        Args:
            app: NormalApplication 实例
            device_address: 设备地址（如 "192.168.1.100:47808"）
            object_identifier: 对象标识符（如 "device,100"）
            property_name: 属性名（如 "objectName"）
            timeout: 单次读取超时（秒）

        Returns:
            属性值字符串，失败返回 None
        """
        from bacpypes3.apdu import ErrorRejectAbortNack
        try:
            response = await asyncio.wait_for(
                app.read_property(device_address, object_identifier, property_name),
                timeout=timeout
            )
            if isinstance(response, ErrorRejectAbortNack):
                return None
            if hasattr(response, 'value'):
                return str(response.value)
            return str(response) if response is not None else None
        except asyncio.TimeoutError:
            logger.debug(f"Timeout reading {property_name} from {device_address}")
            return None
        except Exception as e:
            logger.debug(f"Failed to read {property_name} from {device_address}: {e}")
            return None

    async def discover_devices(
        self,
        network_range: Optional[str] = None,
        device_id_range: Optional[Tuple[int, int]] = None,
        timeout: float = 5.0,
        interface_ip: Optional[str] = None
    ) -> List[DiscoveredDevice]:
        """发现网络中的BACnet设备
        
        Args:
            network_range: 网络范围（如"192.168.1.0/24"），可选
                - 用于验证发现的设备是否在指定网络内
                - 如果提供，只返回该网络内的设备
            device_id_range: 设备ID范围（如[0, 1000]），可选
            timeout: 发现超时时间（秒），必须大于0
            interface_ip: 指定网卡IP地址（如"192.168.10.9"），可选
                - 如果不指定，自动选择优先级最高的网卡
                - 多网卡环境下建议指定
            
        Returns:
            发现的设备列表
            
        Raises:
            ValueError: 参数错误
            RuntimeError: bacpypes3未安装或发现失败
        """
        # 参数验证
        if timeout <= 0:
            raise ValueError("timeout must be greater than 0")
        
        if timeout > 30:
            logger.warning(f"timeout {timeout}s is too long, recommended max 30s")
        
        # 验证网络范围格式（如果提供）
        target_network = None
        if network_range:
            try:
                target_network = ipaddress.ip_network(network_range, strict=False)
                logger.info(f"Filtering devices in network: {target_network}")
            except ValueError as e:
                raise ValueError(f"Invalid network_range format: {str(e)}")
        
        # 验证网卡IP（如果提供）
        if interface_ip:
            try:
                ipaddress.ip_address(interface_ip)
                logger.info(f"Using specified interface: {interface_ip}")
            except ValueError as e:
                raise ValueError(f"Invalid interface_ip format: {str(e)}")
        else:
            # 未指定网卡，自动选择优先级最高的网卡
            interfaces = await self.get_network_interfaces()
            if interfaces:
                interface_ip = interfaces[0].ip_address
                logger.info(
                    f"Auto-selected highest priority interface: "
                    f"{interfaces[0].name} ({interface_ip})"
                )
        
        logger.info(
            f"Starting BACnet device discovery - "
            f"interface: {interface_ip or 'auto'}, "
            f"network_filter: {network_range or 'all'}, "
            f"device_id_range: {device_id_range or 'all'}, "
            f"timeout: {timeout}s"
        )
        
        # 初始化变量，确保finally块中可以访问
        app = None
        local_address = None

        try:
            # 导入bacpypes3库的正确模块
            from bacpypes3.ipv4.app import NormalApplication
            from bacpypes3.object import DeviceObject
            from bacpypes3.pdu import IPv4Address

            # 创建IPv4地址（根据是否指定网卡）
            # 设备发现层使用标准端口 47808（与轮询层 47809 隔离，避免冲突）
            if interface_ip:
                # 使用指定的网卡IP
                # 尝试获取网络前缀
                try:
                    interfaces = await self.get_network_interfaces()
                    matching_interface = None

                    for interface in interfaces:
                        if interface.ip_address == interface_ip:
                            matching_interface = interface
                            break

                    if matching_interface:
                        # 使用完整的网络配置（IP/前缀:标准端口47808）
                        local_address = IPv4Address(
                            f"{interface_ip}/{matching_interface.network_prefix}:47808"
                        )
                        logger.info(
                            f"Using interface {interface_ip}/{matching_interface.network_prefix} "
                            f"with broadcast {matching_interface.broadcast_address} (port 47808)"
                        )
                    else:
                        # 找不到匹配的网卡，使用默认/24
                        logger.warning(
                            f"Interface {interface_ip} not found in network interfaces, "
                            f"using default /24 network prefix"
                        )
                        local_address = IPv4Address(f"{interface_ip}/24:47808")

                except Exception as e:
                    logger.warning(f"Failed to get network prefix for {interface_ip}: {e}")
                    # 降级方案：使用默认/24
                    local_address = IPv4Address(f"{interface_ip}/24:47808")
            else:
                # 自动选择默认网卡（使用"host"关键字）
                # 使用 BACnet 标准端口 47808
                local_address = IPv4Address("host:47808")
                logger.info("Using auto-selected default interface (host) with standard port 47808 (for device discovery)")

            # 临时创建 Application 实例（设备发现专用）
            # 临时实例，发现完成后立即关闭
            # 使用标准端口 47808，确保最大兼容性
            device_object = DeviceObject(
                objectName="XAgent Discovery Client",
                objectIdentifier=("device", 0),  # 设备ID为0，表示发现客户端
            )
            
            # 创建临时的 BACnet/IP 应用实例（使用端口 47808）
            app = NormalApplication(device_object, local_address)
            
            logger.info(
                f"Created temporary BACnet Application for discovery "
                f"on standard port 47808 (address: {local_address})"
            )

            logger.info("BACnet discovery client ready, sending Who-Is broadcast...")

            # 发送Who-Is广播，等待I-Am响应
            # bacpypes3的who_is()方法会自动收集I-Am响应
            low_limit = device_id_range[0] if device_id_range else None
            high_limit = device_id_range[1] if device_id_range else None

            # 调用who_is()方法，返回Future[List[IAmRequest]]
            # timeout参数是float类型（秒）
            i_ams = await app.who_is(
                low_limit=low_limit,
                high_limit=high_limit,
                timeout=timeout
            )

            logger.info(f"Received {len(i_ams)} I-Am responses")

            # 处理I-Am响应，提取设备信息
            discovered_devices = []
            for i_am in i_ams:
                try:
                    device_id = i_am.iAmDeviceIdentifier[1]  # 提取设备实例ID

                    # 提取地址和端口（更健壮的解析）
                    source_address = str(i_am.pduSource)
                    address, port = self._parse_device_address(source_address)

                    # 过滤：只返回指定网络内的设备
                    if target_network:
                        try:
                            device_ip = ipaddress.ip_address(address)
                            if device_ip not in target_network:
                                logger.debug(
                                    f"Device {device_id} at {address} not in target network "
                                    f"{target_network}, skipping"
                                )
                                continue
                        except ValueError:
                            logger.warning(f"Invalid device address: {address}")
                            continue

                    # 读取设备详情（objectName / vendorName / modelName）
                    # 跳过 objectList（object_count）——数据量大且耗时
                    # 三个属性并发读取，将单设备耗时从 3*timeout 降为 timeout
                    device_address = f"{address}:{port}"
                    object_identifier = f"device,{device_id}"

                    device_name, vendor_name, model_name = await asyncio.gather(
                        self._read_device_property(app, device_address, object_identifier, "objectName"),
                        self._read_device_property(app, device_address, object_identifier, "vendorName"),
                        self._read_device_property(app, device_address, object_identifier, "modelName"),
                    )

                    device = DiscoveredDevice(
                        device_id=device_id,
                        address=address,
                        port=port,
                        device_name=device_name,
                        vendor_name=vendor_name,
                        model_name=model_name,
                    )

                    discovered_devices.append(device)

                    logger.info(
                        f"Discovered device - "
                        f"ID: {device_id}, "
                        f"Address: {address}:{port}"
                    )

                except Exception as parse_error:
                    logger.warning(
                        f"Failed to parse I-Am response: {parse_error}, "
                        f"skipping this device"
                    )
                    continue

            logger.info(f"Discovered {len(discovered_devices)} BACnet devices")

            # 按 device_id 排序，保证返回顺序稳定可预测
            discovered_devices.sort(key=lambda d: d.device_id)

            return discovered_devices

        except ImportError as e:
            logger.error(f"bacpypes3 library not installed or import failed: {e}")
            raise RuntimeError(f"bacpypes3 library not installed or import failed: {e}")
        except OSError as os_error:
            # 处理端口占用错误（WinError 10048）
            if "10048" in str(os_error) or "通常每个套接字地址" in str(os_error):
                error_msg = (
                    f"BACnet设备发现端口冲突：标准端口 47808 已被占用。\n"
                    f"可能原因：\n"
                    f"1. 本地有其他 BACnet 应用正在运行\n"
                    f"2. BACnet 设备插件正在使用该端口进行轮询（不应该发生）\n"
                    f"解决方案：\n"
                    f"1. 等待1-2分钟后重试\n"
                    f"2. 检查是否有其他BACnet应用正在运行\n"
                    f"注意：\n"
                    f"- 设备发现服务使用标准端口 47808（临时实例）\n"
                    f"- 设备轮询插件使用端口 47809（共享实例）\n"
                    f"- 两者应该互不干扰"
                )
                logger.error(error_msg)
                raise RuntimeError(error_msg)
            else:
                logger.error(f"Network error during device discovery: {os_error}", exc_info=True)
                raise RuntimeError(f"Network error during device discovery: {str(os_error)}")
        except Exception as e:
            logger.error(f"Device discovery failed: {e}", exc_info=True)
            raise RuntimeError(f"Device discovery failed: {str(e)}")
        finally:
            # 优雅关闭临时的 Application 实例
            # 设备发现完成后需要优雅关闭，避免bacpypes3内部异步任务出错
            try:
                if app and hasattr(app, 'close'):
                    # 等待一小段时间，让bacpypes3内部的异步任务完成或超时
                    # who_is()完成后，内部可能有confirmation任务仍在运行
                    # 给它们500ms时间自然结束，避免强制中断导致错误
                    await asyncio.sleep(0.5)
                    
                    # 关闭应用
                    app.close()  # close() 是同步方法，不需要 await
                    logger.info(
                        f"Closed temporary BACnet Application instance "
                        f"(released port 47808 gracefully)"
                    )
            except Exception as e:
                # 关闭时的错误是预期的（应用和内部任务正在清理）
                # 只记录warning，不作为严重错误
                logger.warning(
                    f"Expected cleanup warning when closing discovery app: {e}. "
                    f"This is normal during application shutdown."
                )