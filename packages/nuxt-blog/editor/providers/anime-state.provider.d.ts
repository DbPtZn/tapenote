import { Injector } from '@textbus/core';

interface AnimeState {
    id?: string;
    effect?: string;
    serial?: number;
    state?: 'active' | 'inactive';
    title?: string;
}
/** 控制管理动画状态 */
export declare class AnimeStateProvider {
    private commander;
    private selection;
    private renderer;
    private container;
    private input;
    constructor();
    setup(injector: Injector, scrollerRef?: HTMLElement): void;
    setActive(aniId: string): void;
    setInactive(aniId: string): void;
    updateSerial(aniId: string, serial: number): void;
    /** 更新动画的状态 */
    handleStateUpdate(element: HTMLElement, aniId: string, state: AnimeState): void;
    setFormatterState(element: HTMLElement, state: AnimeState): void;
    setComponentStateByElement(element: HTMLElement, state: AnimeState): void;
    destory(): void;
}
export {};
/** AnimeStateProvider for State Control and Check  （组件内代码）*/
