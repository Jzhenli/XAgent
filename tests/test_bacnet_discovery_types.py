"""BACnet 对象类型映射与可写性判定回归测试

覆盖:
- BACNET_DATA_TYPES 覆盖发现侧全部 12 种对象类型，standard_type 推导正确;
- DEFAULT_WRITABLE_MAPPING 对三种新增类型的语义
  (integerValue/positiveIntegerValue 可写、accumulator 只读);
- 发现点位 data_type = object_type 约定（与 converter 查表 key 一致）。
"""
import asyncio
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from XAgent.plugins.south.bacnet.constants import BACNET_DATA_TYPES
from XAgent.xcore.services.device_discovery_service import DeviceDiscoveryService

# 发现侧支持的全部对象类型 -> 期望 standard_type
OBJECT_TYPE_STANDARD_TYPES = {
    "analogInput": "float",
    "analogOutput": "float",
    "analogValue": "float",
    "binaryInput": "bool",
    "binaryOutput": "bool",
    "binaryValue": "bool",
    "multiStateInput": "int",
    "multiStateOutput": "int",
    "multiStateValue": "int",
    "integerValue": "int",
    "positiveIntegerValue": "int",
    "accumulator": "int",
}


def _service() -> DeviceDiscoveryService:
    # 跳过 __init__，避免依赖 bacpypes3 安装；被测逻辑均为类级纯逻辑
    return DeviceDiscoveryService.__new__(DeviceDiscoveryService)


def test_object_type_mappings_cover_all_discovery_types():
    for object_type, expected in OBJECT_TYPE_STANDARD_TYPES.items():
        mapping = BACNET_DATA_TYPES.get(object_type)
        assert mapping is not None, f"missing BACNET_DATA_TYPES entry for {object_type}"
        assert mapping["standard_type"] == expected, f"wrong standard_type for {object_type}"


def test_default_writability_for_new_types():
    service = _service()
    assert service._get_default_writable("integerValue") is True
    assert service._get_default_writable("positiveIntegerValue") is True
    assert service._get_default_writable("accumulator") is False


def test_discovered_point_data_type_equals_object_type():
    service = _service()

    class FakePlugin:
        @staticmethod
        async def read_property(object_type, object_instance, property_name):
            return f"{object_type}_{object_instance}"

    point = asyncio.run(
        service._read_single_object_properties(FakePlugin(), "integerValue", 1)
    )
    assert point is not None
    assert point["data_type"] == "integerValue"
    assert point["writable"] is True
    assert point["object_name"] == "integerValue_1"


def test_discovered_accumulator_is_readonly():
    service = _service()

    class FakePlugin:
        @staticmethod
        async def read_property(object_type, object_instance, property_name):
            return f"{object_type}_{object_instance}"

    point = asyncio.run(
        service._read_single_object_properties(FakePlugin(), "accumulator", 2)
    )
    assert point is not None
    assert point["data_type"] == "accumulator"
    assert point["writable"] is False
