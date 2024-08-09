declare const _default: import('vue').DefineComponent<__VLS_TypePropsToRuntimeProps<{
    show: () => boolean;
    x: () => number;
    y: () => number;
    options: () => [
    ];
    to: HTMLElement;
}>, {}, unknown, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    select: () => void;
    clickoutside: () => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_TypePropsToRuntimeProps<{
    show: () => boolean;
    x: () => number;
    y: () => number;
    options: () => [
    ];
    to: HTMLElement;
}>>> & {
    onSelect?: (() => any) | undefined;
    onClickoutside?: (() => any) | undefined;
}, {}, {}>;
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
