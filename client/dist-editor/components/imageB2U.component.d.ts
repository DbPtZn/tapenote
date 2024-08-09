import { ComponentLoader } from '@textbus/platform-browser';
import { ComponentInitData, ComponentInstance, VElement } from '@textbus/core';

export interface ImageComponentLiteral {
    src: string;
    maxWidth?: string;
    maxHeight?: string;
    width?: string;
    height?: string;
    margin?: string;
    float?: string;
}
/**
 * 图片组件的功能规划：
 * 1. 将外源图片替换成内源图片（外源图片上传到服务端，返回图片的地址）
 * 2. 更新图片地址（内源图片，根据文件名、服务器、token等信息，查询内源图片地址，返回图片的地址）
 */
export declare const imageB2UComponent: import('@textbus/core').Component<ComponentInstance<{
    render(): VElement;
}, ImageComponentLiteral, unknown>, ComponentInitData<ImageComponentLiteral, unknown>>;
export declare const imageB2UComponentLoader: ComponentLoader;
