import { default as BaseDevice, BaseDeviceProps } from '../BaseDevice';
import { shapePropertyRenderType, propertyGroupRenderType } from '../../../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { alignSystem } from '../../../common/Draggable';

export default class DXCoil extends BaseDevice {
    viewPosList: {
        name: string;
        size: number[];
        img: never[];
        thumb: string;
        lnk: (number | null)[];
    }[];
    animLayerImage: never[];
    shaderImgs: never[];
    brushTypes: never[];
    propertyMeta: ({
        group: string;
        type: propertyGroupRenderType;
        items: never[];
        opt: {
            enableShapeRate: boolean;
            disableRotation: boolean;
            disableLockRatio: boolean;
            enableColor?: undefined;
            enableBorderColor?: undefined;
            enableBackgroundColor?: undefined;
            animationCount?: undefined;
            animationStateList?: undefined;
            disableMoveAndRotate?: undefined;
            getInitStates?: undefined;
            onUpdateState0?: undefined;
        };
    } | {
        group: string;
        type: propertyGroupRenderType;
        items: ({
            name: string;
            label: string;
            type: shapePropertyRenderType;
            opt: {
                animationAvail: boolean;
                animationStates: {
                    name: string;
                    label: string;
                }[];
            };
        } | {
            name: string;
            label: string;
            type: shapePropertyRenderType;
            opt?: undefined;
        })[];
        opt?: undefined;
    } | {
        group: string;
        type: propertyGroupRenderType;
        items: never[];
        opt: {
            enableColor: boolean;
            enableBorderColor: boolean;
            enableBackgroundColor: boolean;
            animationCount: number;
            animationStateList: string[];
            disableMoveAndRotate: boolean;
            getInitStates: () => {
                backgroundColor: any;
            };
            onUpdateState0: () => void;
            enableShapeRate?: undefined;
            disableRotation?: undefined;
            disableLockRatio?: undefined;
        };
    })[];
    relatedChildrenProperties: string[];
    constructor(opt?: BaseDeviceProps);
    displayName: string;
    bindingCount: number;
    bindingStateArray: string[];
    bindingStateProps: string[];
    getPointAttrValueRegistrators(): [any, (value: string, type?: any) => void][];
    updateJoinStates(): void;
    autoAlignable: boolean;
    autoAlignMeta: {
        name: string;
        type: alignSystem;
        position: number[];
    }[][];
}
