import { BACnetClassId } from "./bacnetClassId";
export declare enum PointAttrValueType {
    Analog = "Analog",
    State = "State",
    String = "String",
    Binary = "Binary"
}
export type attributeItem = {
    id: number;
    label: string;
    type?: PointAttrValueType;
};
export declare const bindableList: number[];
export declare function translateDataTypes(type: string): PointAttrValueType;
export declare const unitMap: Map<number, string>;
export declare function translateUnit(id: string | number): string;
export declare const classValueTypeMap: Map<BACnetClassId, PointAttrValueType>;
declare function translatePointClassToValueTypes(type: BACnetClassId): PointAttrValueType;
declare const _default: {
    translateDataTypes: typeof translateDataTypes;
    translateUnit: typeof translateUnit;
    translatePointClassToValueTypes: typeof translatePointClassToValueTypes;
};
export default _default;
