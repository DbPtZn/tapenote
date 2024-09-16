import { Component, ComponentStateLiteral, ContentType, Textbus } from '@textbus/core';
import { ViewComponentProps } from '@textbus/adapter-viewfly';
import { ComponentLoader } from '@textbus/platform-browser';
import './image.component.scss';
export interface ImageComponentState {
    src: string;
    width?: string;
    height?: string;
}
export declare class ImageComponent extends Component<ImageComponentState> {
    static type: ContentType;
    static componentName: string;
    static fromJSON(textbus: Textbus, json: ComponentStateLiteral<ImageComponentState>): ImageComponent;
}
export declare function ImageView(props: ViewComponentProps<ImageComponent>): () => any;
export declare const imageComponentLoader: ComponentLoader;
