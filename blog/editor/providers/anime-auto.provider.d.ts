import { ComponentInstance, Injector, Slot } from '@textbus/core';

export declare class AnimeAutoProvider {
    private commander;
    private selection;
    private renderer;
    private rootComponent;
    private anime;
    private addAnimeService;
    private animeUtilsProvider;
    private structurer;
    private injector;
    constructor();
    setup(injector: Injector): void;
    /**
     * 自动添加动画预设
     * @param selectAnimeOption 指定一种动画，如果提供该选项，则所有自动添加的预设都会采用该动画
     */
    autoAdd(selectAnimeOption?: {
        key: string;
        value: {
            name: string;
        };
    }): void;
    /**
     * 添加组件动画
     * @param componentInstance 组件
     * @param selectAnimeOption 指定一种动画，不传的时候会在动画列表中随机选择
     */
    addComponentAnime(componentInstance: ComponentInstance | null, selectAnimeOption?: {
        key: string;
        value: {
            name: string;
        };
    }): void;
    /**
     * 添加格式动画
     * @param slot 插槽
     * @param selectAnimeOption 指定一种动画，不传的时候会在动画列表中随机选择
     */
    addFormatterAnime(slot: Slot, selectAnimeOption?: {
        key: string;
        value: {
            name: string;
        };
    }): void;
    destory(): void;
}
