import { default as BaseDevice, BaseDeviceProps } from '../BaseDevice';
import { propertyGroupRenderType, shapePropertyRenderType } from '../../../rightPanelTools/PropertyTools/PropertyMetaTypes';
import { PointAttrValueType } from '@x-plateform-mono/service/dist/constants';
import { alignSystem } from '../../../common/Draggable';
import { BindedPoint } from '@x-plateform-mono/business/dist/components/dataBinder/DataBindingTypes';

export default class WaterCoil extends BaseDevice {
    viewPosList: {
        name: string;
        size: number[];
        img: string[];
        thumb: string;
        lnk: (number | null)[];
    }[];
    animLayerImage: string[];
    shaderImgs: string[];
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
            animationStateList?: undefined;
            disableMoveAndRotate?: undefined;
            getInitStates?: undefined;
            onUpdateState0?: undefined;
        };
    } | {
        group: string;
        items: ({
            name: string;
            label: string;
            type: shapePropertyRenderType;
            opt?: undefined;
        } | {
            name: string;
            label: string;
            type: shapePropertyRenderType;
            opt: {
                disabled: boolean;
                options: {
                    value: string;
                    label: string;
                }[];
            };
        })[];
        type?: undefined;
        opt?: undefined;
    } | {
        group: string;
        type: propertyGroupRenderType;
        items: ({
            name: string;
            label: string;
            type: shapePropertyRenderType;
            opt: {
                disabled: boolean;
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
            opt: {
                animationAvail: boolean;
                animationStates: {
                    name: string;
                    label: string;
                }[];
                disabled?: undefined;
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
    constructor(opt?: BaseDeviceProps);
    displayName: string;
    relatedChildrenProperties: string[];
    renderModeState: 'cool' | 'heat';
    renderValueState: 'off' | 'coil25' | 'coil50' | 'coil75' | 'coil100';
    getPointAttrValueRegistrators(): [BindedPoint, (value: string, type?: PointAttrValueType) => void][];
    updateJoinState(): void;
    autoAlignable: boolean;
    autoAlignMeta: {
        name: string;
        type: alignSystem;
        position: number[];
    }[][];
    set(key: string, value: any): void;
    setOptions(options: any): void;
}
