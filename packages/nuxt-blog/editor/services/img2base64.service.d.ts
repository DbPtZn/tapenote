import { Observable } from '@textbus/core';

export declare class Img2base64Service {
    private finishEvent;
    onFinish: Observable<any>;
    private errorEvent;
    onError: Observable<any>;
    promiseSequence: Promise<any>[];
    tasks: number;
    constructor();
    /** 添加任务 */
    addTask(): void;
    /** 移出任务 */
    removeTask(): void;
    /** 任务完成 */
    finish(): void;
    /** 任务出错 */
    error(msg: string): void;
    /** 检查进度： 如果任务数为0，任务完成 */
    checkProcess(): void;
    /** 加入图片转化的进程 */
    addProcess(url: string, callback: (base64: string) => void): void;
    /**
     * 图片url链接转base64
     * @param {String} url 图片链接
     * @returns 转base64后的值或者报错信息
     */
    imgUrlToBase64: (url: string) => Promise<string>;
    destory(): void;
}
