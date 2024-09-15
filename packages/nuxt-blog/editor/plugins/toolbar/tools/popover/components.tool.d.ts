import { PopoverTool, PopoverToolConfig } from '../../toolkit';
import { ComponentInstance, Injector } from '@textbus/core';

export interface ComponentCreator {
    example: string | HTMLElement;
    name: string;
    factory(injector: Injector): ComponentInstance | Promise<ComponentInstance>;
}
export declare function componentsToolConfigFactory(injector: Injector): PopoverToolConfig;
export declare function componentsTool(): PopoverTool;
