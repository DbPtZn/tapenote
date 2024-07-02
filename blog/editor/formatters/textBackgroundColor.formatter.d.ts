import { FormatLoader } from '@textbus/platform-browser';
import { MatchRule, Matcher } from '@textbus/editor';
import { FormatValue, Formatter, VElement, VTextNode } from '@textbus/core';

export declare class TextBackgroundColorFormatter implements Formatter<any> {
    name: string;
    styleName: string;
    columned: boolean;
    priority: number;
    constructor(name: string, styleName: string);
    render(children: Array<VElement | VTextNode>, formatValue: string): VElement;
}
export declare const textBackgroundColorFormatter: TextBackgroundColorFormatter;
export declare class InlineTagStyleFormatLoader<T extends FormatValue> extends Matcher<T, Formatter<any>> implements FormatLoader<any> {
    styleName: string;
    forceMatchTags: boolean;
    constructor(styleName: string, formatter: Formatter<any>, rule: MatchRule, forceMatchTags?: boolean);
    match(element: HTMLElement): boolean;
    read(node: HTMLElement): {
        formatter: Formatter<any>;
        value: string | number;
    };
}
export declare const textBackgroundColorFormatLoader: InlineTagStyleFormatLoader<FormatValue>;
