import * as signalR from "@microsoft/signalr";
import { ServiceTypes, allServices } from "./systemService";
export class AlarmAnnotationHub {
    connection = undefined;
    alarmUpdateCallback = [];
    initService(url) {
        if (!this.connection) {
            this.connection = new signalR.HubConnectionBuilder()
                .withUrl((url || '') + '/signalR/AlarmHub')
                .withAutomaticReconnect()
                .configureLogging(signalR.LogLevel.Error)
                .build();
            this.connection.on('processAlarmUpdate', (value) => {
                this.alarmUpdateCallback.forEach(e => {
                    e(JSON.parse(value));
                });
            });
            this.connection.onreconnecting(error => {
                console.log('singleR 正在重新连接: ', error);
            });
            this.connection.onreconnected(connectionId => {
                console.log('signalR 已自动重连: ', connectionId);
            });
            this.connection.onclose(error => {
                console.log('signalR 连接丢失: ', error);
            });
        }
    }
    connectionStateChangePromise = undefined;
    async startConnection() {
        if (!this.connectionStateChangePromise) {
            this.connectionStateChangePromise = this.connection.start().then(() => {
                console.log('signalR 连接成功');
            });
        }
        else {
            this.connectionStateChangePromise = this.connectionStateChangePromise.then(() => {
                if (this.connection.state !== signalR.HubConnectionState.Connected) {
                    return this.connection.start().then(() => {
                        console.log('signalR 连接成功');
                    });
                }
            });
        }
        return this.connectionStateChangePromise;
    }
    async start(callback) {
        await this.startConnection();
        this.alarmUpdateCallback.push(callback);
    }
    subscribe(callback) {
        this.alarmUpdateCallback.push(callback);
    }
    unsubscribe(callback) {
        let index = this.alarmUpdateCallback.indexOf(callback);
        if (index > -1) {
            this.alarmUpdateCallback.splice(index, 1);
        }
    }
    async stop() {
        if (this.connection && this.connectionStateChangePromise) {
            this.connectionStateChangePromise = this.connectionStateChangePromise.then(() => {
                return this.connection.stop().then(() => {
                    console.log('signalR 连接已停止');
                });
            });
        }
    }
}
let alarmAnnotationHub = allServices.get(ServiceTypes.alarmAnnotationHub);
if (!alarmAnnotationHub) {
    alarmAnnotationHub = new AlarmAnnotationHub();
    allServices.set(ServiceTypes.alarmAnnotationHub, alarmAnnotationHub);
}
export default alarmAnnotationHub;
//# sourceMappingURL=alarmAnnotationHub.js.map