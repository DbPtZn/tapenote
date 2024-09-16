import { StyleValue } from '@viewfly/platform-browser';
import { Props } from '@viewfly/core';
export interface ComponentToolbarProps extends Props {
    visible?: boolean;
    style?: StyleValue;
    innerStyle?: StyleValue;
}
export declare function ComponentToolbar(props: ComponentToolbarProps): () => import("@viewfly/core").JSXNode;
