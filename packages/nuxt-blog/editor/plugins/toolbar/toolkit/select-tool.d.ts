import { SelectOptionConfig } from './_utils/UISelect.vue';
import { VNode } from 'vue';
import { Tool } from '../types';
import { QueryState, Injector } from '@textbus/core';

/**
 * 下拉选择工具配置项
 */
export interface SelectToolConfig<T = any> {
    /** Select 的可选项配置 */
    options: SelectOptionConfig[];
    /** 给 Select 控件添加一组 css class */
    classes?: string[];
    /** 给 select 控件添加一组 icon css class 类 */
    iconClasses?: string[];
    /** 设置当前 Select 是否根据内容扩展宽度 */
    mini?: boolean;
    /** 当鼠标放在控件上的提示文字 */
    tooltip?: string;
    onChecked(value: T): void;
    queryState?(): QueryState<T>;
    onDestroy?(): void;
}
export declare class SelectTool implements Tool {
    private factory;
    private config;
    private controller;
    private isHighlight;
    private isDisabled;
    private currentVal;
    constructor(factory: (injector: Injector) => SelectToolConfig);
    setup(injector: Injector, limitElement: HTMLElement): VNode;
    refreshState(): void;
    disabled(is: boolean): void;
    onDestroy(): void;
}
