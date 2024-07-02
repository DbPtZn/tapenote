import { Tool } from './types';
import { Plugin, Injector } from '@textbus/core';

interface ToolFactory {
    (): Tool;
}
/**
 * 编辑器工具条
 */
export declare class Toolbar implements Plugin {
    private toolFactories;
    private toolWrapper;
    private subs;
    tools: Array<Tool | Tool[]>;
    private components;
    private toolbarView;
    constructor(toolFactories: Array<ToolFactory | ToolFactory[]>, host: HTMLElement);
    setup(injector: Injector): void;
    onDestroy(): void;
}
export {};
/**
 * (widthSequence.length - 1) * 8 是所有按钮组的左右外边距之和
 * 20 是 toolWrapper 的左右内边距
 * _.sum(widthSequence) 是所有按钮组的宽度之和
 */
