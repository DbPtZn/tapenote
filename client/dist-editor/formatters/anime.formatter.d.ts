import { FormatLoader } from '@textbus/platform-browser';
import { VElement, Formatter, VTextNode, RenderMode } from '@textbus/core';

export declare class AnimeFormatter implements Formatter<any> {
    name: string;
    tagName: string;
    columned: boolean;
    priority: number;
    render(children: Array<VElement | VTextNode>, formatValue: Record<string, string>, renderMode: RenderMode): VElement;
}
export declare const animeFormatter: AnimeFormatter;
export declare const animeFormatLoader: FormatLoader<any>;
