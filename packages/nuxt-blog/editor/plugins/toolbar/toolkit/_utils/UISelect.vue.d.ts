import { Keymap } from '@textbus/core';
import { SelectMixedOption } from 'naive-ui/es/select/src/interface';
import { Ref } from 'vue';

interface SelectOptionConfigExpand {
    value: string | number;
    default?: boolean;
    /** 给当前选项添加一组 css class 类 */
    classes?: string[];
    /** 给当前选项添加 icon css class 类 */
    iconClasses?: string[];
    /** 给选项添加前缀 */
    prefix?: string;
    /** 给选项添加后缀 */
    suffix?: string;
    keymap?: Keymap;
}
export type SelectOptionConfig = SelectMixedOption & SelectOptionConfigExpand;
declare const _default: import('vue').DefineComponent<__VLS_TypePropsToRuntimeProps<{
    /** 当前值 */
    currentValue?: Ref<string | number | null> | undefined;
    /** 给 Select 控件添加一组 css class */
    classes?: string[] | undefined;
    /** 给 select 控件添加一组 icon css class 类 */
    iconClasses?: string[] | undefined;
    /** 当鼠标放在控件上的提示文字 */
    tooltip?: string | undefined;
    /** 设置当前 Selector 是否根据内容扩展宽度 */
    mini?: boolean | undefined;
    /** 选项配置 */
    options: SelectOptionConfig[];
    /** 选择完成事件回调 */
    onSelected: (value: any) => void;
    highlight?: (() => boolean) | undefined;
    disabled?: (() => boolean) | undefined;
}>, {}, unknown, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    select: (args_0: string | number) => void;
}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<__VLS_TypePropsToRuntimeProps<{
    /** 当前值 */
    currentValue?: Ref<string | number | null> | undefined;
    /** 给 Select 控件添加一组 css class */
    classes?: string[] | undefined;
    /** 给 select 控件添加一组 icon css class 类 */
    iconClasses?: string[] | undefined;
    /** 当鼠标放在控件上的提示文字 */
    tooltip?: string | undefined;
    /** 设置当前 Selector 是否根据内容扩展宽度 */
    mini?: boolean | undefined;
    /** 选项配置 */
    options: SelectOptionConfig[];
    /** 选择完成事件回调 */
    onSelected: (value: any) => void;
    highlight?: (() => boolean) | undefined;
    disabled?: (() => boolean) | undefined;
}>>> & {
    onSelect?: ((args_0: string | number) => any) | undefined;
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
