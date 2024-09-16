import { Props, Signal } from '@viewfly/core';
export interface ScrollProps extends Props {
    isFocus: Signal<boolean>;
}
export declare function Scroll(props: ScrollProps): () => import("@viewfly/core").JSXNode;
