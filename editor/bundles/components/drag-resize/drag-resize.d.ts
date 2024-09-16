import { Props, StaticRef } from '@viewfly/core';
import { ImageComponent } from '../../textbus/components/image/image.component';
import { VideoComponent } from '../../textbus/components/video/video.component';
export interface DragResizeProps extends Props {
    component: ImageComponent | VideoComponent;
    source: StaticRef<HTMLImageElement | HTMLVideoElement>;
}
export declare function DragResize(props: DragResizeProps): () => import("@viewfly/core").JSXNode;
