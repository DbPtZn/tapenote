import { Attribute, Formatter, FormatValue } from '@textbus/core';
export interface EditableOptions {
    /** 设置是否要编辑标签 */
    tag?: boolean;
    /** 设置要编辑的 HTML 属性 */
    attrs?: string[];
    /** 设置要编辑的 Style */
    styleName?: string | string[];
}
/**
 * 匹配规则
 */
export interface MatchRule {
    /** 匹配的标签 */
    tags?: string[] | RegExp;
    /** 匹配的样式 */
    styles?: {
        [key: string]: number | string | RegExp | Array<number | string | RegExp>;
    };
    /** 匹配的属性 */
    attrs?: Array<{
        key: string;
        value?: string | string[];
    }>;
    /** 可继承样式的标签，如加粗，可继承自 h1~h6 */
    extendTags?: string[] | RegExp;
    /** 排除的样式 */
    excludeStyles?: {
        [key: string]: number | string | RegExp | Array<number | string | RegExp>;
    };
    /** 排除的属性 */
    excludeAttrs?: Array<{
        key: string;
        value?: string | string[];
    }>;
    /** 自定义过滤器，以适配以上不能满足的特殊需求 */
    filter?: (node: HTMLElement) => boolean;
}
export declare abstract class Matcher<T extends FormatValue, U = Attribute<T> | Formatter<T>> {
    target: U;
    protected rule: MatchRule;
    private validators;
    private excludeValidators;
    protected constructor(target: U, rule: MatchRule);
    match(element: HTMLElement): boolean;
    protected extractFormatData(node: HTMLElement, config: EditableOptions): {
        tag: string | null;
        attrs: Record<string, string> | null;
        styles: {
            [key: string]: string | number;
        };
    };
    private makeTagsMatcher;
    private makeAttrsMatcher;
    private makeStyleMatcher;
}
