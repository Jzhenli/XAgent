"""Email Delivery Plugin

通过 SMTP 发送邮件通知。
"""

import asyncio
import logging
import smtplib
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Any, Dict, List, Optional

from XAgent.xcore.rule_engine import (
    DeliveryPlugin,
    PluginMetadata,
    Notification,
    DeliveryResult,
    DeliveryStatus,
)

logger = logging.getLogger(__name__)


class EmailDeliveryPlugin(DeliveryPlugin):
    """邮件交付插件

    通过 SMTP 发送邮件通知。
    """

    __plugin_name__ = "email"
    __plugin_type__ = "rule_engine.delivery"

    # SMTP超时时间（秒）
    SMTP_TIMEOUT = 30

    def __init__(self):
        super().__init__()
        self._smtp_host: str = ""
        self._smtp_port: int = 587
        self._smtp_user: str = ""
        self._smtp_password: str = ""
        self._from_address: str = ""
        self._use_tls: bool = True
        self._use_ssl: bool = False
        self._default_recipients: List[str] = []  # 默认收件人列表
    
    @classmethod
    def plugin_info(cls) -> PluginMetadata:
        return PluginMetadata(
            name="email",
            version="1.0.0",
            description="通过邮件发送通知",
            author="XAgent Team",
            plugin_type="rule_engine.delivery",
            icon="📧",
            color="#3b82f6",
            category="notification",
            display_name="邮件通知",
        )
    
    @classmethod
    def config_schema(cls) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "smtp_host": {
                    "type": "string",
                    "title": "SMTP 服务器",
                    "description": "SMTP 服务器地址"
                },
                "smtp_port": {
                    "type": "integer",
                    "title": "SMTP 端口",
                    "default": 587
                },
                "smtp_user": {
                    "type": "string",
                    "title": "SMTP 用户名"
                },
                "smtp_password": {
                    "type": "string",
                    "title": "SMTP 密码",
                    "format": "password"
                },
                "from_address": {
                    "type": "string",
                    "title": "发件人地址"
                },
                "recipients": {
                    "type": "array",
                    "title": "收件人列表",
                    "description": "默认邮件收件人地址列表",
                    "items": {
                        "type": "string"
                    }
                },
                "use_tls": {
                    "type": "boolean",
                    "title": "使用 STARTTLS",
                    "default": True,
                    "description": "使用STARTTLS加密（通常用于端口587）"
                },
                "use_ssl": {
                    "type": "boolean",
                    "title": "使用 SMTP_SSL",
                    "default": False,
                    "description": "使用SMTP_SSL加密（通常用于端口465）"
                }
            },
            "required": ["smtp_host", "smtp_user", "smtp_password", "from_address"]
        }
    
    def initialize(self, config: Dict[str, Any]) -> None:
        """初始化邮件插件（延迟验证）

        允许不完整配置的初始化，实际验证在deliver/test_connection时进行。
        这样用户可以先保存配置，后续完善后再启用。
        """
        self._config = config
        self._smtp_host = config.get("smtp_host", "")
        self._smtp_port = config.get("smtp_port", 587)
        self._smtp_user = config.get("smtp_user", "")
        self._smtp_password = config.get("smtp_password", "")
        self._from_address = config.get("from_address", "")
        self._use_tls = config.get("use_tls", True)
        self._use_ssl = config.get("use_ssl", False)
        self._default_recipients = config.get("recipients", [])

        # ✅ 不在初始化时验证配置，允许不完整配置
        # 实际验证在 deliver() 和 test_connection() 时进行

        logger.info(
            f"Email delivery plugin initialized: {self._smtp_host or '<not configured>'}:{self._smtp_port}, "
            f"SSL={self._use_ssl}, TLS={self._use_tls}"
        )
    
    def _validate_config(self) -> Optional[str]:
        """验证邮件配置完整性

        Returns:
            Optional[str]: 配置错误信息，如果配置完整则返回None
        """
        errors = []
        
        if not self._smtp_host or not self._smtp_host.strip():
            errors.append("smtp_host is required")
        
        if not self._smtp_user or not self._smtp_user.strip():
            errors.append("smtp_user is required")
        
        if not self._smtp_password or not self._smtp_password.strip():
            errors.append("smtp_password is required")
        
        if not self._from_address or not self._from_address.strip():
            errors.append("from_address is required")
        
        if errors:
            return "Email configuration incomplete: " + ", ".join(errors)
        
        return None
    async def deliver(self, notification: Notification) -> DeliveryResult:
        """发送邮件通知

        Args:
            notification: 通知对象

        Returns:
            DeliveryResult: 交付结果
        """
        logger.debug(
            f"Email deliver called - notification_id={notification.notification_id}, "
            f"level={notification.level}"
        )
        
        # ✅ 延迟验证：在实际发送前检查配置完整性
        config_error = self._validate_config()
        if config_error:
            return DeliveryResult(
                status=DeliveryStatus.FAILED,
                success=False,
                error=config_error
            )
        
        try:
            # 使用通知中的收件人，如果没有则使用配置的默认收件人
            recipients = notification.recipients or []
            if not recipients:
                recipients = self._default_recipients
                if recipients:
                    logger.debug(f"Using default recipients: {recipients}")
            
            if not recipients:
                logger.warning(f"No recipients for notification {notification.notification_id}")
                return DeliveryResult(
                    status=DeliveryStatus.FAILED,
                    success=False,
                    error="No recipients specified"
                )
            
            # 构建邮件消息
            msg = self._build_message(notification, recipients)
            logger.debug(
                f"Email message built - from={self._from_address}, "
                f"to={recipients}, subject={msg['Subject']}"
            )

            # 发送邮件
            logger.debug(f"Sending email via SMTP - host={self._smtp_host}, port={self._smtp_port}")
            await asyncio.to_thread(self._send_email, msg, recipients)

            logger.info(f"Email sent successfully to {len(recipients)} recipients")

            return DeliveryResult(
                status=DeliveryStatus.SUCCESS,
                success=True,
                message=f"Email sent to {len(recipients)} recipients"
            )

        except Exception as e:
            logger.error(
                f"Email delivery failed - notification_id={notification.notification_id}, "
                f"error={str(e)}",
                exc_info=True
            )
            return DeliveryResult(
                status=DeliveryStatus.FAILED,
                success=False,
                error=str(e)
            )
    
    async def test_connection(self) -> bool:
        """测试邮件发送功能
        
        发送一封测试邮件到发件人地址，验证邮件发送是否正常。
        """
        # ✅ 延迟验证：检查配置完整性
        config_error = self._validate_config()
        if config_error:
            logger.error(f"SMTP configuration incomplete: {config_error}")
            return False
        
        try:
            # 构建测试邮件
            test_notification = Notification(
                notification_id="test-email",
                rule_id="test",
                rule_name="邮件通知测试",
                title="邮件通知测试",
                message="这是一封测试邮件，用于验证邮件通知功能是否正常工作。",
                level="info",
                recipients=[self._from_address],  # 发送给发件人自己
            )
            
            msg = self._build_message(test_notification)
            
            await asyncio.to_thread(
                self._send_email,
                msg,
                [self._from_address]
            )
            
            logger.info(f"Test email sent successfully to {self._from_address}")
            return True
        except Exception as e:
            logger.error(f"SMTP connection test failed: {e}")
            return False
    
    def _build_message(self, notification: Notification, recipients: List[str] = None) -> MIMEMultipart:
        """构建邮件消息
        
        Args:
            notification: 通知对象
            recipients: 收件人列表（可选，默认使用notification中的收件人）
        """
        msg = MIMEMultipart("alternative")
        msg["From"] = self._from_address
        # 优先使用传入的recipients，否则使用notification中的
        to_list = recipients or notification.recipients or []
        msg["To"] = ", ".join(to_list)
        msg["Subject"] = f"[{notification.level.upper()}] {notification.title}"
        
        text_content = self._build_text_content(notification)
        msg.attach(MIMEText(text_content, "plain", "utf-8"))
        
        html_content = self._build_html_content(notification)
        msg.attach(MIMEText(html_content, "html", "utf-8"))
        
        return msg
    
    def _build_text_content(self, notification: Notification) -> str:
        """构建纯文本内容"""
        # 格式化触发时间
        triggered_at_str = ""
        if notification.triggered_at:
            try:
                triggered_at_str = datetime.fromtimestamp(notification.triggered_at).strftime("%Y-%m-%d %H:%M:%S")
            except (TypeError, ValueError):
                triggered_at_str = str(notification.triggered_at)

        lines = [
            "告警通知",
            "=" * 40,
            "",
            f"规则: {notification.rule_name}",
            f"级别: {notification.level}",
            f"设备: {notification.asset}",
            f"点位: {notification.point_name}",
            f"当前值: {notification.current_value}",
            f"阈值: {notification.threshold}",
            "",
            f"消息: {notification.message}",
            "",
            f"触发时间: {triggered_at_str}",
        ]
        return "\n".join(lines)
    
    def _build_html_content(self, notification: Notification) -> str:
        """构建 HTML 内容"""
        level_colors = {
            "critical": "#dc2626",
            "warning": "#f59e0b",
            "info": "#3b82f6",
            "debug": "#6b7280"
        }
        color = level_colors.get(notification.level, "#6b7280")

        # 格式化触发时间
        triggered_at_str = ""
        if notification.triggered_at:
            try:
                triggered_at_str = datetime.fromtimestamp(notification.triggered_at).strftime("%Y-%m-%d %H:%M:%S")
            except (TypeError, ValueError):
                triggered_at_str = str(notification.triggered_at)

        return f"""
        <html>
        <body style="font-family: Arial, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto;">
                <h2 style="color: {color};">
                    [{notification.level.upper()}] {notification.title}
                </h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>规则</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">{notification.rule_name}</td></tr>
                    <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>设备</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">{notification.asset}</td></tr>
                    <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>点位</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">{notification.point_name}</td></tr>
                    <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>当前值</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">{notification.current_value}</td></tr>
                    <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>阈值</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">{notification.threshold}</td></tr>
                    <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>触发时间</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">{triggered_at_str}</td></tr>
                </table>
                <p style="margin-top: 16px;">{notification.message}</p>
            </div>
        </body>
        </html>
        """
    
    def _send_email(self, msg: MIMEMultipart, recipients: List[str]) -> None:
        """发送邮件"""
        if self._use_ssl:
            # SMTP_SSL（端口465）
            with smtplib.SMTP_SSL(self._smtp_host, self._smtp_port, timeout=self.SMTP_TIMEOUT) as server:
                server.login(self._smtp_user, self._smtp_password)
                server.sendmail(self._from_address, recipients, msg.as_string())
        else:
            # SMTP + STARTTLS（端口587）
            with smtplib.SMTP(self._smtp_host, self._smtp_port, timeout=self.SMTP_TIMEOUT) as server:
                if self._use_tls:
                    server.starttls()
                server.login(self._smtp_user, self._smtp_password)
                server.sendmail(self._from_address, recipients, msg.as_string())

    def _test_smtp_connection(self) -> None:
        """测试 SMTP 连接"""
        if self._use_ssl:
            with smtplib.SMTP_SSL(self._smtp_host, self._smtp_port, timeout=self.SMTP_TIMEOUT) as server:
                server.login(self._smtp_user, self._smtp_password)
        else:
            with smtplib.SMTP(self._smtp_host, self._smtp_port, timeout=self.SMTP_TIMEOUT) as server:
                if self._use_tls:
                    server.starttls()
                server.login(self._smtp_user, self._smtp_password)
    
    async def shutdown(self) -> None:
        """关闭插件"""
        logger.info("Email delivery plugin shutdown")
