import { widgetPoint } from '../common/Bindable';

declare function parseGradientToECharts(gradient: any): any;
declare function getEchartsImg(img?: any): Promise<unknown>;
declare function updateAccessData(widgetPoint: widgetPoint[], dataModels: any[], dataAccessManager: any, id: string): Promise<void>;
declare function getRefData(widgetPoint: widgetPoint[], dataModels: any[], dataAccessManager: any, id: string): Promise<any[]>;
declare function setAttribute(attribute: any[], bindingData: any[], defaultAttribute: any): any;
declare function getTimeByRange(option: any): {
    startDate: any;
    endDate: any;
};
declare function setJMode(bindingType: string, jMode: any): number | null;
declare function getJMode(bindingType: string, chartJMode: any): string | null;
declare function toFixedNum(num: number, precision?: number): string;
declare const _default: {
    parseGradientToECharts: typeof parseGradientToECharts;
    updateAccessData: typeof updateAccessData;
    getRefData: typeof getRefData;
    getEchartsImg: typeof getEchartsImg;
    bg: string;
    setAttribute: typeof setAttribute;
    getTimeByRange: typeof getTimeByRange;
    setJMode: typeof setJMode;
    getJMode: typeof getJMode;
    toFixedNum: typeof toFixedNum;
};
export default _default;
