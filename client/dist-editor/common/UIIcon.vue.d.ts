declare const _default: import('vue').DefineComponent<__VLS_TypePropsToRuntimeProps<{
    /** 类名图标 */
    icon?: string | undefined;
    /** 图标颜色 */
    color?: string | undefined;
    /** 图标深度 */
    depth?: 1 | 2 | 3 | 4 | 5 | undefined;
    /** 图标大小（当不指定单位时，默认单位: px） */
    size?: string | number | undefined;
    /** 传入一个数值，设置图标旋转的速度，数值越小旋转越快 */
    rotate?: number | undefined;
}>, {}, unknown, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_TypePropsToRuntimeProps<{
    /** 类名图标 */
    icon?: string | undefined;
    /** 图标颜色 */
    color?: string | undefined;
    /** 图标深度 */
    depth?: 1 | 2 | 3 | 4 | 5 | undefined;
    /** 图标大小（当不指定单位时，默认单位: px） */
    size?: string | number | undefined;
    /** 传入一个数值，设置图标旋转的速度，数值越小旋转越快 */
    rotate?: number | undefined;
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
