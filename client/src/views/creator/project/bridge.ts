import { AnimeService, AnimeStateProvider, AnimeUtilsProvider } from "@/editor"
import { Observable, Subject } from "@tanbo/stream"
import { Editor } from "@textbus/editor"
import { Habit } from "./habit"
import { LibraryEnum } from "@/enums"

export class Bridge {
  habit: Habit
  editor!: Editor
  editorRef!: HTMLElement
  studioRef!: HTMLElement
  scrollerRef!: HTMLElement
  projectRef!: HTMLElement
  animeState!: AnimeStateProvider
  animeService!: AnimeService
  animeUtils!: AnimeUtilsProvider
  private editorReadyEvent: Subject<any> = new Subject()
  onEditorReady: Observable<Editor> = this.editorReadyEvent.asObservable()
  private toolbarCollapseEvent: Subject<any> = new Subject()
  onToolbarCollapse: Observable<any> = this.toolbarCollapseEvent.asObservable()
  private saveStartEvent: Subject<any> = new Subject()
  onSaveStart: Observable<any> = this.saveStartEvent.asObservable()
  private saveEndEvent: Subject<any> = new Subject()
  onSaveEnd: Observable<any> = this.saveEndEvent.asObservable()
  
  private sidenoteShowEvent: Subject<any> = new Subject()
  onSidenoteShow: Observable<boolean> = this.sidenoteShowEvent.asObservable()
  private sidenoteReadyEvent: Subject<any> = new Subject()
  onSidenoteReady: Observable<Editor> = this.sidenoteReadyEvent.asObservable()

  constructor() {
    this.habit = new Habit()
  }
  setup(editor: Editor, lib: LibraryEnum, editorRef: HTMLElement, scrollerRef: HTMLElement) {
    this.editor = editor
    this.editorRef = editorRef
    this.scrollerRef = scrollerRef
    if (lib === LibraryEnum.PROCEDURE) {
      this.animeState = editor.get(AnimeStateProvider)
      this.animeService = editor.get(AnimeService)
      this.animeUtils = editor.get(AnimeUtilsProvider)
    }
    this.editorReadyEvent.next(editor)
  }

  handleToolbarCollapse() {
    this.toolbarCollapseEvent.next('')
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
  handleSidenoteToolbarCollapse(value: boolean) {
    this.toolbarCollapseEvent.next(value)
  }

  // destory() {
  //   //
  // }
}