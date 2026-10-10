"""KNX Constants - DPT mappings and protocol constants

KNX 插件 DPT 化:data_type 配置只认 KNX DPT 字符串(如 "5.010"),
编解码全部交给 xknx(DPTBase.parse_transcoder)。
旧语义名经 LEGACY_DATA_TYPE_TO_DPT 自动迁移(加载时打 warning)。
"""

import re
from typing import Any, Optional

KNX_DEFAULT_DPT = "1.001"

# DPT 字符串格式:主号或主号.子号,如 "1" / "5.010"
DPT_STRING_PATTERN = re.compile(r"^\d{1,3}(\.\d{1,3})?$")


def dpt_main_number(dpt: Any) -> Optional[int]:
    """解析 DPT 主号;非字符串或不符合 DPT 格式返回 None。

    plugin/converter 共用,避免多处实现行为漂移。
    """
    if not isinstance(dpt, str):
        return None
    dpt = dpt.strip()
    if not DPT_STRING_PATTERN.match(dpt):
        return None
    try:
        return int(dpt.split(".")[0])
    except ValueError:
        return None

# DPT 主号 → 标准数据类型(决定读值/写值的 Python 语义与上报 Protobuf tag)
# 未列出的主号按 "string" 兜底并打 warning。
# 类型含义:bool/int/float 为原生标量;string 用于两处——
#   a) KNX 标准字符/字符串类(4.x/16.x);
#   b) KNX 复合结构类(3/10/11/18/19/20/232,xknx 读出 dataclass/RGBColor/枚举,统一 str() 化上报)。
# 边界:8.010(DPT_Percent_V16)按 KNX 标准是浮点,读值会被 int() 截断。
DPT_MAIN_TO_STANDARD = {
    1: "bool",     # 1.xxx 开关
    2: "bool",     # 2.xxx 开关控制(取 value 位,control 位丢弃)
    3: "string",  # 3.xxx 调光/卷帘步进控制(xknx 读出 ControlDimming 复合值 → str)
    4: "string",   # 4.xxx 字符(8bit)
    5: "int",      # 5.xxx 8bit 无符号(5.001 百分比 / 5.010 无符号值)
    6: "int",      # 6.xxx 8bit 有符号
    7: "int",      # 7.xxx 2 字节无符号
    8: "int",      # 8.xxx 2 字节有符号
    9: "float",    # 9.xxx 2 字节浮点(9.001 温度等)
    10: "string",  # 10.xxx 时间(datetime → str)
    11: "string",  # 11.xxx 日期
    12: "int",     # 12.xxx 4 字节无符号
    13: "int",     # 13.xxx 4 字节有符号(13.013 电能 kWh)
    14: "float",   # 14.xxx 4 字节 IEEE 浮点
    16: "string",  # 16.xxx 字符串
    17: "int",     # 17.xxx 场景号(1-64)
    18: "string",  # 18.xxx 场景控制(learn+scene 复合 → str)
    19: "string",  # 19.xxx 日期时间(复合 → str)
    20: "string",  # 20.xxx 1 字节枚举(HVAC mode 等,xknx 读出枚举 → str)
    232: "string", # 232.600 RGB 颜色(插件层转 {"r","g","b"})
}

# 旧语义名 → DPT 迁移表。加载点位配置时自动转换并打 warning。
# 注:scene 迁移到 17.001(场景号 int)而非旧代码写的 18.001——
# xknx 中 18.001 是 learn+scene_number 复合值,不可直接读写 int。
LEGACY_DATA_TYPE_TO_DPT = {
    "switch": "1.001",
    "binary": "1.001",
    "bool": "1.001",
    "temperature": "9.001",
    "float": "9.001",
    "percent": "5.001",
    "brightness": "5.001",
    "dimming": "5.001",
    "blinds": "5.001",
    "scene": "17.001",
    "humidity": "9.007",
    "co2": "9.008",
    "voltage": "9.020",
    "current": "9.021",
    "power": "9.024",
    "energy": "13.013",
    "string": "16.001",
    "color_rgb": "232.600",
    "int": "5.010",
    "integer": "5.010",
}

DEFAULT_GATEWAY_PORT = 3671
DEFAULT_RECONNECT_INTERVAL = 5
DEFAULT_RECONNECT_MAX_DELAY = 60
DEFAULT_POLL_INTERVAL = 5

ERROR_CODE_DEVICE_OFFLINE = 10

# DPT → 默认工程单位(点位配置未显式指定 unit 时使用)。
# 与 xknx/KNX 规范严格对齐:xknx 解码出的数值即为规范单位下的值,
# 9.020 以 mV 编码、9.021 以 mA、9.024 以 kW(13.013 规范本身是 kWh,13.010 才是 Wh)。
DPT_DEFAULT_UNITS = {
    "5.001": "%",
    "9.001": "°C",
    "9.007": "%",
    "9.008": "ppm",
    "9.020": "mV",   # KNX 规范电压 DPT,220V 读出 220000
    "9.021": "mA",   # KNX 规范电流 DPT,5A 读出 5000
    "9.024": "kW",   # KNX 规范功率 DPT
    "13.013": "kWh", # KNX 规范有功电能(kWh),4 字节有符号
}

# 读值合理性检查(quality=uncertain),按 DPT 键。
# 写路径的值域校验由 xknx 编码层拒绝(ConversionError),不做钳位。
# 9.020/9.021/9.024 上限取 KNX 9.x 编码正区间(0~670760.96),负值无物理意义;
# 13.013 上限取 4 字节有符号编码上限。范围过窄会触发 uncertain 导致丢值,宁宽勿窄。
VALUE_RANGES = {
    "9.001": (-100, 400),      # 温度 °C:xknx 默认 -273~670760,收紧到物理合理区间
    "9.007": (-10, 110),       # 湿度 %:xknx 默认 0~670760,上限拦超饱和乱值
    # "5.001": (0, 100),       # 8bit 解码恒在 0~100,永不触发,省略
    "9.008": (0, 670760.96),   # CO2 ppm:拦负值故障帧
    "9.020": (0, 670760.96),   # 电压 mV:拦负值故障帧
    "9.021": (0, 670760.96),   # 电流 mA:拦负值故障帧
    "9.024": (0, 670760.96),   # 功率 kW:拦负值故障帧
    "13.013": (0, 2147483647), # 电能 kWh:拦负值故障帧
}
