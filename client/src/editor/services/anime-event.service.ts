import { Observable, Subject, distinctUntilChanged } from '@tanbo/stream'
import { Injectable, VElement, Subscription } from '@textbus/core'
import { onAnimePlayerFormatterContextmenu } from '../formatters/anime-player.formatter'
@Injectable()
export class AnimeEventService {
  onAnimeContextmenu: Observable<{ vdom: VElement, event: MouseEvent }>
  private AnimeContextmenuEvent = new Subject<{ vdom: VElement, event: MouseEvent }>()
  private sub: Subscription
  constructor() {
    this.onAnimeContextmenu = this.AnimeContextmenuEvent.asObservable()
    this.sub = onAnimePlayerFormatterContextmenu.subscribe(({ vdom, event }) => {
      this.AnimeContextmenuEvent.next({ vdom, event })
    })
  }

  destory(){
    this.sub.unsubscribe()
  }
}
