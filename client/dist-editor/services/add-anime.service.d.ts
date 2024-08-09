import { ComponentInstance, Observable } from '@textbus/core';

export declare class AddAnimeService {
    onComponentActive: Observable<ComponentInstance | null>;
    private componentActiveEvent;
    constructor();
    updateActiveComponent(component: ComponentInstance | null): void;
    destory(): void;
}
