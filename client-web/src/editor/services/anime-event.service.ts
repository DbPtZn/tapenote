import { Observable, Subject, distinctUntilChanged } from '@tanbo/stream'
import { Injectable, VElement } from '@textbus/core'
import { onAnimePlayerFormatterContextmenu } from '../formatters/anime-player.formatter'
@Injectable()
export class AnimeEventService {
  onAnimeContextmenu: Observable<{ vdom: VElement, event: MouseEvent }>
  private AnimeContextmenuEvent = new Subject<{ vdom: VElement, event: MouseEvent }>()

  constructor() {
    this.onAnimeContextmenu = this.AnimeContextmenuEvent.asObservable()
    onAnimePlayerFormatterContextmenu.subscribe(({ vdom, event }) => {
      this.AnimeContextmenuEvent.next({ vdom, event })
    })
  }
}
