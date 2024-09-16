import { Plugin } from '@textbus/core';
import { Injector } from '@viewfly/core';
export declare class LeftToolbarPlugin implements Plugin {
    private app;
    setup(injector: Injector): void;
    onDestroy(): void;
}
