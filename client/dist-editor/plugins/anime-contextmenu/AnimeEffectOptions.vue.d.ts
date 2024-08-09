import { AnimeProvider } from '../..';

type AnimeOption = ReturnType<AnimeProvider['getOptions']>[0];
declare const _default: import('vue').DefineComponent<__VLS_TypePropsToRuntimeProps<{
    options: AnimeOption[];
    onSelect: (name: string, value: string) => void;
}>, {}, unknown, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_TypePropsToRuntimeProps<{
    options: AnimeOption[];
    onSelect: (name: string, value: string) => void;
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
