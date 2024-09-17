import { Injectable, Injector } from '@viewfly/core'
import { VIEW_DOCUMENT, VIEW_CONTAINER, VIEW_MASK } from '@textbus/platform-browser'
import { Observable, Subject } from '@textbus/core'
import '../assets/edit-dark.scss'
type Theme = 'dark' | 'light'

interface ThemeConfig {
  theme: Theme
}

@Injectable()
export class ThemeProvider {
  private viewContainer: HTMLElement | null = null
  private viewDocument: HTMLElement | null = null

  private theme: Theme = 'light'
  private themeUpdateEvent: Subject<Theme> = new Subject()
  onThemeUpdate: Observable<Theme> = this.themeUpdateEvent.asObservable()

  setup(injector: Injector, config?: ThemeConfig) {
    this.viewContainer = injector.get(VIEW_CONTAINER)
    this.viewDocument = injector.get(VIEW_DOCUMENT)
    const theme = config?.theme || this.theme
    
    if(this.viewContainer && this.viewDocument) {
      // this.viewContainer.setAttribute('data-color', '#000000')
      this.viewContainer.setAttribute('data-theme', `${theme}-theme`)
    }
  }

  getCurrentTheme(): string {
    return this.theme || this.viewContainer?.getAttribute('data-theme') || 'light'
  }

  updateTheme(theme: Theme) {
    this.theme = theme
    this.viewContainer?.setAttribute('data-theme', `${theme}-theme`)
    this.themeUpdateEvent.next(theme)
  }

  destory() {
    this.viewContainer = null
  }
}
