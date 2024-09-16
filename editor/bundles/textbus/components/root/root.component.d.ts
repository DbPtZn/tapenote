import { Component, CompositionStartEventData, ComponentStateLiteral, ContentType, Event, Slot, Subject, Textbus } from '@textbus/core';
import { ComponentLoader } from '@textbus/platform-browser';
import { ViewComponentProps } from '@textbus/adapter-viewfly';
import './root.component.scss';
export interface RootComponentState {
    content: Slot;
}
export declare class RootComponent extends Component<RootComponentState> {
    static componentName: string;
    static type: ContentType;
    static fromJSON(textbus: Textbus, json: ComponentStateLiteral<RootComponentState>): RootComponent;
    onCompositionStart: Subject<Event<Slot, CompositionStartEventData>>;
    setup(): void;
    afterCheck(): void;
}
export declare function RootView(props: ViewComponentProps<RootComponent>): () => any;
export declare const rootComponentLoader: ComponentLoader;
