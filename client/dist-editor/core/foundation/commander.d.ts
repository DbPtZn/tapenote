import { Commander, Injector, Registry, RootComponentRef, Selection, Slot } from '@textbus/core';

export declare class CustomCommander extends Commander {
    constructor(selection: Selection, injector: Injector, registry: Registry, rootComponentRef: RootComponentRef);
    /**
     * 在当前选区粘贴新内容，当选区未闭合时，会先删除选区内容，再粘贴新内容
     * @param pasteSlot 要粘贴的数据
     * @param text 要粘贴的文本
     */
    paste(pasteSlot: Slot<any>, text: string): boolean;
}
