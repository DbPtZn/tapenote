import { Signal, StaticRef } from '@viewfly/core';
import { TableComponent } from '../table.component';
export interface ResizeColumnProps {
    tableRef: StaticRef<HTMLTableElement>;
    component: TableComponent;
    layoutWidth: Signal<number[]>;
    onActiveStateChange(isActive: boolean): void;
}
export declare function ResizeColumn(props: ResizeColumnProps): () => import("@viewfly/core").JSXNode;
