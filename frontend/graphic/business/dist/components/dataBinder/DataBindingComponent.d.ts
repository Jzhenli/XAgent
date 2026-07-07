import { PointAttrValueType } from '@x-plateform-mono/service/dist/constants';
import { BindedPoint } from './DataBindingTypes';
export default interface DataBindingComponent {
    id: number;
    getName(): string;
    getNextCpntId: ((() => number) | undefined);
    getBindingList(): BindedPoint[];
    bindingRenderValues: Map<number, {
        value: any;
        type?: PointAttrValueType;
        translatedText?: string;
    }>;
    registerMultiplePoint(bindingList: BindedPoint[], callback: (params: ({
        value: any;
        type?: PointAttrValueType;
        translatedText?: string;
    } | undefined)[]) => void): ([BindedPoint, ((value: any, type?: PointAttrValueType, translatedText?: string) => void)])[];
}
