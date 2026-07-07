import { alignSystem } from '../common/Draggable';
import { default as GItem } from '../shapes/GItem';

declare class AutoAlign {
    enableAutoAlign: boolean;
    sensitivity: number;
    currentLayerAlignableItems: GItem[];
    /**
     *
     * @param itemStartPosList 被拖拽的图形中吸附点在拖拽开始时的位置{位置名称，吸附系统类型，起始位置}
     * @param v [x, y]拖拽的位移
     * @returns 返回{当前能否自动吸附, 吸附点位名称, 需要补偿的位移, 吸附目标的缩放比例}
     */
    calculateDeltaPosition(itemStartPosList: {
        name: string;
        type: alignSystem;
        startPos: [number, number];
    }[], v: [number, number]): {
        name?: string;
        isMatch: boolean;
        deltaVector?: [number, number];
        rate?: number;
    };
    findAlignResult(type: alignSystem, pos: [number, number]): {
        isMatch: boolean;
        deltaVector?: [number, number];
        rate?: number;
    };
    updateAlignableItems(): void;
}
declare const autoAlign: AutoAlign;
export default autoAlign;
