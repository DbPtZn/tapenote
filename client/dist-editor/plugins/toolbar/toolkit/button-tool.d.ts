import { VNode, Component } from 'vue';
import { Tool } from '../types';
import { QueryState, Keymap, Injector } from '@textbus/core';

export interface ButtonToolConfig<T = any> {
    /** 设置按扭显示的文字 */
    label?: string;
    /** 给按扭控件添加一组 css class 类 */
    classes?: string[];
    /** 给按扭控件添加一组 icon css class 类 */
    iconClasses?: (string | Component)[];
    /** icon size 默认是 16 */
    size?: number;
    /** 当鼠标放在控件上的提示文字 */
    tooltip?: string;
    /** 当前按扭控件的快捷键配置 */
    keymap?: Keymap;
    onClick(): void;
    queryState?(): QueryState<T>;
    onDestroy?(): void;
}
export declare class ButtonTool implements Tool {
    private factory;
    private config;
    private controller;
    private isHighlight;
    private isDisabled;
    constructor(factory: (injector: Injector) => ButtonToolConfig<any>);
    setup(injector: Injector): VNode;
    refreshState(): void;
    disabled(is: boolean): void;
    onDestroy(): void;
}
