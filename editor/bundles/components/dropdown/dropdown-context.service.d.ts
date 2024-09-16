import { Injector } from '@viewfly/core';
import { Observable } from '@textbus/core';
import { DropdownService } from './dropdown.service';
export declare class DropdownContextService {
    private dropdownService;
    private injector;
    id: number;
    isOpen: boolean;
    onOpenStateChange: Observable<boolean>;
    canHide: boolean;
    private openStateChangeEvent;
    private timer;
    private parentDropdownContextService;
    constructor(dropdownService: DropdownService, injector: Injector);
    open(): void;
    hide(delay?: boolean): void;
}
