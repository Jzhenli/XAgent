/**
 * 获取当前时区和服务器时区的偏移量
 * 使用服务器时间查询时，发送的时间戳 = 本地时间戳 + 偏移量
 */
declare function getTimezoneOffset(): Promise<number>;
declare function getServerNowTime(): Promise<Date>;
declare const _default: {
    getTimezoneOffset: typeof getTimezoneOffset;
    getServerNowTime: typeof getServerNowTime;
};
export default _default;
