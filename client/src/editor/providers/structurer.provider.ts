import { Injectable } from '@textbus/core'

/** 组建成员 */
@Injectable()
export class Structurer {
  // injector!: Injector
  /** 布局 */
  editorRef: HTMLElement | null = null
  rootRef: HTMLElement | null = null
  scrollerRef: HTMLElement | null = null
  controllerRef: HTMLElement | null = null
  toolbarRef: HTMLElement | null = null

  setup(config: { rootRef?: HTMLElement, editorRef?: HTMLElement, scrollerRef?: HTMLElement, toolbarRef?: HTMLElement, controllerRef?: HTMLElement  }) {
    const { rootRef, editorRef, scrollerRef, toolbarRef, controllerRef } = config
    // this.injector = injector
    this.rootRef = rootRef || null
    this.editorRef = editorRef || null
    this.scrollerRef = scrollerRef || null
    this.controllerRef = controllerRef || null
    this.toolbarRef = toolbarRef || null
  }

  destory(){
    this.rootRef = null
    this.editorRef = null
    this.scrollerRef = null
    this.controllerRef = null
    this.toolbarRef = null
  }
}
