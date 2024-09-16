import { Signal } from '@viewfly/core';
import { TableComponent } from '../table.component';
export interface TopBarProps {
    isFocus: Signal<boolean>;
    component: TableComponent;
    layoutWidth: Signal<number[]>;
}
export declare function TopBar(props: TopBarProps): () => import("@viewfly/core").JSXNode;
