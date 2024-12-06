import { AnimeProvider, OutlineService } from "@/editor"
import { Subject } from "@tanbo/stream"
import { Editor } from "@textbus/editor"
import { Habit } from "./habit"
import { LibraryEnum } from "@/enums"
import { VIEW_DOCUMENT } from "@textbus/platform-browser"
import { Renderer } from "@textbus/core"
import { nextTick } from "vue"

export class Bridge {
  habit: Habit | null = null
  editor: Editor | null = null

  coverEl: HTMLElement | null = null
  titleEl: HTMLElement | null = null
  editorEl: HTMLElement | null = null
  studioEl: HTMLElement | null = null
  studioScrollerEl: HTMLElement | null = null
  scrollerEl: HTMLElement | null = null
  projectEl: HTMLElement | null = null
  container: HTMLElement | null = null

  renderer: Renderer | null = null
  animeProvider: AnimeProvider | null = null
  outlineService: OutlineService | null = null

  focusDiv: HTMLElement | null = null
  
  onEditorReady = new Subject<Editor>()
  onToolbarCollapse = new Subject<boolean>()
  onSaveStart = new Subject<void>()
  onSaveEnd = new Subject<void>()
  onSidenoteShow = new Subject<boolean>()
  onSidenoteReady = new Subject<Editor>()
  onEditorReload = new Subject<void>()
  onAutoMoveAnimePointerChange = new Subject<boolean>()
  onAddPromoter = new Subject<HTMLElement>()

  // 移动端
  onEditable = new Subject<boolean>()
  onSave = new Subject<void>()

  constructor() {
    this.habit = new Habit()

    this.focusDiv = document.createElement('div')
    this.focusDiv.tabIndex = 0
    document.body.appendChild(this.focusDiv)
  }
  setup(editor: Editor, lib: LibraryEnum) {
    this.editor = editor
    this.container = editor.get(VIEW_DOCUMENT)
    this.renderer = editor.get(Renderer)
    if (lib === LibraryEnum.PROCEDURE) this.animeProvider = editor.get(AnimeProvider)
    this.onEditorReady.next(editor)
    this.outlineService = editor.get(OutlineService)
  }

  handleToolbarCollapse() {
    this.onToolbarCollapse.next(true)
  }

  handleSaveStart() {
    this.onSaveStart.next()
  }
  
  handleSaveEnd() {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.onSaveEnd.next()
        resolve(true)
        clearTimeout(timer)
      }, 1000)
    })
  }

  handleSidenoteReady(editor: Editor) {
    this.onSidenoteReady.next(editor)
  }
  handleSidenoteShow(is: boolean) {
    this.onSidenoteShow.next(is)
  }
  handleSidenoteToolbarCollapse(value: boolean) {
    this.onToolbarCollapse.next(value)
  }

  handleOutlineShow() {
    this.outlineService?.handleExpand()
  }

  handleAutoAnime() {
    const animeProvider = this.editor?.get(AnimeProvider)
    animeProvider?.autoAdd()
  }

  handleAutoMoveAnimePointer(is: boolean) {
    this.onAutoMoveAnimePointerChange.next(is)
  }
  
  handleAddPromoter(element: HTMLElement) {
    this.onAddPromoter.next(element)
  }

  /** 编辑模块重载（实现数据更新） */
  handleEditorReload() {
    this.onEditorReload.next()
  }

  /** 将焦点从编辑器上移除 */
  handleBlur() {
    this.focusDiv?.focus()
  }

  /** 将滚动条滚动到底部 */
  studioScrollToBottom() {
    nextTick(() => {
      if(!this.studioScrollerEl) return
      this.studioScrollerEl.scrollTop = this.studioScrollerEl.scrollHeight
    })
  }

  // 移动端 (实验性)
  handleEditable(is: boolean) {
    this.onEditable.next(is)
  }
  handleSave() {
    this.onSave.next()
  }

  destory() {
    this.habit = null
    this.editor = null
    this.editorEl = null
    this.studioEl = null
    this.scrollerEl = null
    this.projectEl = null
    this.titleEl = null
    this.animeProvider = null
    this.focusDiv?.remove()
  }
}