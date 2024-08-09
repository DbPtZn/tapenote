/** 组建成员 */
export declare class Structurer {
    /** 布局 */
    editorRef: HTMLElement | null;
    rootRef: HTMLElement | null;
    scrollerRef: HTMLElement | null;
    controllerRef: HTMLElement | null;
    toolbarRef: HTMLElement | null;
    setup(config: {
        rootRef?: HTMLElement;
        editorRef?: HTMLElement;
        scrollerRef?: HTMLElement;
        toolbarRef?: HTMLElement;
        controllerRef?: HTMLElement;
    }): void;
    destory(): void;
}
