import { Observable, Subject, Subscription } from '@tanbo/stream'
import { Injector, Injectable } from '@textbus/core'
import _ from 'lodash'
import { Structurer } from '.'
import { Layout } from '@textbus/editor'
import '../index.scss'
import '../assets/index.css'
import 'material-icons/iconfont/material-icons.css'
import { VIEW_CONTAINER } from '@textbus/platform-browser'
type ThemeState = 'light' | 'dark'
/**
 * 主题控制器
 */
@Injectable()
export class ThemeProvider {
  /** 主题配置 */
  private themeUpdateEvent: Subject<ThemeState>  = new Subject()
  onThemeUpdate: Observable<ThemeState>
  theme: ThemeState = 'light'
  private subs: Subscription[] = []
  private editorHost: HTMLElement | null = null
  private toolbarHost: HTMLElement | null = null
  private layout: Layout | null = null
  constructor() {
    this.onThemeUpdate = this.themeUpdateEvent.asObservable()
  }
  setup(injector: Injector, fontSize='16px'): void {
    this.layout = injector.get(Layout)
    // this.viewContainer = injector.get(VIEW_CONTAINER)
    this.editorHost = this.layout.container
    this.layout.middle.setAttribute('data-color', '#000000')
    this.layout.middle.style.fontSize = fontSize
    const structurer = injector.get(Structurer)
    this.toolbarHost = structurer.toolbarRef
    this.subs.push(
      this.onThemeUpdate.subscribe(value => {
        switch (value) {
          case 'dark':
            this.updateTheme('data-theme', 'dark-theme')
            break
          case 'light':
            this.updateTheme('data-theme', 'light-theme')
            break
          default:
            return
        }
      })
    )
  }
  /** 更新主题 */
  handleThemeUpdate(value: ThemeState) {
    this.theme = value
    this.themeUpdateEvent.next(value)
  }

  private updateTheme(attrName: string, themeName: string) {
    this.toolbarHost?.setAttribute(attrName, themeName)
    this.editorHost?.setAttribute(attrName, themeName)
  }

  destory() {
    this.toolbarHost = null
    this.editorHost = null
    this.subs.forEach(i => i.unsubscribe())
  }
}
