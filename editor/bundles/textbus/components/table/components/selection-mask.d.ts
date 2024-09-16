import { StaticRef } from '@viewfly/core';
import { TableComponent } from '../table.component';
export interface TableSelection {
    startRow: number;
    endRow: number;
    startColumn: number;
    endColumn: number;
}
export interface SelectionMaskProps {
    component: TableComponent;
    tableRef: StaticRef<HTMLTableElement>;
}
export declare function SelectionMask(props: SelectionMaskProps): () => import("@viewfly/core").JSXNode;
