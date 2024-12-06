import { Injectable } from '@textbus/core'

/** 组建成员 */
@Injectable()
export class Structurer {
  /** 布局 */
  projectEl: HTMLElement | null = null
  editorWrapperEl: HTMLElement | null = null
  editorEl: HTMLElement | null = null
  scrollerEl: HTMLElement | null = null
  controllerEl: HTMLElement | null = null
  toolbarEl: HTMLElement | null = null

  setup(config: {
    projectEl: HTMLElement
    editorWrapperEl?: HTMLElement
    editorEl?: HTMLElement
    scrollerEl?: HTMLElement
    toolbarEl?: HTMLElement
    controllerEl?: HTMLElement
  }) {
    const { projectEl, editorWrapperEl, editorEl, scrollerEl, toolbarEl, controllerEl } = config
    this.projectEl = projectEl || null
    this.editorWrapperEl = editorWrapperEl || null
    this.editorEl = editorEl || null
    this.scrollerEl = scrollerEl || null
    this.controllerEl = controllerEl || null
    this.toolbarEl = toolbarEl || null
  }

  destory() {
    this.projectEl = null
    this.editorWrapperEl = null
    this.editorEl = null
    this.scrollerEl = null
    this.controllerEl = null
    this.toolbarEl = null
  }
}
