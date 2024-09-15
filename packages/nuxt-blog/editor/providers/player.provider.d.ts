import { Injector, Observable } from '@textbus/core';

export interface CourseData {
    audio: string;
    duration: number;
    promoterSequence: Array<string>;
    keyframeSequence: Array<number>;
    subtitleSequence?: Array<string>;
    subtitleKeyframeSequence?: Array<number>;
}
export interface ParseData {
    audio: HTMLAudioElement;
    duration: number;
    animeElementSequence: NodeListOf<HTMLElement>[];
    keyframeSequence: Array<number>;
    subtitleSequence?: Array<string>;
    subtitleKeyframeSequence?: Array<number>;
}
export declare class Player {
    private stateUpdateEvent;
    onStateUpdate: Observable<any>;
    private subtitleUpdataEvent;
    onSubtitleUpdate: Observable<any>;
    private rateChangeEvent;
    onRateChange: Observable<any>;
    private volumeChangeEvent;
    onVolumeChange: Observable<any>;
    private playOverEvent;
    onPlayOver: Observable<any>;
    private injector;
    private anime;
    private data;
    sourceData: CourseData[];
    private scrollerRef;
    private rootRef;
    private containerRef;
    private subs;
    private scrollerSub;
    private timer;
    private scrollTimer;
    /** 公开状态 */
    subtitle: string;
    rate: number;
    volume: number;
    isPlaying: boolean;
    isPause: boolean;
    currentTime: number;
    totalTime: number;
    scrollTop: number;
    /** 临时记录 */
    private total;
    private animeCount;
    private subtitleCount;
    private keyframeHistory;
    /** 微课数据 */
    private audio;
    private duration;
    private keyframeSequence;
    private subtitleSequence;
    private subtitleKeyframeSequence;
    private animeElementSequence;
    constructor();
    setup(injector: Injector, scrollerRef: HTMLElement, containerRef?: HTMLElement): void;
    loadData(data: CourseData[]): Promise<ParseData[]>;
    /** 递归播放多个项目 */
    private playMulti;
    /** 启动播放 */
    start(): void;
    /** 从此处开始 */
    startHere(startTime: number, startIndex: number): void;
    /** 暂停 */
    pause(): void;
    /** 继续播放 */
    resume(): void;
    /** 倒回 */
    rewind(): void;
    /** 快进 */
    forward(): void;
    /** 加速 */
    speedUp(): void;
    /** 减速 */
    speedDown(): void;
    /** 增大音量 */
    volumeUp(): void;
    /** 降低音量 */
    volumeDown(): void;
    /** 重播 */
    replay(): void;
    /** 终止 */
    stop(): void;
    /** 清理播放器数据状态 */
    private clear;
    /** 初始化 */
    private init;
    private hideIgnoreComponent;
    private showIgnoreComponent;
    /** 设置动画可见状态 */
    private setAnimeVisible;
    /** 动画播放函数 */
    private applyPlay;
    /** 应用动画播放控制 */
    private applyAnime;
    /** 应用页面滚动 */
    private applyScroll;
    /** 翻页播放模式（待开发） */
    private applyFilpPlay;
    /** 应用翻页（待开发） */
    private applyFlip;
    /** 立即取消当前滚动事务 */
    private clearInterval;
    /**
     * 应用原生页面滚动
     * @param el 元素对象
     * @param scrollerRef // 滚动层
     * @param offset // 偏移值
     */
    private applyNativeScroll;
    /** 将片段数据解析成播放所需数据 */
    parseData(data: {
        audio: string;
        duration: number;
        promoters: Array<string | null>;
        timestamps: Array<number>;
    }): CourseData;
    /** 将音频时长（duration）转化成 HH:MM:SS 格式 */
    durationFormat(duration: number): string;
    destory(): void;
}
