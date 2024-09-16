import { Subject, Textbus } from '@textbus/core';
export declare class KatexEditor extends Textbus {
    host: HTMLElement;
    onValueChange: Subject<string>;
    constructor();
    mount(host: HTMLElement, code: string): Promise<this>;
}
