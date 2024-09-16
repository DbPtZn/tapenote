import { OutputTranslator } from '@viewfly/platform-browser';
import { ViewOptions } from '@textbus/platform-browser';
import { CollaborateConfig } from '@textbus/collaborate';
import { Textbus, TextbusConfig } from '@textbus/core';
import './assets/icons/style.css';
import './textbus/doc.scss';
export interface EditorConfig extends TextbusConfig {
    content?: string;
    collaborateConfig?: CollaborateConfig;
    viewOptions?: Partial<ViewOptions>;
}
export declare class Editor extends Textbus {
    private editorConfig;
    translator: OutputTranslator;
    private host;
    private vDomAdapter;
    constructor(editorConfig?: EditorConfig);
    mount(host: HTMLElement): Promise<this>;
    getHTML(): string;
}
