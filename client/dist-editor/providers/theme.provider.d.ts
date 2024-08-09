import { Injector } from '@textbus/core';
import { Observable } from '@tanbo/stream';

type ThemeState = 'light' | 'dark';
/**
 * 主题控制器
 */
export declare class ThemeProvider {
    /** 主题配置 */
    private themeUpdateEvent;
    onThemeUpdate: Observable<ThemeState>;
    theme: ThemeState;
    private subs;
    private editorHost;
    private toolbarHost;
    private layout;
    constructor();
    setup(injector: Injector): void;
    /** 更新主题 */
    handleThemeUpdate(value: ThemeState): void;
    private updateTheme;
    destory(): void;
}
export {};
