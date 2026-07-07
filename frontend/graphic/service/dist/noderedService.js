import request from "./request";
import systemService, { ServiceTypes, allServices } from "./systemService";
export class NoderedService {
    async listServices() {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.nodeRed),
            url: 'customBinding/listServices'
        }).then((result) => {
            return result.data;
        });
    }
    async customService(url, paramList) {
        let data = {};
        paramList.forEach(item => {
            data[item.key] = item.value;
        });
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.nodeRed),
            url: 'customBinding/' + url,
            method: 'post',
            data: data
        });
    }
}
let noderedService = allServices.get(ServiceTypes.nodeRed);
if (!noderedService) {
    noderedService = new NoderedService();
    allServices.set(ServiceTypes.nodeRed, noderedService);
}
export default noderedService;
//# sourceMappingURL=noderedService.js.map