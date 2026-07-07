export type paramMeta = {
    name: string;
    description: string;
    type: 'string' | 'number' | 'time' | 'singleSelection' | 'multiSelection' | 'spaceRef' | 'networkRef' | 'list<string>' | 'list<number>' | 'list<time>' | 'list<singleSelection>' | 'list<multiSelection>' | 'list<spaceRef>' | 'list<networkRef>';
    range?: {
        min?: number;
        max?: number;
    };
    optionList?: {
        label: string;
        value: any;
    }[];
};
export type serviceMeta = {
    url: string;
    name: string;
    description: string;
    paramsMeta: paramMeta[];
};
export declare class NoderedService {
    listServices(): Promise<serviceMeta[]>;
    customService(url: string, paramList: {
        key: string;
        value: any;
    }[]): Promise<any>;
}
declare const _default: NoderedService;
export default _default;
