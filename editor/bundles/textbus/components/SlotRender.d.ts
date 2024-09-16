import { Slot } from '@textbus/core';
import { DynamicRef } from '@viewfly/core';
import { HTMLAttributes } from '@viewfly/platform-browser';
interface Props extends HTMLAttributes<unknown> {
    slot: Slot;
    /** 默认值为 div */
    tag?: string;
    class?: string;
    renderEnv?: boolean;
    elRef?: DynamicRef<HTMLElement>;
    elKey?: number | string;
}
export declare function SlotRender(props: Props): () => any;
export {};
