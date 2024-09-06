import { AnimeAutoProvider, AnimeStateProvider, AnimeUtilsProvider, OutlineService } from "@/editor"
import { Observable, Subject } from "@tanbo/stream"
import { Editor } from "@textbus/editor"
// import { Habit } from "./habit"
import { LibraryEnum } from "@/enums"
import { VIEW_DOCUMENT } from "@textbus/platform-browser"
import { Renderer } from "@textbus/core"
import { useDialog } from "naive-ui"

export class Bridge {
  // habit: Habit | null = null
  editor: Editor | null = null
  editorRef: HTMLElement | null = null
  studioRef: HTMLElement | null = null
  scrollerRef: HTMLElement | null = null
  projectRef: HTMLElement | null = null
  renderer: Renderer | null = null
  container: HTMLElement | null = null
  animeState: AnimeStateProvider | null = null
  animeUtils: AnimeUtilsProvider | null = null
  outlineService: OutlineService | null = null

  private editableEvent: Subject<boolean> = new Subject()
  onEditable: Observable<boolean> = this.editableEvent.asObservable()
  
  private editorReadyEvent: Subject<any> = new Subject()
  onEditorReady: Observable<Editor> = this.editorReadyEvent.asObservable()
  // private toolbarCollapseEvent: Subject<any> = new Subject()
  // onToolbarCollapse: Observable<any> = this.toolbarCollapseEvent.asObservable()

  private saveEvent: Subject<any> = new Subject()
  onSave: Observable<any> = this.saveEvent.asObservable()
  private saveStartEvent: Subject<any> = new Subject()
  onSaveStart: Observable<any> = this.saveStartEvent.asObservable()
  private saveEndEvent: Subject<any> = new Subject()
  onSaveEnd: Observable<any> = this.saveEndEvent.asObservable()
  
  private sidenoteShowEvent: Subject<any> = new Subject()
  onSidenoteShow: Observable<boolean> = this.sidenoteShowEvent.asObservable()
  private sidenoteReadyEvent: Subject<any> = new Subject()
  onSidenoteReady: Observable<Editor> = this.sidenoteReadyEvent.asObservable()

  private editorReloadEvent: Subject<any> = new Subject()
  onEditorReload: Observable<Editor> = this.editorReloadEvent.asObservable()

  constructor() {
    // this.habit = new Habit()
  }
  setup(editor: Editor, lib: LibraryEnum, editorRef: HTMLElement, scrollerRef: HTMLElement) {
    this.editor = editor
    this.editorRef = editorRef
    this.scrollerRef = scrollerRef
    this.container = editor.get(VIEW_DOCUMENT)
    this.renderer = editor.get(Renderer)
    if (lib === LibraryEnum.PROCEDURE) {
      this.animeState = editor.get(AnimeStateProvider)
      this.animeUtils = editor.get(AnimeUtilsProvider)
    }
    this.editorReadyEvent.next(editor)
    this.outlineService = editor.get(OutlineService)
  }

  // handleToolbarCollapse() {
  //   this.toolbarCollapseEvent.next('')
  // }

  handleSave() {
    this.saveEvent.next('')
  }

  handleEditable(is: boolean) {
    this.editableEvent.next(is)
  }

  handleSaveStart() {
    this.saveStartEvent.next('')
  }
  handleSaveEnd() {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.saveEndEvent.next('')
        resolve(true)
        clearTimeout(timer)
      }, 1000)
    })
  }

  handleSidenoteReady(editor: Editor) {
    this.sidenoteReadyEvent.next(editor)
  }
  handleSidenoteShow(is: boolean) {
    this.sidenoteShowEvent.next(is)
  }
  // handleSidenoteToolbarCollapse(value: boolean) {
  //   this.toolbarCollapseEvent.next(value)
  // }

  handleOutlineShow() {
    this.outlineService?.handleExpand()
  }

  handleAutoAnime() {
    const animeAutoProvider = this.editor?.get(AnimeAutoProvider)
    animeAutoProvider?.autoAdd()
  }

  /** 编辑模块重载（实现数据更新） */
  handleEditorReload() {
    this.editorReloadEvent.next('')
  }

  destory() {
    // this.habit = null
    this.editor = null
    this.editorRef = null
    this.studioRef = null
    this.scrollerRef = null
    this.projectRef = null
    this.animeState = null
    this.animeUtils = null
  }
}