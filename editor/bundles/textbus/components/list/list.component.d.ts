import { Component, ComponentStateLiteral, ContentType, Slot, Textbus, ZenCodingGrammarInterceptor } from '@textbus/core';
import { ViewComponentProps } from '@textbus/adapter-viewfly';
import { ComponentLoader } from '@textbus/platform-browser';
import './list.component.scss';
export interface ListComponentState {
    type: 'OrderedList' | 'UnorderedList';
    slot: Slot;
    reorder: boolean;
}
export declare function toList(textbus: Textbus, type: 'OrderedList' | 'UnorderedList'): void;
export declare function registerListShortcut(textbus: Textbus): void;
export declare class ListComponent extends Component<ListComponentState> {
    static componentName: string;
    static type: ContentType;
    static zenCoding: ZenCodingGrammarInterceptor<ListComponentState>;
    static fromJSON(textbus: Textbus, json: ComponentStateLiteral<ListComponentState>): ListComponent;
    setup(): void;
}
export declare function ListComponentView(props: ViewComponentProps<ListComponent>): () => any;
export declare const listComponentLoader: ComponentLoader;
