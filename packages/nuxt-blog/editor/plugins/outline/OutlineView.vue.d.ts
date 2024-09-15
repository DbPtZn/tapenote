export interface OutlineItem {
    tagName: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    text: string;
    offsetTop: number;
}
declare const _default: import('vue').DefineComponent<__VLS_TypePropsToRuntimeProps<{
    data: () => OutlineItem[];
    openDelayAnimate: boolean;
    activeIndex: () => number;
    scrollTop: () => number;
    scrollerTo: (offsetTop: number) => void;
}>, {}, unknown, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_TypePropsToRuntimeProps<{
    data: () => OutlineItem[];
    openDelayAnimate: boolean;
    activeIndex: () => number;
    scrollTop: () => number;
    scrollerTo: (offsetTop: number) => void;
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
