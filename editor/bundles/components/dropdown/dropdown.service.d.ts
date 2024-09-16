import { Observable } from '@textbus/core';
export declare class DropdownService {
    onSiblingOpen: Observable<number>;
    private siblingOpenEvent;
    constructor();
    notify(id: number): void;
}
