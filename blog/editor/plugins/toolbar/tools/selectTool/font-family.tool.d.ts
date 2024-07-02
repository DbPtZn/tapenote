import { SelectTool, SelectToolConfig } from '../../toolkit/select-tool';
import { Injector } from '@textbus/core';

export declare const isSupportFont: (fontName: string) => boolean;
export declare function fontFamilyToolConfigFactory(injector: Injector): SelectToolConfig;
export declare function fontFamilyTool(): SelectTool;
