import { GPoint } from '../DrawingArea';
import { default as Eventful } from './Eventful';

declare abstract class Draggable extends Eventful {
    abstract drift(dx: number, dy: number): void;
    isDragging: boolean;
    autoAlignable: boolean;
    alignPointsStartPosition: {
        name: string;
        type: alignSystem;
        startPos: [number, number];
    }[];
    downPosition: [number, number];
    accumulatedDrift: [number, number];
    /**
     * 开始拖拽时给出可以被吸附的点
     */
    getAlignPoints(): {
        name: string;
        type: alignSystem;
        startPos: [number, number];
    }[];
    /**
     * 其他图形拖拽时，根据点的位置判断是否可以被吸附；
     * 当可以以吸附时给出吸附点需要的偏移量以及当前图形的缩放比例；（缩放比例相同，图形可以吸附）
     */
    getAlignResult(type: alignSystem, iv: [number, number]): {
        isMatch: boolean;
        deltaVector?: [number, number];
        rate?: number;
    };
    /**
     * 还原初始缩放比例（自动吸附改变大小后又拖拽离开时触发）
     */
    restoreRate(): void;
    /**
     * 记录初始缩放比例
     */
    storeRate(): void;
    /**
     * 自定吸附到某个对象上时自动缩放到对应大小
     */
    zoomToTargetRate(name: string, rate: number): void;
    alignTo(type: alignSystem, distance: number, pos: GPoint): [boolean, GPoint?];
}
export default Draggable;
export declare enum alignSystem {
    water_X = "water_X",
    water_X_L = "water_X_L",
    water_X_R = "water_X_R",
    water_Y = "water_Y",
    water_Y_F = "water_Y_F",
    water_Y_B = "water_Y_B",
    water_Z = "water_Z",
    water_Z_U = "water_Z_U",
    water_Z_D = "water_Z_D",
    air_X = "air_X",
    air_X_L = "air_X_L",
    air_X_R = "air_X_R",
    air_Y = "air_Y",
    air_Y_F = "air_Y_F",
    air_Y_B = "air_Y_B",
    air_Z = "air_Z",
    air_Z_U = "air_Z_U",
    air_Z_D = "air_Z_D",
    duct_H = "duct_H",
    duct_H_L = "duct_H_L",
    duct_H_R = "duct_H_R",
    duct_V = "duct_V",
    duct_V_U = "duct_V_U",
    duct_V_D = "duct_V_D"
}
export declare const alignPairs: alignSystem[][];
