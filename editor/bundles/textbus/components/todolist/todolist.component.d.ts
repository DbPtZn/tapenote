import { Component, ComponentStateLiteral, ContentType, Slot, Textbus, ZenCodingGrammarInterceptor } from '@textbus/core';
import { ComponentLoader } from '@textbus/platform-browser';
import { ViewComponentProps } from '@textbus/adapter-viewfly';
import './todolist.component.scss';
export interface TodolistComponentState {
    checked: boolean;
    slot: Slot;
}
export declare class TodolistComponent extends Component<TodolistComponentState> {
    static type: ContentType;
    static componentName: string;
    static zenCoding: ZenCodingGrammarInterceptor<TodolistComponentState>;
    static fromJSON(textbus: Textbus, json: ComponentStateLiteral<TodolistComponentState>): TodolistComponent;
    setup(): void;
}
export declare function TodolistView(props: ViewComponentProps<TodolistComponent>): () => any;
export declare const todolistComponentLoader: ComponentLoader;
