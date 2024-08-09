import { Injector, Slots } from '@textbus/core';

/**
 * 本换行方法只为段落、标题和块组件设计，主要作用是在实现换行功能同时，可以跳出两层组件。
 * 如，在引用块里的段落，当尾部的两个段落都为空，且再次触发换行时，则把新的段落插入在引用块后
 * @param injector
 * @param slots
 */
export declare function useEnterBreaking(injector: Injector, slots: Slots): void;
