export default class ValueSettingControl {
    isEditing: import('vue').Ref<boolean, boolean>;
    editingType: import('vue').Ref<string | null, string | null>;
    editingValue: import('vue').Ref<string | null, string | null>;
    exitEditingTimeout: number;
    editingStyle: import('vue').Ref<{
        opacity: number;
    }, {
        opacity: number;
    } | {
        opacity: number;
    }>;
    editingStyleInterval: number;
    setTypeValue(type: string, value: string): void;
    increaseTypeValue(type: string, step: number, start: number): void;
    decreaseTypeValue(type: string, step: number, start: number): void;
    updateEditingStyle(type: string): void;
    clear(): void;
}
