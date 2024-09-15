import { SwitchButtonState, SwitchButtonTool, SwitchButtonToolConfig } from '../toolbar';
import { Injector } from '@textbus/core';

export declare function outlineToolConfigFactory(injector: Injector, updateState: (state: SwitchButtonState) => void): SwitchButtonToolConfig;
export declare function outlineTool(): SwitchButtonTool;
