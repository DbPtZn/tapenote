import { VElement, Observable } from '@textbus/core';

export declare class AnimeEventService {
    onAnimeContextmenu: Observable<{
        vdom: VElement;
        event: MouseEvent;
    }>;
    private AnimeContextmenuEvent;
    private sub;
    constructor();
    destory(): void;
}
