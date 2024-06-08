import { ComponentInstance, Injectable, Subscription, VElement } from '@textbus/core'
import { Observable, Subject } from '@textbus/core'
import { onAnimeFormatterClick, onAnimeFormatterContextmenu } from '../formatters/anime.formatter'
/** 基本动画信息 */
export interface AnimeInfo {
  id: string
  effect: string
  serial: string
}
interface ContextmenuInfo { 
  event: Event
  vdom?: VElement
  component?: ComponentInstance 
}
  
@Injectable()
export class AnimeService {
  private animeClickEvent: Subject<any> = new Subject()
  onAnimeClick: Observable<AnimeInfo>
  private animeContextmenuEvent: Subject<any> = new Subject()
  onAnimeContextmenu: Observable<ContextmenuInfo>
  private subs: Subscription[] = []
  constructor() {
    this.onAnimeClick = this.animeClickEvent.asObservable()
    this.onAnimeContextmenu = this.animeContextmenuEvent.asObservable()
    this.subs.push(
      onAnimeFormatterClick.subscribe(animeInfo => {
        this.handleSelectAnime(animeInfo)
      }),
      onAnimeFormatterContextmenu.subscribe(({ vdom, event }) => {
        this.handleAnimeContextmenu({vdom, event})
      })
    )
  }

  handleSelectAnime(animeInfo: AnimeInfo) {
    // console.log('animeInfo', animeInfo)
    this.animeClickEvent.next(animeInfo)
  }

  handleAnimeContextmenu(args: ContextmenuInfo) {
    this.animeContextmenuEvent.next(args)
  }

  destory(){
    this.subs.forEach(s => s.unsubscribe())
  }
}
