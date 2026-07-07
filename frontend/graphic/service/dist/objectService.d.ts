import { networkItem, VirtualPoint } from './networkService';
import { BACnetPropertyType } from "./bacnetPropertyType";
export type objectAttributeType = {
    name: string;
    value: any;
    propertyId?: number;
    dataTypeId?: number;
    dataType?: string;
};
export declare enum registerType {
    '0X' = "0x(Coil Status)",
    '1X' = "1x(Input Status)",
    '4X' = "4X(Holding Register)",
    '3X' = "3x(Input Register)"
}
export declare class ObjectService {
    getAttributes(reference: string): Promise<{
        name: any;
        value: any;
        propertyId: any;
        dataTypeId: any;
        dataType: any;
        itemValue: any;
    }[]>;
    /**
     * 返回 min, max, translationMap?
     */
    getDetailObjectList(refList: string[]): Promise<({
        min: number | null;
        max: number | null;
        translationMap?: Map<number, string>;
        unit?: string;
        reference: string;
        name: string;
        type: string;
        classId: number;
        hasChild?: boolean | undefined;
    } | undefined)[]>;
    queryBinaryType(item: networkItem): Promise<{
        min: number;
        max: number;
        translationMap: Map<number, any>;
        reference: string;
        name: string;
        type: string;
        classId: number;
        hasChild?: boolean;
    }>;
    queryMuitistateType(item: networkItem): Promise<{
        min: number;
        max: any;
        translationMap: Map<number, string>;
        reference: string;
        name: string;
        type: string;
        classId: number;
        hasChild?: boolean;
    }>;
    queryAnalogType(item: networkItem): Promise<{
        min: number;
        max: number;
        unit: any;
        reference: string;
        name: string;
        type: string;
        classId: number;
        hasChild?: boolean;
    }>;
    attributeQueryBuffer: {
        reference: string;
        propList: string;
    }[];
    queryObjectAttributValue(ref: string, attrId: number): Promise<any>;
    getEnumSetById(id: number, lang?: string): Promise<Map<number, string>>;
    attrQueryPromise: Promise<Map<string, any>>;
    startQueryAttributes(): Promise<Map<string, any>>;
    getUniqueArray(array: {
        reference: string;
        propList: string;
    }[]): {
        reference: string;
        propList: string;
    }[];
    getValueByType(item: any, type: string, propId: BACnetPropertyType): any;
    setPointDislayName(reference: string, name: string): Promise<unknown>;
    createVObject(data: VirtualPoint): Promise<unknown>;
    updateVObject(data: VirtualPoint): Promise<unknown>;
    getEquipsName(references: string[]): Promise<unknown>;
}
declare const _default: ObjectService;
export default _default;
