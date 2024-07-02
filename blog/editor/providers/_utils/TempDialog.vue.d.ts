import { VNode } from 'vue';

declare const _default: import('vue').DefineComponent<__VLS_TypePropsToRuntimeProps<{
    /** 是否显示 border */
    bordered?: boolean | undefined;
    /** 类名(对话框) */
    class?: string | undefined;
    /** 是否显示 close 图标 */
    closable?: boolean | undefined;
    /** 是否在摁下 Esc 键的时候关闭对话框 */
    closeOnEsc?: boolean | undefined;
    /** 内容 */
    content?: VNode<import('vue').RendererNode, import('vue').RendererElement, {
        [key: string]: any;
    }> | undefined;
    /** 是否可以通过点击 mask 关闭对话框 */
    maskClosable?: boolean | undefined;
    /** 对话框打开时执行回调 */
    onOpen?: (() => void) | undefined;
    /** 对话框关闭时执行回调 */
    onClose?: (() => void) | undefined;
}>, {}, unknown, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_TypePropsToRuntimeProps<{
    /** 是否显示 border */
    bordered?: boolean | undefined;
    /** 类名(对话框) */
    class?: string | undefined;
    /** 是否显示 close 图标 */
    closable?: boolean | undefined;
    /** 是否在摁下 Esc 键的时候关闭对话框 */
    closeOnEsc?: boolean | undefined;
    /** 内容 */
    content?: VNode<import('vue').RendererNode, import('vue').RendererElement, {
        [key: string]: any;
    }> | undefined;
    /** 是否可以通过点击 mask 关闭对话框 */
    maskClosable?: boolean | undefined;
    /** 对话框打开时执行回调 */
    onOpen?: (() => void) | undefined;
    /** 对话框关闭时执行回调 */
    onClose?: (() => void) | undefined;
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
