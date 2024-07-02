import { Plugin, Injector } from '@textbus/core';

export declare class ContextMenu implements Plugin {
    private eventFromSelf;
    private subs;
    private menuSubscriptions;
    private submenuSubscriptions;
    private menu;
    private submenu;
    setup(injector: Injector): void;
    destroy(): void;
    private show;
    private hide;
}
