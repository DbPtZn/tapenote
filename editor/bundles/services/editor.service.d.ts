import { Subject } from '@textbus/core';
export declare class EditorService {
    hideInlineToolbar: boolean;
    canShowLeftToolbar: boolean;
    onLeftToolbarCanVisibleChange: Subject<void>;
    changeLeftToolbarVisible(b: boolean): void;
}
