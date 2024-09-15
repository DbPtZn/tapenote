import { ComponentLoader } from '@textbus/platform-browser';
import { ComponentInitData, ComponentInstance, Slot, VElement, RenderMode, Injector } from '@textbus/core';

export interface JumbotronComponentState {
    minHeight: string;
    backgroundImage: string;
    backgroundSize: string;
    backgroundPosition: string;
}
export declare function createJumbotronSlot(injector: Injector): Slot<any>;
export declare const jumbotronComponent: import('@textbus/core').Component<ComponentInstance<{
    render(slotRender: import('@textbus/core').SlotRender, renderMode: RenderMode): VElement;
}, JumbotronComponentState, unknown>, ComponentInitData<JumbotronComponentState, unknown>>;
export declare const jumbotronComponentLoader: ComponentLoader;
