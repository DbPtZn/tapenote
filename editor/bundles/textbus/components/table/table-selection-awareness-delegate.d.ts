import { CollaborateSelectionAwarenessDelegate, DomAdapter } from '@textbus/platform-browser';
import { AbstractSelection, Slot, Selection } from '@textbus/core';
import { TableComponent } from './table.component';
export declare function findFocusCell(table: TableComponent, slot: Slot): Slot | null;
export declare class TableSelectionAwarenessDelegate extends CollaborateSelectionAwarenessDelegate {
    private domAdapter;
    private selection;
    constructor(domAdapter: DomAdapter, selection: Selection);
    getRects(abstractSelection: AbstractSelection): false | {
        left: number;
        top: number;
        width: number;
        height: number;
    }[];
}
