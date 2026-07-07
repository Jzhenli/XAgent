type __VLS_Props = {
    scheduleSelected?: string;
    scheduleRefs: {
        system: string[];
        device: string[];
    };
    translationMap?: Map<number, string>;
    isScheduleItem?: boolean;
    editable?: boolean;
    inScaleablePanel?: boolean;
};
declare const _default: import('vue').DefineComponent<__VLS_Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {} & {
    systemScheduleLoaded: (value: string) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSystemScheduleLoaded?: ((value: string) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, HTMLDivElement>;
export default _default;
