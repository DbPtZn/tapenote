import { Observable } from '@textbus/core';

export declare class OutlineService {
    isExpanded: boolean;
    private expandEvent;
    onExpand: Observable<boolean>;
    constructor();
    setup(initExpanded: boolean): void;
    handleExpand(): void;
    destory(): void;
}
