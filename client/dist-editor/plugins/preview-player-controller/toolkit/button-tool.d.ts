import { VNode } from 'vue';
import { Tool } from '../types';
import { Keymap, Injector } from '@textbus/core';

type State = {
    iconIndex?: number;
    disabled?: boolean;
};
export interface ButtonToolConfig {
    /** 给按扭控件添加一组 icon css class 类 */
    iconClasses: string[];
    /** 设置按钮的图标大小 */
    iconSize?: number;
    /** 当鼠标放在控件上的提示文字 */
    tooltip?: string;
    /** 给按扭控件添加一组 css class 类 */
    classes?: string[];
    /** 当前按扭控件的快捷键配置 */
    keymap?: Keymap;
    /** 初始化时的禁用状态 */
    disabled?: boolean;
    onClick(): void;
    updateState?(): State | undefined;
    onDestroy?(): void;
}
export declare class ButtonTool implements Tool {
    private factory;
    private config;
    private controller;
    private isHighlight;
    private isDisabled;
    private iconIndex;
    constructor(factory: (injector: Injector) => ButtonToolConfig);
    setup(injector: Injector): VNode;
    refreshState(): void;
    disabled(is: boolean): void;
    onDestroy(): void;
}
export {};
