import { AxiosInstance } from 'axios';

export declare class AxiosProvider {
    axios: AxiosInstance | null;
    uploadImgUrl: string;
    constructor();
    set(args: {
        hostname: string;
        accessToken: string;
        uploadImgUrl: string;
    }): void;
    uploadImg(img: string): Promise<string>;
    destory(): void;
}
