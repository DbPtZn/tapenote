import { Subject } from '@textbus/core';
export declare class TableService {
    onInsertRowBefore: Subject<number | null>;
    onInsertColumnBefore: Subject<number | null>;
    onSelectColumns: Subject<{
        start: number;
        end: number;
    } | null>;
    onSelectRows: Subject<{
        start: number;
        end: number;
    } | null>;
    onScroll: Subject<number>;
}
