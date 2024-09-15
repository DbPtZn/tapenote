import { AnimeProvider } from '../../../../..';
import { Keymap } from '@textbus/core';

type AnimeOption = ReturnType<AnimeProvider['getOptions']>[0];
declare const _default: import('vue').DefineComponent<__VLS_TypePropsToRuntimeProps<{
    iconClasses?: string[] | undefined;
    keymap?: Keymap | undefined;
    /** 当鼠标放在控件上的提示文字 */
    tooltip?: string | undefined;
    options: AnimeOption[];
    onSelected: (args: {
        value: string;
        label: string;
    }) => void;
    currentValue: () => any;
    highlight: () => boolean;
    disabled: () => boolean;
}>, {}, unknown, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_TypePropsToRuntimeProps<{
    iconClasses?: string[] | undefined;
    keymap?: Keymap | undefined;
    /** 当鼠标放在控件上的提示文字 */
    tooltip?: string | undefined;
    options: AnimeOption[];
    onSelected: (args: {
        value: string;
        label: string;
    }) => void;
    currentValue: () => any;
    highlight: () => boolean;
    disabled: () => boolean;
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
