import { Plugin, Injector } from '@textbus/core';

export declare class OutlinePlugin implements Plugin {
    private app;
    private workbench;
    private host;
    private subs;
    private renderer;
    private rootComponentRef;
    private outlineService;
    private scrollerRef;
    private outlineData;
    private activeIndex;
    private scrollTop;
    private injector;
    constructor();
    setup(injector: Injector): void;
    private expand;
    private collapse;
    private scrollerToCallback;
    private getHeadingComponents;
    onDestroy?(): void;
}
