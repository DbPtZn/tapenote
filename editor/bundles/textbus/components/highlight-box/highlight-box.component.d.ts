import { Component, ComponentStateLiteral, ContentType, Slot, Textbus } from '@textbus/core';
import { ViewComponentProps } from '@textbus/adapter-viewfly';
import { ComponentLoader } from '@textbus/platform-browser';
import './highlight.component.scss';
export interface HighlightBoxComponentState {
    type: string;
    slot: Slot;
}
export declare class HighlightBoxComponent extends Component<HighlightBoxComponentState> {
    static defaultTypes: string[];
    static componentName: string;
    static type: ContentType;
    static fromJSON(textbus: Textbus, json: ComponentStateLiteral<HighlightBoxComponentState>): HighlightBoxComponent;
    constructor(textbus: Textbus, state?: HighlightBoxComponentState);
    setup(): void;
}
export declare function HighlightBoxView(props: ViewComponentProps<HighlightBoxComponent>): () => any;
export declare const highlightBoxComponentLoader: ComponentLoader;
