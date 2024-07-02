import { VNode } from 'vue';
import { Tool } from '../types';
import { Keymap, QueryState, Injector } from '@textbus/core';

export interface SegmentDropdownToolConfig<T = any> {
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
    useValue?(value: T): void;
    queryState?(): QueryState<T>;
    onDestroy?(): void;
}
export declare class SegmentDropdownTool implements Tool {
    private factory;
    private config;
    private controller;
    private isHighlight;
    private isDisabled;
    private currentValue;
    constructor(factory: (injector: Injector) => SegmentDropdownToolConfig);
    setup(injector: Injector): VNode;
    disabled(is: boolean): void;
    refreshState(): void;
    onDestroy(): void;
}
