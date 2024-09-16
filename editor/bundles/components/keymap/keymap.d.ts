import { Keymap } from '@textbus/core';
import { JSXNode } from '@viewfly/core';
export interface KeymapProps {
    keymap: Keymap;
}
export declare function Keymap(props: KeymapProps): () => JSXNode;
