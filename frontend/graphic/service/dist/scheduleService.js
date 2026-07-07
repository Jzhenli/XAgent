import { format } from 'date-fns';
import request from './request';
import systemService, { ServiceTypes, allServices } from './systemService';
import { i18nScope, t } from './languages';
export class ScheduleService {
    getValueTypeName(type) {
        const valueTypeSet = new Map([
            [0, t('数值量')],
            [1, t('开关量')],
            [2, t('状态量')],
            [3, t('字符串')],
        ]);
        return valueTypeSet.get(type);
    }
    async getDeviceScheduleByRef(reference) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.schedule),
            url: 'DeviceScheduleAPI/GetScheduleData',
            params: {
                scheduleReference: reference
            }
        }).then((result) => {
            if (result.ack === "true") {
                return result.schedule;
            }
            else {
                return Promise.reject("ack false");
            }
        });
    }
    async getSystemScheduleByRef(reference) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.schedule),
            url: 'SystemScheduleAPI/GetSystemSchedule',
            params: {
                pointReference: reference
            }
        }).then((result) => {
            if (result.ack === "true") {
                return result.schedule;
            }
            else {
                return Promise.reject("ack false");
            }
        });
    }
    async listScheduleByPointRef(ref) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.schedule),
            url: 'AllScheduleAPI/GetObjectScheduleList',
            params: {
                objectReference: ref
            }
        }).then((result) => {
            if (result.ack === "true") {
                return {
                    system: result.SystemSchedule,
                    device: result.DeviceSchedule,
                };
            }
            else {
                return Promise.reject("ack false");
            }
        });
    }
    async listScheduleBySpace(spaceId) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.schedule),
            url: 'AllScheduleAPI/GetSpaceScheduleList',
            params: {
                spaceReference: spaceId
            }
        }).then((result) => {
            if (result.ack === "true") {
                return {
                    system: result.SystemSchedule,
                    device: result.DeviceSchedule,
                };
            }
            else {
                return Promise.reject("ack false");
            }
        });
    }
    async createSystemSchedule(spaceId) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.schedule),
            url: 'SystemScheduleAPI/CreateSystemSchedule',
            params: {
                spaceReference: spaceId
            }
        }).then((result) => {
            if (result.ack === "true") {
                return result.schedule;
            }
            else {
                return Promise.reject("ack false");
            }
        });
    }
    async saveSystemSchedule(schedultItem) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.schedule),
            url: 'SystemScheduleAPI/ModifySystemSchedule',
            method: 'post',
            data: schedultItem
        }).then((result) => {
            if (result.ack === "true") {
                return;
            }
            else {
                return Promise.reject("ack false");
            }
        });
    }
    async deleteSystemSchedule(reference) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.schedule),
            url: 'SystemScheduleAPI/DeleteSystemSchedule',
            method: 'post',
            data: '"' + reference + '"'
        }).then((result) => {
            if (result.ack === "true") {
                return;
            }
            else {
                return Promise.reject("ack false");
            }
        });
    }
    async getScheduleEventsInDateRange(start, end, scheduleReference) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.schedule),
            url: 'SystemScheduleAPI/GetScheduleEventsInDateRange',
            params: {
                start: format(start, 'yyyy-MM-dd HH:mm:ss'),
                end: format(end, 'yyyy-MM-dd HH:mm:ss'),
                scheduleReference
            }
        }).then((result) => {
            return result;
        });
    }
    async getPointEventsInDateRange(start, end, pointReference) {
        return request({
            baseURL: systemService.getBaseUrl(ServiceTypes.schedule),
            url: 'SystemScheduleAPI/GetPointEventsInDateRange',
            params: {
                start: format(start, 'yyyy-MM-dd HH:mm:ss'),
                end: format(end, 'yyyy-MM-dd HH:mm:ss'),
                pointReference
            }
        }).then((result) => {
            return result;
        });
    }
    bacnetDateDescription(calendarEntry) {
        if (calendarEntry == null) {
            return '';
        }
        if (calendarEntry instanceof Array) {
            var sd = calendarEntry[0];
            var ed = calendarEntry[1];
            if (!sd && !ed) {
                return t('不限日期');
            }
            else if ((sd && !ed) || (!sd && ed) ||
                (sd.year === ed.year && sd.month === ed.month && sd.day === ed.day && sd.wday === ed.wday)) {
                const entry = sd || ed;
                return this.bacnetDateDescription(entry);
            }
            else if (sd && sd.week) {
                return this.bacnetDateDescription(sd);
            }
            else {
                return this.bacnetDateDescription(sd) + ' - ' + this.bacnetDateDescription(ed);
            }
        }
        else {
            var year = calendarEntry.year;
            var month = calendarEntry.month;
            var day = calendarEntry.day;
            var wDay = calendarEntry.wday;
            var week = calendarEntry.week;
            if (year == 255 && month == 255 && day == 255 && wDay == 255 && (week == 0 || week == 255)) {
                return t('不限日期');
            }
            var ret = '';
            ret += year == 255 ? t('每年') : (year + 1900) + t('年');
            const monthdesc = getMonthDesc(month);
            if (ret && monthdesc) {
                ret += '';
            }
            ret += monthdesc;
            if (week) {
                ret += getWeekDesc(week);
            }
            else {
                ret += getDayDesc(day);
            }
            // if(day == 255){
            ret += getWDayDesc(wDay, day);
            // }
            return ret;
        }
        function getMonthDesc(m) {
            const dtf = new Intl.DateTimeFormat(i18nScope.activeLanguage, {
                month: 'long',
            });
            var ret = new Map([
                [13, t('单月')], [14, t('双月')], [255, t('每月')],
            ]).get(m);
            return (ret || (i18nScope.activeLanguage.startsWith('zh-') ? m + t('月') : (' ' + dtf.format(new Date().setMonth(m - 1)) + ' ')));
        }
        function getDayDesc(d) {
            var ret = new Map([
                [32, t('最后一天')], [33, t('单日')], [34, t('双日')], [255, t('')],
            ]).get(d);
            return ret == '' ? '' : ('' + (ret || d + t('日')));
        }
        function getWeekDesc(d) {
            var ret = new Map([
                [1, t('第一')], [2, t('第二')], [3, t('第三')], [4, t('第四')], [5, t('第五')], [6, t('最后一')], [255, t('')],
            ]).get(d);
            return ret == '' || !ret ? '' : (ret + t('周'));
        }
        function getWDayDesc(w, day) {
            var ret = new Map([
                [1, t('周一')], [2, t('周二')], [3, t('周三')], [4, t('周四')],
                [5, t('周五')], [6, t('周六')], [7, t('周日')], [255, '']
            ]).get(w);
            return ret ? ((day == 255 && (week == 255 || week == 0)) ? t('每') + ret : (i18nScope.activeLanguage.startsWith('zh-') ? '' : ' ') + ret) : day == 255 ? t('每日') : '';
        }
    }
    calendarToBacnet(value) {
        let startDate;
        let endDate;
        let textArr = value.split(' ');
        // Calendar type为 "Date"
        if (textArr.length == 2) {
            let month = textArr[1].split('/')[1];
            startDate = {
                year: (Number(textArr[1].split('/')[2]) - 1900) || 255,
                month: Number((month == 'odd' ? '13' : month == 'even' ? '14' : month)) || 255,
                week: 0,
                wday: Number(textArr[0]) || 255,
                day: Number(textArr[1].split('/')[0]) || 255
            };
            return [{ ...startDate }, { ...startDate }];
        }
        // Calendar type为 "Date"
        else if (textArr.length == 1 && textArr[0].split('/')[2].length == 4) {
            let month = textArr[0].split('/')[1];
            startDate = {
                year: (Number(textArr[0].split('/')[2]) - 1900) || 255,
                month: Number((month == 'odd' ? '13' : month == 'even' ? '14' : month)) || 255,
                week: 0,
                wday: 255,
                day: Number(textArr[0].split('/')[0]) || 255
            };
            return [{ ...startDate }, { ...startDate }];
        }
        // Calendar type为 "Week and Day"
        else if (textArr.length == 1 && textArr[0].split('/')[2].length < 4) {
            let month = textArr[0].split('/')[0];
            startDate = {
                year: 255,
                month: Number((month == 'odd' ? '13' : month == 'even' ? '14' : month)) || 255,
                week: Number(textArr[0].split('/')[1]) || 0,
                wday: Number(textArr[0].split('/')[2]) || 255,
                day: 255
            };
            return [{ ...startDate }, { ...startDate }];
        }
        // Calendar type为 "Date Range"
        else if (textArr.length >= 4) {
            let startText = value.split('From ')[1].split(' to ')[0];
            let endText = value.split('From ')[1].split(' to ')[1];
            let startMonth = startText.split('/')[1];
            let endMonth = endText.split('/')[1];
            startDate = {
                year: (Number(startText.split('/')[2]) - 1900) || 255,
                month: Number((startMonth == 'odd' ? '13' : startMonth == 'even' ? '14' : startMonth)) || 255,
                week: 0,
                wday: startText.includes('*') ? 255 : (Number(startText.split('/')[0].split(' ')[0]) || 255),
                day: startText.includes('*') ? 255 : (Number(startText.split('/')[0].split(' ')[1]) || 255)
            };
            endDate = {
                year: (Number(endText.split('/')[2]) - 1900) || 255,
                month: Number((endMonth == 'odd' ? '13' : endMonth == 'even' ? '14' : endMonth)) || 255,
                week: 0,
                wday: endText.includes('*') ? 255 : (Number(endText.split('/')[0].split(' ')[0]) || 255),
                day: endText.includes('*') ? 255 : (Number(endText.split('/')[0].split(' ')[1]) || 255)
            };
            return [{ ...startDate }, { ...endDate }];
        }
        else {
            let startDate = {
                year: 255,
                month: 255,
                week: 0,
                wday: 255,
                day: 255
            };
            return [{ ...startDate }, { ...startDate }];
        }
    }
}
let scheduleService = allServices.get(ServiceTypes.schedule);
if (!scheduleService) {
    scheduleService = new ScheduleService();
    allServices.set(ServiceTypes.schedule, scheduleService);
}
export default scheduleService;
//# sourceMappingURL=scheduleService.js.map