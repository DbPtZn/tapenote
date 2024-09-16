import { Component, ComponentStateLiteral, ContentType, Slot, Textbus, ZenCodingGrammarInterceptor } from '@textbus/core';
import { ComponentLoader } from '@textbus/platform-browser';
import { ViewComponentProps } from '@textbus/adapter-viewfly';
import './blockquote.component.scss';
export interface BlockquoteComponentState {
    slot: Slot;
}
export declare class BlockquoteComponent extends Component<BlockquoteComponentState> {
    static type: ContentType;
    static componentName: string;
    static zenCoding: ZenCodingGrammarInterceptor<BlockquoteComponentState>;
    static fromJSON(textbus: Textbus, json: ComponentStateLiteral<BlockquoteComponentState>): BlockquoteComponent;
    constructor(textbus: Textbus, state?: BlockquoteComponentState);
    setup(): void;
}
export declare function toBlockquote(textbus: Textbus): void;
export declare function registerBlockquoteShortcut(textbus: Textbus): void;
export declare function BlockquoteView(props: ViewComponentProps<BlockquoteComponent>): () => any;
export declare const blockquoteComponentLoader: ComponentLoader;
