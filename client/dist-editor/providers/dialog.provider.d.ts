import { VNode } from 'vue';
import { Injector } from '@textbus/core';

interface DialogConfig {
    /** 临时对话框要挂载的节点（默认会挂载在body下的临时节点上） */
    host?: Element | string;
    /** 是否显示 border */
    /** 类名(对话框) */
    class?: string;
    /** 是否显示 close 图标 */
    /** 是否在摁下 Esc 键的时候关闭对话框 */
    closeOnEsc?: boolean;
    /** 内容 */
    content?: VNode;
    /** 是否可以通过点击 mask 关闭对话框 */
    maskClosable?: boolean;
}
export declare class DialogProvider {
    private container;
    private wrapper;
    private dialog;
    private hanger;
    constructor();
    create(config: DialogConfig, injector: Injector): Promise<unknown>;
    destory(): void;
}
export {};
