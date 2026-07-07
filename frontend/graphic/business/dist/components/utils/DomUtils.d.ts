declare function openModalDialog(cpnt: any, props: any): void;
/**
 * 使用要求ele为其父节点中的唯一子节点
 * 父节点的postion为absolute或relative
 * 其所有的overflow: auto的先祖节点要具有position: absolute/relative属性
 * 否则不保证定位准确
 * @param ele
 */
declare function editAsModalDialog(ele: HTMLElement): (() => void) | undefined;
declare const _default: {
    openModalDialog: typeof openModalDialog;
    editAsModalDialog: typeof editAsModalDialog;
};
export default _default;
