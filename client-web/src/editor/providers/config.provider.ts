import { Injectable, Injector } from '@textbus/core'
import { Observable, Subject } from '@textbus/core'
// type ThemeState = 'light' | 'dark'
@Injectable()
export class ConfigProvider {
  injector!: Injector
  /** 布局 */
  // scrollerRef: HTMLElement | null = null
  // toolbarRef: HTMLElement | null = null
  /** 主题配置 */
  // private themeUpdateEvent: Subject<ThemeState>  = new Subject()
  // onThemeUpdate: Observable<ThemeState>
  // theme: ThemeState = 'light'
  /** 折叠状态 */
  // private toolbarCollapseEvent: Subject<any> = new Subject()
  // onCollapse: Observable<any>
  // collapseState: boolean
  constructor() {
    // this.onThemeUpdate = this.themeUpdateEvent.asObservable()
    // this.onCollapse = this.toolbarCollapseEvent.asObservable()
    // this.collapseState = false
  }
  setup(injector: Injector) {
    // const { scrollerRef, toolbarRef } = config
    this.injector = injector
    // this.scrollerRef = scrollerRef || null
    // this.toolbarRef = toolbarRef || null
  }
  /** 折叠工具条 */
  // handleToolbarCollapse(value: boolean) {
  //   this.collapseState = value
  //   this.toolbarCollapseEvent.next(value)
  // }
  /** 更新主题 */
  // handleThemeUpdate(value: ThemeState) {
  //   this.theme = value
  //   this.themeUpdateEvent.next(value)
  // }
}
