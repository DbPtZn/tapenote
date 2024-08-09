import { Tool } from '../toolbar/types';
import { Injector, Plugin } from '@textbus/core';

interface ToolFactory {
    (): Tool;
}
export declare class InlineToolbarPlugin implements Plugin {
    private toolFactories;
    private scroller;
    private toolbarRef;
    private toolWrapper;
    private subsA;
    private subsB;
    private tools;
    private toolbarWidth;
    private toolbarHeight;
    private components;
    private toolbarView;
    constructor(toolFactories: Array<ToolFactory | ToolFactory[]>, scroller: HTMLElement);
    setup(injector: Injector): void;
    onDestroy(): void;
    private onSelectionChange;
}
export {};
