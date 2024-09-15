import { Component } from 'vue';
import { Keymap } from '@textbus/core';

declare const _default: import('vue').DefineComponent<__VLS_TypePropsToRuntimeProps<{
    /** 快捷键配置 */
    keymap?: Keymap | undefined;
    /** 给当前控件添加一组 css class */
    classes?: string[] | undefined;
    /** 给当前控件添加一组 icon css class */
    iconClasses?: string[] | undefined;
    /** 当鼠标放在控件上的提示文字 */
    tooltip?: string | undefined;
    /** 设置控件显示的文字 */
    label?: string | undefined;
    /** 弹出的内容 */
    view: Component;
    highlight?: (() => boolean) | undefined;
    disabled?: (() => boolean) | undefined;
}>, {}, unknown, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_TypePropsToRuntimeProps<{
    /** 快捷键配置 */
    keymap?: Keymap | undefined;
    /** 给当前控件添加一组 css class */
    classes?: string[] | undefined;
    /** 给当前控件添加一组 icon css class */
    iconClasses?: string[] | undefined;
    /** 当鼠标放在控件上的提示文字 */
    tooltip?: string | undefined;
    /** 设置控件显示的文字 */
    label?: string | undefined;
    /** 弹出的内容 */
    view: Component;
    highlight?: (() => boolean) | undefined;
    disabled?: (() => boolean) | undefined;
}>>>, {}, {}>;
export default _default;
type __VLS_NonUndefinedable<T> = T extends undefined ? never : T;
type __VLS_TypePropsToRuntimeProps<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? {
        type: import('vue').PropType<__VLS_NonUndefinedable<T[K]>>;
    } : {
        type: import('vue').PropType<T[K]>;
        required: true;
    };
};
