import { Props } from '@viewfly/core';
export interface PopupProps extends Props {
    left: number;
    top: number;
}
export declare function Popup(props: PopupProps): {
    $portalHost: HTMLElement;
    $render: () => import("@viewfly/core").ViewFlyNode;
};
