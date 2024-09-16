import { Component, ComponentStateLiteral, ContentType, Textbus } from '@textbus/core';
import { ViewComponentProps } from '@textbus/adapter-viewfly';
import { ComponentLoader } from '@textbus/platform-browser';
import './katex.component.scss';
export interface KatexComponentState {
    text: string;
}
export declare class KatexComponent extends Component<KatexComponentState> {
    static componentName: string;
    static type: ContentType;
    static fromJSON(textbus: Textbus, state: ComponentStateLiteral<KatexComponentState>): KatexComponent;
    constructor(textbus: Textbus, state?: KatexComponentState);
}
export declare function KatexComponentView(props: ViewComponentProps<KatexComponent>): () => any;
export declare const katexComponentLoader: ComponentLoader;
