import { customBindingValue } from '../../../common/Bindable';
import { serviceMeta } from '@x-plateform-mono/service/dist/noderedService';

export declare class CustomBindingSelectPanelController {
    serviceList: serviceMeta[];
    /**
     * { url: }
     */
    allServiceConfigs: Map<string, {
        key: string;
        value: any;
    }[]>;
    listServices(): Promise<serviceMeta[]>;
    editingService: string | null;
    editingServiceMeta: serviceMeta | null;
    setConfig(config: customBindingValue): void;
    editingServiceData: {
        key: string;
        value: any;
    }[];
    selectService(url: string): {
        key: string;
        value: any;
    }[];
    editingParamName: string | null;
    editingParamIsList: boolean;
    editingParamValue: any;
    selectParameter(name: string): any;
    clearParameterValue(name: string): any[] | null;
    editingListItemIdx: number | null;
    addParamListItem(): any[];
    selectParamListItem(idx: number): void;
    removeParamListItem(idx: number): any[];
    setParamValue(value: any): void;
    getCurrentConfigData(): customBindingValue | null;
    _getName(url: string): string | undefined;
}
