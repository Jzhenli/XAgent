import { default as GGroup } from '../shapes/GGroup';
import { default as GItem } from '../shapes/GItem';
import { default as TempGroup } from '../shapes/TempGroup';

export default class GLayer {
    name: string;
    items: GItem[];
    isLock: boolean;
    isView: boolean;
    uqId: number;
    constructor(name?: string);
    beforeSave(): void;
    getAlignableItems(): GItem[];
    activate(): void;
    deactivate(): void;
    canGroup(): boolean;
    createGroupFromTempGroup(): void;
    unGroup(group: GGroup, dontActivateContent?: boolean): void;
    findGroupContainsItem(item: GItem): GItem;
    updateUqId(item: GItem): void;
    updateBindingRelations(items: GItem[]): void;
    addItem(item: GItem, toItem?: GItem, before?: boolean): void;
    addItems(items: GItem[], toItem?: GItem, before?: boolean): void;
    moveItem(item: GItem, aim?: GItem, before?: boolean): void;
    moveItemToAim(item: GItem, aim?: GItem, before?: boolean): void;
    /**
     * 只负责插入到指定位置，不负责从原来的位置移除
     */
    moveItemsToAim(items: GItem[], aim?: GItem, before?: boolean): void;
    changeItemOrder(item: GItem, type: string): string | null | undefined;
    canMoveFrom(item: GItem): [boolean, string | null];
    canMoveGroupFrom(tempGroup: TempGroup): (string | boolean)[] | (boolean | null)[];
    canDuplicateItem(item: GItem): [boolean, string | null];
    canDuplicateGroup(tempGroup: TempGroup): [boolean, string | null];
    isChildrenInGroupUnselect(parentUqId: number, items: GItem[]): boolean;
    removeItem(item: GItem): void;
    removeItemWithBinding(item: GItem): GItem[];
    removeTempGroupWithBinding(tempGroup: TempGroup): GItem[];
    exists(item: GItem): boolean;
    findItemsBetween(item1: GItem, item2: GItem): GItem[];
    findItemUnselectPrev(tempGroup: TempGroup, item: GItem): GItem | null;
    /**
     * 内部使用
     */
    getOrderedItems(tempGroup: TempGroup): GItem[];
    moveTempGroupToTop(tempGroup: TempGroup): void;
    moveTempGroupToItem(tempGroup: TempGroup, aim: GItem, before: boolean | undefined): void;
    moveTempGroupToBottom(tempGroup: TempGroup): void;
    findBindingItems(uqId: number): GItem[];
    getPointAttrValueRegistrators(dataAccessManager?: any): [any, (value: string, type?: any, translatedText?: string) => void][];
    loadData(data: {
        name: string;
        uqId: number;
        items: any[];
    }, customImgCache?: string[]): Promise<void>;
    duplicate(item: GItem | TempGroup): void;
    loadDataRender(data: {
        name: string;
        uqId: number;
        items: any[];
    }, customImgCache?: string[]): void;
    updateBindingPointName(): void;
    exportData(): {
        name: string;
        uqId: number;
        items: any[];
    };
}
