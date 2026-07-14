export declare class BaseDeviceUtils {
    type: string;
    states2Config: {
        series: {
            duration: number;
            offsetPosition: {
                x: number;
                y: number;
            };
            offsetRotation: number;
            opacity: number;
            focus: boolean;
            backgroundColor: string;
        }[];
        type: string;
        focus: boolean;
    }[];
    states3Config: {
        series: {
            duration: number;
            offsetPosition: {
                x: number;
                y: number;
            };
            offsetRotation: number;
            opacity: number;
            focus: boolean;
            backgroundColor: string;
        }[];
        type: string;
        focus: boolean;
    }[];
    states5Config: {
        series: {
            duration: number;
            offsetPosition: {
                x: number;
                y: number;
            };
            offsetRotation: number;
            opacity: number;
            focus: boolean;
            backgroundColor: string;
        }[];
        type: string;
        focus: boolean;
    }[];
    configMap: Map<string, any[]>;
    constructor(type: string);
    getConfig(): any[] | undefined;
}
