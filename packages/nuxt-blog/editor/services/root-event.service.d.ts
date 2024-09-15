import { Observable } from '@textbus/core';

export declare class RootEventService {
    onComponentContextmenu: Observable<MouseEvent | null>;
    private componentContextmenuEvent;
    constructor();
    handleContextmenu(ev: MouseEvent): void;
    destory(): void;
}
