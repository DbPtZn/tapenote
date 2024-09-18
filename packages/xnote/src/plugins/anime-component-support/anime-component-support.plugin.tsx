import { Plugin, Subscription, fromEvent } from '@textbus/core'
import { DomAdapter, VIEW_DOCUMENT } from '@textbus/platform-browser'
import { Application, Injector } from '@viewfly/core'
import { useReadonly } from '../../textbus/hooks/use-readonly'
import { AddAnimeTool } from './add-anime-tool'
import { createApp } from '@viewfly/platform-browser'
import { AnimeService } from '../../services/anime.service'

export class AnimeComponentSupportPlugin implements Plugin {
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
        return readonly() ? null : <AddAnimeTool/>
      }
    }
    this.app = createApp(<App />, {
      context: injector
    })
    
    this.adapter = injector.get(DomAdapter)
    this.animeService = injector.get(AnimeService)
    this.viewDocument = injector.get(VIEW_DOCUMENT)

    this.subs.push(
      fromEvent(this.viewDocument!, 'mousemove').subscribe(ev => {
        let nativeNode = ev.target as HTMLElement
        // console.log(nativeNode)
        while (nativeNode) {
          const componentInstance = this.adapter.getComponentByNativeNode(nativeNode)
          if (componentInstance) {
            // console.log(componentInstance)
            this.animeService.updateComponentActive(componentInstance.name === 'RootComponent' ? null : componentInstance)
            break
          }
          nativeNode = nativeNode.parentNode as HTMLElement
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
