import { ComponentLoader } from '@textbus/platform-browser';
import { ComponentInitData, ComponentInstance, Formatter, RenderMode, Slot, SlotRender, VElement, VTextNode } from '@textbus/core';

export declare const codeStyles: {
    keyword: string;
    string: string;
    function: string;
    number: string;
    tag: string;
    comment: string;
    boolean: string;
    operator: boolean;
    builtin: string;
    punctuation: boolean;
    regex: string;
    selector: string;
    property: string;
    'class-name': string;
    'attr-name': string;
    'attr-value': string;
    'template-punctuation': string;
};
export declare const languageList: Array<{
    label: string;
    value: string;
}>;
export interface PreComponentState {
    lang: string;
    theme?: string;
}
export declare class CodeStyleFormatter implements Formatter<string> {
    priority: number;
    name: string;
    columned: boolean;
    render(children: Array<VElement | VTextNode>, formatValue: string): VElement;
}
export declare const codeStyleFormatter: CodeStyleFormatter;
export interface CodeSlotState {
    blockCommentEnd: boolean;
    blockCommentStart: boolean;
    emphasize: boolean;
}
export declare function createCodeSlot(): Slot<CodeSlotState>;
export declare const preComponent: import('@textbus/core').Component<ComponentInstance<{
    render(slotRender: SlotRender, renderMode: RenderMode): VElement;
}, PreComponentState, CodeSlotState>, ComponentInitData<PreComponentState, CodeSlotState>>;
export declare const preComponentLoader: ComponentLoader;
