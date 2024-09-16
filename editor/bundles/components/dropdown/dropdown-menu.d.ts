import { Props, StaticRef } from '@viewfly/core';
export interface DropdownMenuProps extends Props {
    abreast?: boolean;
    triggerRef: StaticRef<HTMLElement>;
    width?: string;
    noTrigger?: boolean;
    padding?: string;
    toLeft?: boolean;
}
export declare const DropdownMenuPortal: (props: DropdownMenuProps) => {
    $portalHost: HTMLElement;
    $render: () => import("@viewfly/core").ViewFlyNode;
};
