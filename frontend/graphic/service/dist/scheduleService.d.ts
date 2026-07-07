/**
 *  year: {
 *      1-254：(1-254) + 1900
 *      255: 任意,
 *  },
 *  month: {
 *      1-12: 1-12,
 *      13: 奇数月,
 *      14：偶数月,
 *      255: 任意月
 *  },
 *  day: {
 *      1-31: 1-31,
 *      32: 当月最后一天,
 *      33: 奇数日,
 *      34: 偶数日,
 *      255: 任意日
 *  },
 *  wday: {
 *      1-7: 周一-周日,
 *      255: 任意日
 *  }
 */
export type BACnetDate = {
    year: number;
    month: number;
    day: number;
    wday: number;
    week?: number;
};
/**
 * weeklyScheduleData第一层为周一到周日，第二层为每天执行的动作
 * dateRange中的string为日期: '2023-03-08'
 * time中的string为时间：'17:01:00'
 */
export type scheduleItem = {
    objectName?: string;
    parentReference: string;
    scheduleReference: string;
    bacnet_id?: number;
    priority?: number;
    valueType: number;
    defaultValue?: number;
    dateRange?: [string, string];
    weeklyScheduleData?: {
        time: string;
        value: number;
    }[][];
    exceptionScheduleData?: {
        startDate: BACnetDate;
        endDate: BACnetDate;
        timeValues: {
            time: string;
            value: number;
        }[];
        priority: number;
    }[];
    cronScheduleData?: {
        priority: number;
        cron: string;
        value: string;
    }[];
    relatedPointRefList?: string[];
    startDate?: BACnetDate;
    endDate?: BACnetDate;
};
export type scheduleEventsListResponse = {
    startDate: string;
    endDate: string;
    scheduleEvents: {
        cron: string;
        value: string;
        priority: string;
        events: {
            time: string;
        }[];
    }[];
};
export declare class ScheduleService {
    getValueTypeName(type: 0 | 1 | 2 | 3): string;
    getDeviceScheduleByRef(reference: string): Promise<scheduleItem | null>;
    getSystemScheduleByRef(reference: string): Promise<scheduleItem | null>;
    listScheduleByPointRef(ref: string): Promise<{
        system: string[];
        device: string[];
    }>;
    listScheduleBySpace(spaceId: string): Promise<{
        system: string[];
        device: string[];
    }>;
    createSystemSchedule(spaceId: string): Promise<scheduleItem | null>;
    saveSystemSchedule(schedultItem: scheduleItem): Promise<never>;
    deleteSystemSchedule(reference: string): Promise<never>;
    getScheduleEventsInDateRange(start: Date, end: Date, scheduleReference: string): Promise<scheduleEventsListResponse>;
    getPointEventsInDateRange(start: Date, end: Date, pointReference: string): Promise<scheduleEventsListResponse>;
    bacnetDateDescription(calendarEntry: BACnetDate | BACnetDate[]): string;
    calendarToBacnet(value: string): [BACnetDate, BACnetDate];
}
declare const _default: ScheduleService;
export default _default;
