import { default as Eventful } from '../common/Eventful';
import { shapePropertyGroupDef } from '../common/PropertyMetaTypes';

export declare const gridSize: {
    totalCols: number;
    totalRows: number;
    gridWidth: number;
    gridHeight: number;
    gridSpace: number;
};
export declare const gridSizex3: {
    totalCols: number;
    totalRows: number;
    gridWidth: number;
    gridHeight: number;
    gridSpace: number;
};
export declare const chartColors: string[];
export default class BaseWidget extends Eventful {
    displayName: string;
    icon: string;
    thumbnail: string;
    thumbnailSize: number[];
    defaultSize: number[];
    options: any;
    editingParam: any;
    propertyMeta: shapePropertyGroupDef[];
    component: any;
    renderComponent: any;
    set(key: string, value: any): void;
    get(key: string): any;
    getOptions(): any;
    setOptions(options: any): void;
    getRandomItems(arr: any[]): (cpntId: any) => any;
    getCompared(name: any, isEq: boolean): (value: any) => boolean;
    getJModeName(): (bindingType: any) => string;
}
