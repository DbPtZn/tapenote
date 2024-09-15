import { Plugin, Injector } from '@textbus/core';

/**
 * 主题控制器（插件）
 */
export declare class Clipboard implements Plugin {
    private subs;
    private editorHost;
    private toolbarHost;
    private layout;
    constructor();
    setup(injector: Injector): void;
    onDestroy(): void;
}
