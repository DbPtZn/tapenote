import { Observable } from '@textbus/core';

export interface IUploadFunction {
    (base64Data: string): Promise<string>;
}
interface Task {
    base64Data: string;
    resolve: (url: string) => void;
    reject: (err: Error) => void;
}
export declare class ImgToUrlService {
    private uploadFunction;
    private finishEvent;
    onFinish: Observable<any>;
    private errorEvent;
    onError: Observable<any>;
    queue: Task[];
    tasks: number;
    maxConcurrency: number;
    isRunning: number;
    constructor();
    setup(uploadFunction: IUploadFunction, maxConcurrency?: number): void;
    /** 加入图片转化的进程 (需要同时处理多张图片的情况) */
    addUploadProcess(base64Data: string, success: (url: string) => void, error?: (err: any) => void): void;
    /** 独立上传图片 (在图片工具中上传图片时使用) */
    uploadImg(img: string): Promise<string>;
    /** 添加任务 */
    private addTask;
    private processQueue;
    /** 任务完成 */
    private finish;
    /** 任务出错 */
    private error;
    /** 检查进度： 如果任务数为0，任务完成 */
    private checkProcess;
    private uploadTask;
    static isBase64(str: string): boolean;
    destory(): void;
}
export {};
