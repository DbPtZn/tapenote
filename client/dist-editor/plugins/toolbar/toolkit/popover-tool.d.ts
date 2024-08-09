import { Component, VNode } from 'vue';
import { Tool } from '../types';
import { Keymap, QueryState, Injector } from '@textbus/core';

export interface PopoverToolConfig {
    /** 快捷键配置 */
    keymap?: Keymap;
    /** 给当前控件添加一组 css class */
    classes?: string[];
    /** 给当前控件添加一组 icon css class */
    iconClasses?: string[];
    /** 当鼠标放在控件上的提示文字 */
    tooltip?: string;
    /** 设置控件显示的文字 */
    label?: string;
    view: Component;
    queryState(): QueryState<any>;
    useValue(value: any): void;
    onDestroy?(): void;
}
export declare class PopoverTool implements Tool {
    private factory;
    private config;
    private controller;
    private subs;
    private isHighlight;
    private isDisabled;
    constructor(factory: (textbus: Injector) => PopoverToolConfig);
    setup(textbus: Injector): VNode<import('vue').RendererNode, import('vue').RendererElement, {
        [key: string]: any;
    }>;
    refreshState(): void;
    disabled(is: boolean): void;
    onDestroy(): void;
}
