import { Component, ComponentStateLiteral, ContentType, DeltaLite, Slot, Textbus } from '@textbus/core';
import { ComponentLoader } from '@textbus/platform-browser';
import { ViewComponentProps } from '@textbus/adapter-viewfly';
import './paragraph.component.scss';
export interface ParagraphComponentState {
    slot: Slot;
}
export declare class ParagraphComponent extends Component<ParagraphComponentState> {
    static componentName: string;
    static type: ContentType;
    static fromJSON(textbus: Textbus, json: ComponentStateLiteral<ParagraphComponentState>): ParagraphComponent;
    constructor(textbus: Textbus, state?: ParagraphComponentState);
    setup(): void;
}
export declare function ParagraphView(props: ViewComponentProps<ParagraphComponent>): () => any;
export declare const paragraphComponentLoader: ComponentLoader;
export declare function deltaToBlock(delta: DeltaLite, textbus: Textbus): Component<import("@textbus/core").State>[];
