import * as signalR from '@microsoft/signalr';
import { ServiceTypes, allServices } from './systemService';
export class DataValueHub {
    connection = undefined;
    subscribedPointAttributes = new Map();
    initService(url) {
        if (!this.connection) {
            this.connection = new signalR.HubConnectionBuilder()
                .withUrl((url || '') + '/signalR/dataValuesServiceHub')
                .withAutomaticReconnect()
                .configureLogging(signalR.LogLevel.Error)
                .build();
            this.connection.on("processDataValuesUpdate", (value) => {
                const items = JSON.parse(value);
                items.forEach(item => {
                    const callback = this.subscribedPointAttributes.get(item.PointRef)?.get(item.AttributeId);
                    if (callback) {
                        callback(item.AttributeValue);
                    }
                });
            });
            this.connection.onreconnecting(error => {
                console.log('singleR 正在重新连接: ', error);
            });
            this.connection.onreconnected(connectionId => {
                console.log('signalR 已自动重连: ', connectionId);
                this.resubscribeAll();
            });
            this.connection.onclose(error => {
                console.log('signalR 连接丢失: ', error);
            });
        }
    }
    startPromise = undefined;
    startConnection() {
        if (!this.startPromise) {
            this.startPromise = this.connection.start().then(() => {
                console.log('signalR 连接成功');
            });
            ;
        }
        return this.startPromise;
    }
    async subscribe(pointRef, attrId, callback) {
        await this.startConnection();
        let attrMap;
        if (this.subscribedPointAttributes.has(pointRef)) {
            attrMap = this.subscribedPointAttributes.get(pointRef);
        }
        else {
            attrMap = new Map();
            this.subscribedPointAttributes.set(pointRef, attrMap);
        }
        attrMap.set(attrId, callback);
        this.connection.invoke('SubscribeDataValueUpdates', [pointRef]);
    }
    async updateValue(pointRef, attrId) {
        await this.startConnection();
        this.connection.invoke('SubscribeDataValueUpdates', [pointRef]);
    }
    async unsubscribe(pointRef, attrId) {
        await this.startConnection();
        if (attrId !== undefined) {
            let attrMap;
            if (this.subscribedPointAttributes.has(pointRef)) {
                attrMap = this.subscribedPointAttributes.get(pointRef);
                if (attrMap.has(attrId)) {
                    attrMap.delete(attrId);
                }
                if (attrMap.size === 0) {
                    this.subscribedPointAttributes.delete(pointRef);
                    this.connection.invoke('UnsubscribeDataValueUpdates', [pointRef]);
                }
            }
        }
        else {
            if (this.subscribedPointAttributes.has(pointRef)) {
                this.subscribedPointAttributes.delete(pointRef);
                this.connection.invoke('UnsubscribeDataValueUpdates', [pointRef]);
            }
        }
    }
    resubscribeAll() {
        const allRefs = Array.from(this.subscribedPointAttributes.keys());
        this.connection.invoke('SubscribeDataValueUpdates', allRefs);
    }
}
let dataValueHub = allServices.get(ServiceTypes.dataValueHub);
if (!dataValueHub) {
    dataValueHub = new DataValueHub();
    window.setInterval(() => {
        dataValueHub.resubscribeAll();
    }, 1000 * 60 * 60 * 3);
    allServices.set(ServiceTypes.dataValueHub, dataValueHub);
}
export default dataValueHub;
//# sourceMappingURL=dataValueHub.js.map