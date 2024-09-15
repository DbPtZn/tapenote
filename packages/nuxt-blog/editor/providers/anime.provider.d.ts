import { default as anime } from 'animejs';

interface AnimeOption {
    label: string;
    value: string;
    applyEffect: (target: HTMLElement) => void;
    disabled: boolean;
    default?: boolean;
}
export declare class AnimeProvider {
    effectsMap: Map<string, {
        name: string;
        applyEffect: (target: Element) => anime.AnimeInstance;
    }>;
    constructor();
    getAnime(key: string): {
        name: string;
        applyEffect: (target: Element) => anime.AnimeInstance;
    } | undefined;
    getOptions(): AnimeOption[];
    getRandomAnime(): {
        key: string;
        value: {
            name: string;
            applyEffect?: ((target: Element) => anime.AnimeInstance) | undefined;
        };
    };
    destory(): void;
}
export {};
