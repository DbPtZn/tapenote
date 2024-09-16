import { Props } from '@viewfly/core';
import { Slot } from '@textbus/core';
import { HTMLAttributes } from '@viewfly/platform-browser';
import { DropdownProps } from '../../components/dropdown/dropdown';
export interface ColorToolProps extends Props {
    abreast?: DropdownProps['abreast'];
    style?: HTMLAttributes<HTMLElement>['style'];
    slot?: Slot | null;
    applyBefore?(): void;
}
export declare function ColorTool(props: ColorToolProps): () => import("@viewfly/core").JSXNode;
