import { Component, ComponentStateLiteral, ContentType, Slot, Subject, Textbus } from '@textbus/core';
import { TableSelection } from './components/selection-mask';
export interface TableCellConfig {
    rowspan: number;
    colspan: number;
    slot: Slot;
}
export interface Row {
    height: number;
    cells: TableCellConfig[];
}
export interface TableComponentState {
    layoutWidth: number[];
    rows: Row[];
}
export declare class TableComponent extends Component<TableComponentState> {
    static componentName: string;
    static type: ContentType;
    static fromJSON(textbus: Textbus, json: ComponentStateLiteral<TableComponentState>): TableComponent;
    private selection;
    constructor(textbus: Textbus, state?: TableComponentState);
    focus: Subject<boolean>;
    tableSelection: import("@viewfly/core").Signal<TableSelection | null>;
    setup(): void;
    deleteColumn(index: number): void;
    deleteRow(index: number): void;
    insertColumn(index: number): void;
    insertRow(index: number): void;
}
