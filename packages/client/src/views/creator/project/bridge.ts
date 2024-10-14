import { AnimeProvider, OutlineService } from "@/editor"
import { Observable, Subject } from "@tanbo/stream"
import { Editor } from "@textbus/editor"
import { Habit } from "./habit"
import { LibraryEnum } from "@/enums"
import { VIEW_DOCUMENT } from "@textbus/platform-browser"
import { Renderer } from "@textbus/core"
import { Ref, ref } from "vue"

export class Bridge {
  habit: Habit | null = null
  editor: Editor | null = null
  scrollerEl = ref<HTMLElement>()
  editorRef: HTMLElement | null = null
  studioRef: HTMLElement | null = null
  scrollerRef: HTMLElement | null = null
  projectRef: HTMLElement | null = null
  renderer: Renderer | null = null
  container: HTMLElement | null = null
  animeProvider: AnimeProvider | null = null
  outlineService: OutlineService | null = null
  focusDiv: HTMLElement | null = null
  
  // private editorReadyEvent: Subject<any> = new Subject()
  // onEditorReady: Observable<Editor> = this.editorReadyEvent.asObservable()
  onEditorReady = new Subject<Editor>()
  // private toolbarCollapseEvent: Subject<any> = new Subject()
  // onToolbarCollapse: Observable<any> = this.toolbarCollapseEvent.asObservable()
  onToolbarCollapse = new Subject<boolean>()
  // private saveStartEvent: Subject<any> = new Subject()
  // onSaveStart: Observable<any> = this.saveStartEvent.asObservable()
  onSaveStart = new Subject<void>()
  // private saveEndEvent: Subject<any> = new Subject()
  // onSaveEnd: Observable<any> = this.saveEndEvent.asObservable()
  onSaveEnd = new Subject<void>()
  
  // private sidenoteShowEvent: Subject<any> = new Subject()
  // onSidenoteShow: Observable<boolean> = this.sidenoteShowEvent.asObservable()
  onSidenoteShow = new Subject<boolean>()
  // private sidenoteReadyEvent: Subject<any> = new Subject()
  // onSidenoteReady: Observable<Editor> = this.sidenoteReadyEvent.asObservable()
  onSidenoteReady = new Subject<Editor>()

  // private editorReloadEvent: Subject<any> = new Subject()
  // onEditorReload: Observable<Editor> = this.editorReloadEvent.asObservable()
  onEditorReload = new Subject<void>()

  // private autoMoveAnimePointerChangeEvent: Subject<boolean> = new Subject()
  // onAutoMoveAnimePointerChange:Observable<boolean> = this.autoMoveAnimePointerChangeEvent.asObservable()
  onAutoMoveAnimePointerChange = new Subject<boolean>()
  // private addPromoterEvent: Subject<HTMLElement> = new Subject()
  // onAddPromoter: Observable<HTMLElement> = this.addPromoterEvent.asObservable()
  onAddPromoter = new Subject<HTMLElement>()

  constructor() {
    this.habit = new Habit()

    this.focusDiv = document.createElement('div')
    this.focusDiv.tabIndex = 0
    document.body.appendChild(this.focusDiv)
  }
  setup(editor: Editor, lib: LibraryEnum, editorRef: HTMLElement, scrollerRef: HTMLElement) {
    this.editor = editor
    this.editorRef = editorRef
    this.scrollerRef = scrollerRef
    this.container = editor.get(VIEW_DOCUMENT)
    this.renderer = editor.get(Renderer)
    if (lib === LibraryEnum.PROCEDURE) this.animeProvider = editor.get(AnimeProvider)
    // this.editorReadyEvent.next(editor)
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

  destory() {
    this.habit = null
    this.editor = null
    this.editorRef = null
    this.studioRef = null
    this.scrollerRef = null
    this.projectRef = null
    this.animeProvider = null
    this.focusDiv?.remove()
  }
}