import { Injector, Plugin, ComponentInstance } from '@textbus/core';

export declare class AnimeContextmenuPlugin implements Plugin {
    private commander;
    private selection;
    private renderer;
    private subs;
    private contextmenu;
    private anime;
    private animeOptions;
    private scrollSubscription;
    private injector;
    private container;
    private scrollerRef;
    private showRef;
    private xRef;
    private yRef;
    private Options;
    private host;
    setup(injector: Injector): void;
    show(): void;
    hide(): void;
    createFormatMenu(target: HTMLElement): {
        x: number;
        y: number;
        options: ({
            key: string;
            label: string;
            props: {
                onClick: () => void;
            };
            children?: undefined;
        } | {
            key: string;
            label: string;
            children: {
                key: string;
                type: string;
                render: () => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
                    [key: string]: any;
                }>;
            }[];
            props?: undefined;
        })[];
    };
    createComponentMenu(target: HTMLElement, component: ComponentInstance): {
        x: number;
        y: number;
        options: ({
            key: string;
            label: string;
            props: {
                onClick: () => void;
            };
            children?: undefined;
        } | {
            key: string;
            label: string;
            children: {
                key: string;
                type: string;
                render: () => import('vue').VNode<import('vue').RendererNode, import('vue').RendererElement, {
                    [key: string]: any;
                }>;
            }[];
            props?: undefined;
        })[];
    };
    /** 更新动画特效 */
    updataAnimeFormatter(dom: HTMLElement, option: {
        name: string;
        value: string;
    }): void;
    updataAnimeComponent(component: ComponentInstance, option: {
        name: string;
        value: string;
    }): void;
    /** 移除动画标记 */
    removeAnimeFormatter(dom: HTMLElement): void;
    removeAnimeComponent(component: ComponentInstance): void;
    /** 测试动画效果 */
    playAnime(target: HTMLElement, effect: string): void;
    onDestroy(): void;
}
