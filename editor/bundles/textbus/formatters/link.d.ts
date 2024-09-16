import { Formatter } from '@textbus/core';
import { FormatLoader } from '@textbus/platform-browser';
export interface LinkFormatData {
    href: string;
    target?: '_blank' | '_self';
}
export declare const linkFormatter: Formatter<LinkFormatData>;
export declare const linkFormatLoader: FormatLoader<LinkFormatData>;
