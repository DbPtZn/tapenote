import { BehaviorSubject, Component, ComponentStateLiteral, ContentType, Slot, Textbus, ZenCodingGrammarInterceptor } from '@textbus/core';
import { ComponentLoader } from '@textbus/platform-browser';
import { ViewComponentProps } from '@textbus/adapter-viewfly';
import './source-code.component.scss';
export declare const languageList: Array<{
    label: string;
    value: string;
}>;
export declare const sourceCodeThemes: string[];
export interface SourceCodeComponentState {
    lang: string;
    theme?: string;
    lineNumber?: boolean;
    autoBreak?: boolean;
    slots: Array<{
        slot: Slot;
        emphasize: boolean;
    }>;
}
export interface CodeSlotState {
    emphasize: boolean;
    slot: Slot;
}
export declare class SourceCodeComponent extends Component<SourceCodeComponentState> {
    static type: ContentType;
    static componentName: string;
    static fromJSON(textbus: Textbus, json: ComponentStateLiteral<SourceCodeComponentState>): SourceCodeComponent;
    static zenCoding: ZenCodingGrammarInterceptor<SourceCodeComponentState>;
    focus: BehaviorSubject<boolean>;
    setup(): void;
    removeSlot(slot: Slot): boolean;
    cancelEmphasize: () => void;
    emphasize: () => void;
}
export declare function SourceCodeView(props: ViewComponentProps<SourceCodeComponent>): () => any;
export declare const sourceCodeComponentLoader: ComponentLoader;
