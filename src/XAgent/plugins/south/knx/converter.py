"""KNX Data Converter - Converts KNX device data to standard format"""

import logging
from typing import Any, Dict, List, Optional

from .constants import (
    DPT_DEFAULT_UNITS,
    DPT_MAIN_TO_STANDARD,
    ERROR_CODE_DEVICE_OFFLINE,
    VALUE_RANGES,
    dpt_main_number,
)
from XAgent.xcore.transform import ScaleOffsetTransformer

logger = logging.getLogger(__name__)

KNX_ERROR_MESSAGES = {
    10: "device_offline",
}


class KNXConverter:
    """
    KNX 数据转换器 - 符合 DataConverter 协议

    将 KNX 设备原始数据转换为标准格式。
    data_type 为 DPT 字符串(如 "5.010"),standard_data_type 按 DPT 主号推导。
    """

    @staticmethod
    def _get_point_config(point: Dict[str, Any], key: str, default: Any = None) -> Any:
        """获取点位配置字段（优先从 config 子对象读取，兼容顶层读取）"""
        point_config = point.get("config", {})
        if key in point_config:
            return point_config[key]
        if key in point:
            return point[key]
        return default

    @staticmethod
    def _dpt_main_number(dpt: Any) -> Optional[int]:
        """解析 DPT 主号,非法返回 None(统一委托 constants,避免双实现漂移)"""
        return dpt_main_number(dpt)

    def standard_type_for_dpt(self, dpt: Any) -> str:
        """DPT 主号 → 标准数据类型;未映射的主号 warning + string 兜底"""
        main = self._dpt_main_number(dpt)
        if main is None:
            logger.warning(
                "Invalid KNX data_type %r, fallback to standard type 'string'", dpt
            )
            return "string"
        standard = DPT_MAIN_TO_STANDARD.get(main)
        if standard is None:
            logger.warning(
                "Unmapped KNX DPT main number %s (from %r), "
                "fallback to standard type 'string'",
                main, dpt,
            )
            return "string"
        return standard

    def convert(
        self,
        raw_data: Dict[str, Any],
        point_configs: List[Dict[str, Any]],
        context: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        if not raw_data or not point_configs:
            return []

        device_id = context.get("device_id", "unknown")
        connection_status = context.get("connection_status", "connected")
        timestamp = context.get("timestamp")

        points = []

        for point_config in point_configs:
            point_name = point_config.get("name")
            if not point_name:
                continue

            raw_value = raw_data.get(point_name)

            data_type_config = self._get_point_config(point_config, "data_type")
            standard_data_type = self.standard_type_for_dpt(data_type_config)

            unit = self._get_point_config(
                point_config, "unit",
                DPT_DEFAULT_UNITS.get(data_type_config) if data_type_config else None
            )
            scale = self._get_point_config(point_config, "scale")
            offset = self._get_point_config(point_config, "offset")

            converted_value = None
            quality = "bad"
            error_code = None

            if connection_status != "connected":
                error_code = ERROR_CODE_DEVICE_OFFLINE
                if raw_value is not None:
                    converted_value = self._convert_value(raw_value, standard_data_type, scale, offset)
            elif raw_value is not None:
                converted_value = self._convert_value(raw_value, standard_data_type, scale, offset)
                quality = self._assess_quality(
                    converted_value,
                    data_type_config,
                    connection_status
                )
            else:
                error_code = ERROR_CODE_DEVICE_OFFLINE

            metadata = {
                "group_address": self._get_point_config(point_config, "group_address"),
                "status_address": self._get_point_config(point_config, "status_address"),
                "control_address": self._get_point_config(point_config, "control_address"),
                "writable": self._get_point_config(point_config, "writable", False),
                "dpt": data_type_config,
                "raw_value": raw_value
            }

            if scale is not None:
                metadata["scale"] = scale
            if offset is not None:
                metadata["offset"] = offset
            if error_code is not None:
                metadata["error_code"] = error_code
                metadata["error_message"] = KNX_ERROR_MESSAGES.get(error_code, "unknown_error")

            point_data = {
                "device_id": device_id,
                "point_name": point_name,
                "value": converted_value,
                "data_type": data_type_config,
                "standard_data_type": standard_data_type,
                "unit": unit,
                "quality": quality,
                "metadata": metadata
            }

            if timestamp:
                point_data["timestamp"] = timestamp

            points.append(point_data)

        return points

    def _convert_value(
        self,
        raw_value: Any,
        data_type: str,
        scale: Optional[float] = None,
        offset: Optional[float] = None
    ) -> Any:
        if raw_value is None:
            return None

        try:
            transformer = ScaleOffsetTransformer(scale=scale, offset=offset)
            return transformer.forward(raw_value, base_type=data_type)
        except (ValueError, TypeError) as e:
            logger.warning(f"Failed to convert value {raw_value} to type {data_type}: {e}")
            return None

    def _assess_quality(
        self,
        value: Any,
        dpt: Any,
        connection_status: str
    ) -> str:
        if connection_status != "connected":
            return "bad"

        if value is None:
            return "bad"

        if dpt in VALUE_RANGES:
            min_val, max_val = VALUE_RANGES[dpt]
            if isinstance(value, (int, float)) and not isinstance(value, bool) \
                    and not (min_val <= value <= max_val):
                return "uncertain"

        return "good"

    def get_standard_data_type(self, knx_data_type: str) -> str:
        """DPT 字符串 → 标准数据类型"""
        return self.standard_type_for_dpt(knx_data_type)
