import { VNode } from 'vue';
import { Injector } from '@textbus/core';

export interface Tool {
    setup(injector: Injector, limitElement: HTMLElement): VNode;
    refreshState(): void;
    disabled(is: boolean): void;
    onDestroy?(): void;
}
