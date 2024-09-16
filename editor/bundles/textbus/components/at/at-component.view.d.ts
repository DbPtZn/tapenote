import { ViewComponentProps } from '@textbus/adapter-viewfly';
import { ComponentLoader } from '@textbus/platform-browser';
import { AtComponent } from './at.component';
import './at.component.scss';
export declare function AtComponentView(props: ViewComponentProps<AtComponent>): () => any;
export declare const atComponentLoader: ComponentLoader;
