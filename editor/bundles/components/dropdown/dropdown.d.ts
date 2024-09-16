import { JSXNode, Props } from '@viewfly/core';
import { HTMLAttributes } from '@viewfly/platform-browser';
export type DropdownTriggerTypes = 'hover' | 'click' | 'none';
export interface DropdownMenu {
    disabled?: boolean;
    label: JSXNode;
    value: any;
}
export interface DropdownProps extends Props {
    trigger?: DropdownTriggerTypes;
    menu: DropdownMenu[] | JSXNode;
    width?: string;
    class?: HTMLAttributes<HTMLElement>['class'];
    style?: HTMLAttributes<HTMLElement>['style'];
    abreast?: boolean;
    padding?: string;
    toLeft?: boolean;
    onCheck?(value: any): void;
    onExpendStateChange?(is: boolean): void;
}
export declare const Dropdown: (props: DropdownProps) => {
    isShow(b: boolean): void;
    $render: () => JSXNode;
};
