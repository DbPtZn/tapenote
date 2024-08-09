import { Injector, Plugin } from '@textbus/core';

export declare class PlayerContextMenuPlugin implements Plugin {
    private app;
    private host;
    private viewDocument;
    constructor();
    setup(injector: Injector): void;
    onDestroy(): void;
}
