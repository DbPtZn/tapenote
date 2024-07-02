import { FormatLoader } from '@textbus/platform-browser';
import { Matcher } from '@textbus/editor';
import { FormatHostBindingRender, VElement, VTextNode, Formatter } from '@textbus/core';

declare class ColorFormatter implements Formatter<any> {
    name: string;
    columned: boolean;
    priority: number;
    constructor(name: string);
    render(children: Array<VElement | VTextNode>, formatValue: string): FormatHostBindingRender;
}
export declare const colorFormatter: ColorFormatter;
declare class ColorFormatLoader extends Matcher<any, Formatter<any>> implements FormatLoader<any> {
    constructor(formatter: Formatter<any>);
    read(node: HTMLElement): {
        formatter: Formatter<any>;
        value: string | number;
    };
}
export declare const colorFormatLoader: ColorFormatLoader;
export {};
