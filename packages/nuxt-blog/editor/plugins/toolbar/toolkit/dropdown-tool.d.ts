import { DialogToolConfig } from './dialog-tool';
import { PopoverToolConfig } from './popover-tool';
import { SelectToolConfig } from './select-tool';
import { ButtonToolConfig } from './button-tool';
import { Tool } from '../types';
import { Injector } from '@textbus/core';

export declare enum ToolType {
    Button = "button",
    Select = "select",
    Render = "render",
    Dialog = "dialog"
}
export interface ButtonToolMenu extends ButtonToolConfig {
    type: ToolType.Button;
}
export interface SelectToolMenu extends SelectToolConfig {
    type: ToolType.Select;
    label: string;
}
export interface PopoverMenu extends PopoverToolConfig {
    type: ToolType.Render;
}
export interface DialogMenu extends DialogToolConfig {
    type: ToolType.Dialog;
}
export interface DropdownToolConfig {
    /** 设置按扭显示的文字 */
    label?: string;
    /** 给按扭控件添加一组 css class 类 */
    classes?: string[];
    /** 给按扭控件添加一组 icon css class 类 */
    iconClasses?: string[];
    /** 当鼠标放在控件上的提示文字 */
    tooltip?: string;
    options: Array<ButtonToolMenu | SelectToolMenu | PopoverMenu | DialogMenu>;
}
export declare class DropdownTool implements Tool {
    private factory;
    private menus;
    private isHighlight;
    private isDisabled;
    private controller;
    constructor(factory: (injector: Injector) => any);
    setup(injector: Injector, limitElement: HTMLElement): import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
        [key: string]: any;
    }>;
    refreshState(): void;
    disabled(): void;
    onDestroy(): void;
    private createDialog;
    private createPopover;
    private createSelect;
}
