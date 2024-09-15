import { Injector, ClassProvider } from '@textbus/core';

export declare class AnimeUtilsProvider {
    private containerRef;
    private renderer;
    private selection;
    private scrollerRef;
    private injector;
    constructor();
    setup(injector: Injector, scrollerRef: HTMLElement): void;
    /** 通过动画块 id 定位动画块位置 */
    locateAnimeBlock(aniId: string): void;
    /** 计算并返回新建动画标记的编号 */
    generateAnimeSerial(): number;
    /** 生成动画块 Id */
    generateAnimeId(): string;
    /**
     * 获取最外层（祖先）元素到顶部的距离
     * @param el 目标元素
     * @returns 返回距离
     */
    private getTopDistance;
    /**
     * 应用原生页面滚动
     * @param el 元素对象
     * @param scrollerRef // 滚动层
     * @param offset // 偏移值
     */
    private applyNativeScroll;
    destory(): void;
}
export declare const animeUtilsProvider: ClassProvider;
