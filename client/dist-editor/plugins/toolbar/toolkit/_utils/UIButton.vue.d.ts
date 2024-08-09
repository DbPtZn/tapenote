import { Component } from 'vue';
import { Keymap } from '@textbus/core';

declare const _default: import('vue').DefineComponent<__VLS_TypePropsToRuntimeProps<{
    iconClasses?: (string | Component)[] | undefined;
    size?: number | undefined;
    label?: string | undefined;
    tooltip?: string | undefined;
    onClick(): void;
    keymap?: Keymap | undefined;
    highlight?: (() => boolean) | undefined;
    disabled?: (() => boolean) | undefined;
}>, {}, unknown, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_TypePropsToRuntimeProps<{
    iconClasses?: (string | Component)[] | undefined;
    size?: number | undefined;
    label?: string | undefined;
    tooltip?: string | undefined;
    onClick(): void;
    keymap?: Keymap | undefined;
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
