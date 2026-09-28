"""KNX DPT 化回归测试(2026-09 重构)。

覆盖:
- 点位 data_type 归一化:旧语义名→DPT(迁移)、int→5.010、非法值→1.001;
- 读值归一化:DPT 1.001 枚举→bool(规避 bool(枚举) 恒 True 陷阱)、5.010 1 字节整数、232.600 RGB dict;
- 写路径:RemoteValueSensor.set 拒绝式校验(5.001 越界、5.010 负数),不钳位;
- converter:standard_data_type 按 DPT 主号推导;
- xnc codec:未知类型字符串兜底(不再静默 NULL)。
"""
import asyncio
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from xknx import XKNX
from xknx.dpt import DPTBase
from xknx.dpt.payload import DPTBinary
from xknx.remote_value import RemoteValueSensor
from xknx.telegram import GroupAddress

from XAgent.plugins.south.knx.plugin import KNXPlugin
from XAgent.plugins.south.knx.converter import KNXConverter
from XAgent.plugins.north.xnc_client.codec import ProtobufCodec
from XAgent.plugins.north.xnc_client.generated import ApplicationDataType


def _plugin() -> KNXPlugin:
    return KNXPlugin.__new__(KNXPlugin)


# ---------- 点位归一化 ----------

def test_normalize_points_migrates_legacy_names():
    plugin = _plugin()
    points = [
        {"name": "a", "data_type": "switch"},
        {"name": "b", "data_type": "temperature", "config": {"data_type": "temperature"}},
        {"name": "c", "data_type": "int"},
        {"name": "d", "data_type": "integer"},
        {"name": "e", "data_type": "5.010"},
        {"name": "f", "data_type": "bogus"},
        {"name": "g"},
    ]
    plugin._normalize_points_data_types(points)
    assert points[0]["data_type"] == "1.001"
    # 顶层与 config 子对象同步覆盖
    assert points[1]["data_type"] == "9.001"
    assert points[1]["config"]["data_type"] == "9.001"
    # int/integer → 5.010(修复 KNXInteger Value 读不到值)
    assert points[2]["data_type"] == "5.010"
    assert points[3]["data_type"] == "5.010"
    # 合法 DPT 保留;非法回退默认;未配置默认
    assert points[4]["data_type"] == "5.010"
    assert points[5]["data_type"] == "1.001"
    assert points[6]["data_type"] == "1.001"


def test_dpt_main_number_parsing():
    plugin = _plugin()
    assert plugin._dpt_main_number("5.010") == 5
    assert plugin._dpt_main_number("1") == 1
    assert plugin._dpt_main_number(" 9.001 ") == 9
    assert plugin._dpt_main_number("switch") is None
    assert plugin._dpt_main_number(None) is None
    assert plugin._dpt_main_number(123) is None


# ---------- 读值归一化 ----------

def test_normalize_dpt_value_bool_from_enum():
    """DPT 1.001 读出 Switch 枚举,bool(枚举成员) 恒 True 的陷阱必须规避"""
    plugin = _plugin()
    cls = DPTBase.get_dpt("1.001")
    off_raw = cls.from_knx(cls.to_knx(False))
    on_raw = cls.from_knx(cls.to_knx(True))
    assert plugin._normalize_dpt_value(off_raw, "1.001") is False
    assert plugin._normalize_dpt_value(on_raw, "1.001") is True


def test_normalize_dpt_value_bool_from_control_dataclass():
    """DPT 2.001 读出 SwitchControl dataclass(value 字段仍是 Switch 枚举,需两层剥壳)"""
    plugin = _plugin()
    cls = DPTBase.get_dpt("2.001")
    raw = cls.from_knx(DPTBinary(0b1_1))  # control=1 value=1
    assert plugin._normalize_dpt_value(raw, "2.001") is True
    raw = cls.from_knx(DPTBinary(0b0_0))  # control=0 value=0
    assert plugin._normalize_dpt_value(raw, "2.001") is False


def test_normalize_dpt_value_int_1byte():
    """KNXInteger Value 场景:1 字节 payload 按 5.010 解析出 int"""
    plugin = _plugin()
    cls = DPTBase.get_dpt("5.010")
    value = cls.from_knx(cls.to_knx(200))
    assert plugin._normalize_dpt_value(value, "5.010") == 200


def test_normalize_dpt_value_float():
    plugin = _plugin()
    cls = DPTBase.get_dpt("9.001")
    value = cls.from_knx(cls.to_knx(23.5))
    assert plugin._normalize_dpt_value(value, "9.001") == 23.5


def test_normalize_dpt_value_rgb():
    plugin = _plugin()
    cls = DPTBase.get_dpt("232.600")
    value = cls.from_knx(cls.to_knx({"red": 10, "green": 20, "blue": 30}))
    assert plugin._normalize_dpt_value(value, "232.600") == {"r": 10, "g": 20, "b": 30}


# ---------- 写路径(拒绝式,不钳位) ----------

def _make_write_rv(dpt: str) -> RemoteValueSensor:
    xknx = XKNX()  # 不 start,无网络;仅用其 telegram 队列
    return RemoteValueSensor(xknx, group_address=GroupAddress("1/4/3"), value_type=dpt)


def _setup_guard(plugin: KNXPlugin) -> None:
    plugin._enable_session_sharing = False
    plugin._session_key = None


def test_write_5_010_accepts_valid_range():
    plugin = _plugin()
    _setup_guard(plugin)
    rv = _make_write_rv("5.010")
    assert asyncio.run(plugin._write_device_value(rv, "5.010", 200)) is True
    # send_raw 不回填本地 payload(等总线响应),以 telegram 入队为成功依据
    assert rv.xknx.telegrams.qsize() == 1


def test_write_5_010_rejects_negative():
    plugin = _plugin()
    _setup_guard(plugin)
    rv = _make_write_rv("5.010")
    assert asyncio.run(plugin._write_device_value(rv, "5.010", -1)) is False
    assert rv.xknx.telegrams.qsize() == 0


def test_write_5_001_rejects_out_of_range():
    """5.001 严格 0-100:旧版 0-255 亮度换算 bug 不复现,越界拒绝"""
    plugin = _plugin()
    _setup_guard(plugin)
    rv = _make_write_rv("5.001")
    assert asyncio.run(plugin._write_device_value(rv, "5.001", 128)) is False
    assert asyncio.run(plugin._write_device_value(rv, "5.001", 100)) is True


def test_write_1_001_rejects_arbitrary_string():
    """bool 显式校验:任意 truthy 字符串不再被 if value: 误判为 on"""
    plugin = _plugin()
    _setup_guard(plugin)
    rv = _make_write_rv("1.001")
    assert asyncio.run(plugin._write_device_value(rv, "1.001", "true")) is False
    # xknx 认可的 on/off 字符串与 bool/0/1 可写
    assert asyncio.run(plugin._write_device_value(rv, "1.001", "off")) is True
    assert asyncio.run(plugin._write_device_value(rv, "1.001", False)) is True


def test_normalize_write_value_rgb():
    plugin = _plugin()
    assert plugin._normalize_write_value({"r": 1, "g": 2, "b": 3}, "232.600") == \
        {"red": 1, "green": 2, "blue": 3}
    assert plugin._normalize_write_value("10,20,30", "232.600") == \
        {"red": 10, "green": 20, "blue": 30}
    # 非 RGB DPT 透传
    assert plugin._normalize_write_value(5, "5.010") == 5


# ---------- 设备创建 ----------

def test_setup_devices_creates_sensor_and_write_rv():
    from XAgent.plugins.south.knx.plugin import _check_knx_available
    assert _check_knx_available(), "xknx must be importable for device setup"

    from xknx import XKNX as XKNXCls
    plugin = _plugin()
    plugin._xknx = XKNXCls()
    plugin._asset_name = "DEV"
    plugin._points = [
        {"name": "p1", "data_type": "5.010",
         "config": {"status_address": "1/4/4", "control_address": "1/4/3", "writable": True}},
        {"name": "p2", "data_type": "1.001",
         "config": {"status_address": "1/4/2", "writable": False}},
    ]
    plugin._devices = {}
    plugin._write_devices = {}
    plugin._point_order = []
    plugin._xknx_name_to_point = {}

    asyncio.run(plugin._setup_devices())

    assert set(plugin._point_order) == {"p1", "p2"}
    info = plugin._devices["p1"]
    assert info["dpt"] == "5.010"
    # 可写点位的写 RemoteValue 注册在 _write_devices
    assert plugin._write_devices["p1"]["write_rv"] is not None
    assert plugin._write_devices["p1"]["dpt"] == "5.010"
    # 只读点不建写 RemoteValue
    assert "p2" not in plugin._write_devices


def test_setup_devices_write_only_point():
    """只写点位(仅 control_address,无读地址):不进读集合/心跳,但可写"""
    from XAgent.plugins.south.knx.plugin import _check_knx_available
    assert _check_knx_available()

    from xknx import XKNX as XKNXCls
    plugin = _plugin()
    plugin._xknx = XKNXCls()
    plugin._asset_name = "DEV"
    plugin._points = [
        {"name": "wo", "data_type": "1.001",
         "config": {"control_address": "1/4/5", "writable": True}},
    ]
    plugin._devices = {}
    plugin._write_devices = {}
    plugin._point_order = []
    plugin._xknx_name_to_point = {}

    asyncio.run(plugin._setup_devices())

    # 只写点位不进读集合(避免心跳取到 device=None 误判掉线),但写集合必须注册
    assert "wo" not in plugin._devices
    assert plugin._point_order == []
    assert "wo" in plugin._write_devices
    assert plugin._write_devices["wo"]["write_rv"] is not None


def test_standard_type_for_dpt_3_is_string():
    """DPT 3.x 读出 ControlDimming 复合值,声明必须为 string(否则 int() cast 丢数据)"""
    from XAgent.plugins.south.knx.constants import DPT_MAIN_TO_STANDARD
    assert DPT_MAIN_TO_STANDARD[3] == "string"
    conv = KNXConverter()
    assert conv.get_standard_data_type("3.007") == "string"


def test_standard_type_for_dpt_20_is_string():
    """DPT 20.x 读出 xknx 枚举(如 HVACOperationMode),声明 string 使 str() 化上报而非走兜底 warning"""
    from XAgent.plugins.south.knx.constants import DPT_MAIN_TO_STANDARD
    assert DPT_MAIN_TO_STANDARD[20] == "string"
    conv = KNXConverter()
    assert conv.get_standard_data_type("20.102") == "string"


# ---------- converter ----------

def test_converter_standard_types_by_dpt_main():
    conv = KNXConverter()
    assert conv.get_standard_data_type("5.010") == "int"
    assert conv.get_standard_data_type("1.001") == "bool"
    assert conv.get_standard_data_type("9.001") == "float"
    assert conv.get_standard_data_type("16.001") == "string"
    assert conv.get_standard_data_type("13.013") == "int"


def test_converter_convert_with_dpt():
    conv = KNXConverter()
    pts = conv.convert(
        {"v": 200},
        [{"name": "v", "data_type": "5.010", "config": {"status_address": "1/4/4"}}],
        {"device_id": "d", "connection_status": "connected"},
    )
    p = pts[0]
    assert p["standard_data_type"] == "int"
    assert p["value"] == 200
    assert p["quality"] == "good"
    assert p["metadata"]["dpt"] == "5.010"
    assert "device_class" not in p["metadata"]


def test_converter_quality_uncertain_by_dpt_range():
    conv = KNXConverter()
    pts = conv.convert(
        {"t": 500},
        [{"name": "t", "data_type": "9.001"}],
        {"device_id": "d", "connection_status": "connected"},
    )
    assert pts[0]["quality"] == "uncertain"


# ---------- xnc codec ----------

def test_codec_unknown_type_falls_back_to_string():
    assert ProtobufCodec.infer_data_type({"r": 1, "g": 2, "b": 3}) == \
        ApplicationDataType.APP_TAG_CHARACTER_STRING
    dv = ProtobufCodec.create_data_value((1, 2, 3))
    assert dv.type == ApplicationDataType.APP_TAG_CHARACTER_STRING
    assert dv.pv == str((1, 2, 3))


def test_codec_none_still_null():
    assert ProtobufCodec.infer_data_type(None) == ApplicationDataType.APP_TAG_NULL
