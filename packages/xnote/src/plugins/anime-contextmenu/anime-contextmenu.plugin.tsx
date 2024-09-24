import { Plugin, Subscription, fromEvent } from '@textbus/core'
import { DomAdapter, VIEW_DOCUMENT } from '@textbus/platform-browser'
import { Application, Injector } from '@viewfly/core'
import { useReadonly } from '../../textbus/hooks/use-readonly'
import { createApp } from '@viewfly/platform-browser'
import { AnimeService } from '../../services/anime.service'
import { AnimeContextmenu } from './anime-contextmenu'

export class AnimeContextmenuPlugin implements Plugin {
  private app: Application | null = null
  private host: HTMLElement | null = null
  private viewDocument: HTMLElement | null = null
  private adapter!: DomAdapter
  private animeService!: AnimeService
  private subs: Subscription[] = []

  
  setup(injector: Injector) {
    const App = function () {
      const readonly = useReadonly()
      return () => {
        console.log('readonly', readonly())
        return readonly() ? null : <AnimeContextmenu/>
      }
    }
    this.app = createApp(<App />, {
      context: injector
    })

    this.adapter = injector.get(DomAdapter)
    this.animeService = injector.get(AnimeService)
    this.viewDocument = injector.get(VIEW_DOCUMENT)
    
    this.subs.push(
      fromEvent(this.viewDocument!, 'contextmenu').subscribe(ev => {
        const nativeNode = ev.target as HTMLElement
        if(nativeNode.tagName.toLocaleLowerCase() === 'anime' || nativeNode.className === 'anime-component-tab') {
          this.animeService.handleContextmenu(nativeNode)
          ev.preventDefault()
          ev.stopPropagation()
        }
      })
    )
    
    this.host = document.createElement('div')
    this.viewDocument?.appendChild(this.host)
    this.app.mount(this.host)
  }

  onDestroy(): void {
    this.app?.destroy()
    this.subs.forEach(sub => sub.unsubscribe())
    if (this.viewDocument && this.host) {
      this.viewDocument.removeChild(this.host)
    }
  }
}