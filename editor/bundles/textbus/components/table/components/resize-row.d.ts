import { StaticRef } from '@viewfly/core';
import { TableComponent } from '../table.component';
export interface ResizeRowProps {
    tableRef: StaticRef<HTMLTableElement>;
    component: TableComponent;
}
export declare function ResizeRow(props: ResizeRowProps): () => import("@viewfly/core").JSXNode;
