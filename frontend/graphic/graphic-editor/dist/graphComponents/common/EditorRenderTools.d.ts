declare function handleEditorSankey(props: any): Promise<{
    tagsList: any[];
    apiList: any;
}>;
declare function handleEditorApi(props: any): Promise<{
    tagsList: any[];
    apiList: any;
}>;
declare function handleRenderApi(props: any): Promise<{
    tagsList: any[];
    apiList: any;
}>;
declare function handleEditorTrendApi(props: any, chartCondition: any): Promise<{
    tagsList: any[];
    apiList: any;
}>;
declare function handleRenderTrendApi(props: any, chartCondition: any): Promise<{
    tagsList: any[];
    apiList: any;
}>;
declare const _default: {
    handleEditorApi: typeof handleEditorApi;
    handleRenderApi: typeof handleRenderApi;
    handleEditorTrendApi: typeof handleEditorTrendApi;
    handleRenderTrendApi: typeof handleRenderTrendApi;
    handleEditorSankey: typeof handleEditorSankey;
};
export default _default;
