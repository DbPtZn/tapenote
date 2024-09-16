import { Signal, StaticRef } from '@viewfly/core';
import { TableComponent } from '../table.component';
export interface TopBarProps {
    tableRef: StaticRef<HTMLTableElement>;
    isFocus: Signal<boolean>;
    component: TableComponent;
}
export declare function LeftBar(props: TopBarProps): () => import("@viewfly/core").JSXNode;
