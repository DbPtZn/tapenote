import { Injector, Plugin } from '@textbus/core';

export declare class AnimeClickPlugin implements Plugin {
    private commander;
    private selection;
    private renderer;
    private subs;
    private injector;
    private document;
    setup(injector: Injector): void;
    onDestroy(): void;
}
