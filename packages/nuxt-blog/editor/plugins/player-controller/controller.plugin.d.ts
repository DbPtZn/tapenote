import { Tool } from './types';
import { Plugin, Injector } from '@textbus/core';

interface ToolFactory {
    (): Tool;
}
/**
 * 编辑器工具条
 */
export declare class Controller implements Plugin {
    private host;
    private subs;
    private tools;
    private components;
    private app;
    constructor(toolFactories: (ToolFactory | ToolFactory[])[] | undefined, host: HTMLElement | null);
    setup(injector: Injector): void;
    onDestroy(): void;
}
export {};
