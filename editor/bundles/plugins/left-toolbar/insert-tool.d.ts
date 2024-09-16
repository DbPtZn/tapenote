import { Slot } from '@textbus/core';
export interface InsertToolProps {
    slot: Slot | null;
    hideTitle?: boolean;
    replace?: boolean;
}
export declare function InsertTool(props: InsertToolProps): () => import("@viewfly/core").JSXNode;
