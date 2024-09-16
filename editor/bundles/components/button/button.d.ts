import { ButtonHTMLAttributes } from '@viewfly/platform-browser';
import { Props } from '@viewfly/core';
export interface ButtonProps extends Props, ButtonHTMLAttributes<HTMLButtonElement> {
    highlight?: boolean;
    arrow?: boolean;
    ordinary?: boolean;
}
export declare function Button(props: ButtonProps): () => import("@viewfly/core").JSXNode;
