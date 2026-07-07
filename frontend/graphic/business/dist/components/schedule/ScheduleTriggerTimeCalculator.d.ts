import { BACnetDate } from '@x-plateform-mono/service/dist/scheduleService';
/**
 * startTime 和 endTime 为 Calendar Range 时间部分均为00:00:00
 */
export declare function calculateTriggerTimes(startTime: Date, endTime: Date, weeklyData: {
    time: string;
    value: number;
}[][], exceptionData: {
    startDate: BACnetDate;
    endDate: BACnetDate;
    timeValues: {
        time: string;
        value: number;
    }[];
    priority: number;
}[], priority: number, startDate?: BACnetDate, endDate?: BACnetDate): {
    time: Date;
    content: any;
    priority?: number;
}[];
declare const _default: {
    calculateTriggerTimes: typeof calculateTriggerTimes;
};
export default _default;
