import { VNode } from 'vue';
import { Keymap, Injector } from '@textbus/core';

export interface OutlineButtonToolConfig<T = any> {
    /** 设置按扭显示的文字 */
    label?: string;
    /** 给按扭控件添加一组 css class 类 */
    classes?: string[];
    /** 给按扭控件添加一组 icon css class 类 */
    iconClasses?: string[];
    /** 当鼠标放在控件上的提示文字 */
    tooltip?: string;
    /** 当前按扭控件的快捷键配置 */
    keymap?: Keymap;
    onClick(): void;
    onDestroy?(): void;
}
export declare class OutlineButtonTool {
    private factory;
    private config;
    private controller;
    private isHighlight;
    private isDisabled;
    private subs;
    private outlineService;
    constructor(factory: (injector: Injector) => OutlineButtonToolConfig<any>);
    setup(injector: Injector): VNode;
    refreshState(): void;
    disabled(is: boolean): void;
    onDestroy(): void;
}
