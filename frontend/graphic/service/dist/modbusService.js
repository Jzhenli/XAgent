import request from "./request";
import systemService, { ServiceTypes, allServices } from './systemService';
export class ModbusService {
    async createModbusGateway(data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.dataGateway),
            url: '/DataGateway/Modbus/CreateGateway',
            method: 'post',
            data: data
        });
    }
    async updateModbusGateway(data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.dataGateway),
            url: 'DataGateway/Modbus/UpdateGateway',
            method: 'post',
            data: data
        });
    }
    async getModbusGatewayDetail(gatewayRef) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.dataGateway),
            url: 'DataGateway/Modbus/GatewayDetail',
            method: 'get',
            params: {
                gatewayRef: gatewayRef
            }
        });
    }
    async getGateWayList() {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.dataGateway),
            url: 'DataGateway/Modbus/GetGateWayList',
            method: 'get'
        });
    }
    async getXPointsByGatewayRef(gatewayRef) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.dataGateway),
            url: 'DataGateway/Modbus/GetXPointsByGatewayRef',
            method: 'get',
            params: {
                gatewayRef: gatewayRef
            }
        });
    }
    async batchInsertModbusPoints(gatewayRef, data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.dataGateway),
            url: 'DataGateway/Modbus/BatchInsertModbusPoints',
            method: 'post',
            data,
            params: {
                gatewayRef
            }
        });
    }
    async getGateWayStatusList() {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.dataGateway),
            url: 'DataGateway/Modbus/GetGateWayStatusList',
            method: 'get'
        });
    }
    async writeModbus(data) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.dataGateway),
            url: 'DataGateway/Modbus/WriteModbus',
            method: 'post',
            data
        });
    }
    async deleteGatewayCachebyModbus(gatewayData) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.dataGateway),
            url: 'DataGateway/Modbus/DeleteGatewayCache',
            method: 'delete',
            params: gatewayData
        });
    }
    getRangeFromModbusType(valueType) {
        if (valueType == 'Word') {
            return {
                minValue: '0',
                maxValue: 65535,
                integer: true
            };
        }
        else if (valueType == 'Short') {
            return {
                minValue: -32768,
                maxValue: 32767,
                integer: true
            };
        }
        else if (valueType == 'DWord') {
            return {
                minValue: '0',
                maxValue: 4294967295,
                integer: true
            };
        }
        else if (valueType == 'Long') {
            return {
                minValue: -2147483648,
                maxValue: 2147483647,
                integer: true
            };
        }
        else if (valueType == 'Float') {
            return {
                minValue: Number("-9.9999999e+18").toExponential(7),
                maxValue: Number("9.9999999e+18").toExponential(7)
            };
        }
        else if (valueType == 'SByte') {
            return {
                minValue: -128,
                maxValue: 127,
                integer: true
            };
        }
        else if (valueType == 'Byte') {
            return {
                minValue: 0,
                maxValue: 255,
                integer: true
            };
        }
        else if (valueType == 'Int16') {
            return {
                minValue: -32768,
                maxValue: 32767,
                integer: true
            };
        }
        else if (valueType == 'UInt16') {
            return {
                minValue: 0,
                maxValue: 65535,
                integer: true
            };
        }
        else if (valueType == 'Int32') {
            return {
                minValue: -2147483648,
                maxValue: 2147483647,
                integer: true
            };
        }
        else if (valueType == 'UInt32') {
            return {
                minValue: 0,
                maxValue: 4294967295,
                integer: true
            };
        }
        else if (valueType == 'Int64') {
            return {
                minValue: -9223372036854775808,
                maxValue: 9223372036854775807,
                integer: true
            };
        }
        else if (valueType == 'UInt64') {
            return {
                minValue: 0,
                maxValue: Number("9.9999999e+18").toExponential(7),
                integer: true
            };
        }
        else if (valueType == 'Double') {
            return {
                minValue: Number("-9.9999999e+18").toExponential(7),
                maxValue: Number("9.9999999e+18").toExponential(7)
            };
        }
    }
}
let modbusService = allServices.get(ServiceTypes.modbus);
if (!modbusService) {
    modbusService = new ModbusService();
    allServices.set(ServiceTypes.modbus, modbusService);
}
export default modbusService;
//# sourceMappingURL=modbusService.js.map