import { ComponentLoader } from '@textbus/platform-browser';
import { ComponentInitData, ComponentInstance, VElement } from '@textbus/core';

export interface ImageCardComponentState {
    src: string;
    height: string;
}
export declare const imageCardComponent: import('@textbus/core').Component<ComponentInstance<{
    render(slotRender: import('@textbus/core').SlotRender): VElement;
}, ImageCardComponentState, unknown>, ComponentInitData<ImageCardComponentState, unknown>>;
export declare const imageCardComponentLoader: ComponentLoader;
