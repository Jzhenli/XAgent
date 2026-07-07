export declare enum BACnetClassId {
    Site = 286,
    Folder = 176,
    TrendStudy = 345,
    ResourceFile = 357,
    BACnetAI = 500,
    BACnetAO = 501,
    BACnetAV = 502,
    BACnetBI = 503,
    BACnetBO = 504,
    BACnetBV = 505,
    BACnetCalendar = 506,
    BACnetDevice = 508,
    BACnetMV = 519,
    BACnetNotification = 515,
    BACnetSchedule = 517,
    BACnetAccumulator = 220,
    BACnetTrendLog = 520,
    BACnetIP = 343,
    BACnetMSTP = 195,
    Space = 806,
    FacilityGraphic = 844,
    InternalResourceFile = 847,
    ADS = 425,
    Archive = 2000,
    FacilityDashboard = 2014,
    BACnets = 2015,
    KNXs = 2016,
    Cameras = 2017,
    Camera = 2018,
    KNX = 2019,
    MODBUS = 2037,
    CameraWall = 2020,
    SystemClass = 2021,
    SystemSchedule = 2022,
    EquipmentTemplate = 2029,
    EQUIPMENT_ANALOG_INPUT = 2030,
    EQUIPMENT_ANALOG_OUTPUT = 2031,
    EQUIPMENT_ANALOG_VALUE = 2032,
    EQUIPMENT_BINARY_INPUT = 2033,
    EQUIPMENT_BINARY_OUTPUT = 2034,
    EQUIPMENT_BINARY_VALUE = 2035,
    EQUIPMENT_MULTI_STATE_VALUE = 2036,
    OBJECT_SYSTEM_TRENDLOG = 2047,
    THIRD_PARTY_STATION = 2048,
    SYSTEM_ANALOG_VALUE = 2051,
    SYSTEM_BINARY_VALUE = 2052,
    SYSTEM_MULTI_STATE_VALUE = 2053,
    SYSTEM_TEXT_VALUE = 2054,
    KNX_GATEWAY = 2055,
    KNX_MAIN_GROUP_ADDRESS = 2056,
    KNX_MIDDLE_GEOUP_ADDRESS = 2057,
    KNX_ANALOG_VALUE = 2058,
    KNX_BINARY_VALUE = 2059,
    KNX_MULTI_STATE_VALUE = 2060,
    KNX_TEXT_VALUE = 2061,
    MODBUS_GATEWAY = 2062,
    EQUIPMENT_KNX_ANALOG_VALUE = 2063,
    EQUIPMENT_KNX_BINARY_VALUE = 2064,
    EQUIPMENT_KNX_MULTI_STATE_VALUE = 2065,
    EQUIPMENT_KNX_TEXT_VALUE = 2066,
    MODBUS_ANALOG_INPUT = 2038,
    MODBUS_ANALOG_VALUE = 2040,
    MODBUS_BINARY_INPUT = 2041,
    MODBUS_BINARY_VALUE = 2043,
    EQUIPMENT_MODBUS_ANALOG_INPUT = 2067,
    EQUIPMENT_MODBUS_ANALOG_VALUE = 2068,
    EQUIPMENT_MODBUS_BINARY_INPUT = 2069,
    EQUIPMENT_MODBUS_BINARY_VALUE = 2070,
    OPCUA_ROOT = 2071,
    OPCUA_GATEWAY = 2072,
    OPCUA_ANALOG_VALUE = 2073,
    OPCUA_BINARY_VALUE = 2074,
    OPCUA_TEXT_VALUE = 2075
}
declare function getNameByClassId(type: BACnetClassId): string;
declare const _default: {
    valueTypes: BACnetClassId[];
    editableValueTypes: BACnetClassId[];
    binaryValueTypes: BACnetClassId[];
    multistateValueTypes: BACnetClassId[];
    analogValueTypes: BACnetClassId[];
    summaryTypes: BACnetClassId[];
    trendType: BACnetClassId;
    scheduleTypes: BACnetClassId[];
    specialTypes: BACnetClassId[];
    getNameByClassId: typeof getNameByClassId;
};
export default _default;
