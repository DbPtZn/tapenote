import { Component, ComponentStateLiteral, ContentType, Textbus } from '@textbus/core';
import { ViewComponentProps } from '@textbus/adapter-viewfly';
import { ComponentLoader } from '@textbus/platform-browser';
import './video.component.scss';
export interface VideoComponentState {
    src: string;
    width?: string;
    height?: string;
}
export declare class VideoComponent extends Component<VideoComponentState> {
    static type: ContentType;
    static componentName: string;
    static fromJSON(textbus: Textbus, json: ComponentStateLiteral<VideoComponentState>): VideoComponent;
    setup(): void;
}
export declare function VideoView(props: ViewComponentProps<VideoComponent>): () => any;
export declare const videoComponentLoader: ComponentLoader;
