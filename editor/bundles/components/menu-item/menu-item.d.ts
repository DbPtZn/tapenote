import { Props, JSXNode } from '@viewfly/core';
export interface MenuItemProps extends Props {
    disabled?: boolean;
    checked?: boolean;
    icon?: JSXNode;
    value?: any;
    arrow?: boolean;
    desc?: JSXNode;
    onClick?(value: any): void;
}
export declare function MenuItem(props: MenuItemProps): () => JSXNode;
