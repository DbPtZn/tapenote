import { FormatLoader } from '@textbus/platform-browser';
import { VElement, Formatter, Observable, VTextNode, RenderMode } from '@textbus/core';

export declare const onAnimePlayerFormatterContextmenu: Observable<{
    vdom: VElement;
    event: MouseEvent;
}>;
export declare class AnimePlayerFormatter implements Formatter<any> {
    name: string;
    tagName: string;
    columned: boolean;
    priority: number;
    render(children: Array<VElement | VTextNode>, formatValue: Record<string, string>, renderMode: RenderMode): VElement;
}
export declare const animePlayerFormatter: AnimePlayerFormatter;
export declare const animePlayerFormatLoader: FormatLoader<any>;
