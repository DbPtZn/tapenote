import { Injector, Plugin } from '@textbus/core';

export declare class AnimeComponentSupport implements Plugin {
    private app;
    private host;
    private viewDocument;
    constructor();
    setup(injector: Injector): void;
    onDestroy(): void;
}
