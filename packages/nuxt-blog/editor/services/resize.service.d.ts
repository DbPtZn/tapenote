import { Observable } from '@textbus/core';

export declare class ResizeService {
    private resizeEvent;
    onResize: Observable<any>;
    constructor();
    handleResize(value: any): void;
    destory(): void;
}
