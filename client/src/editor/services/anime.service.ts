import { ComponentInstance, Injectable, VElement } from '@textbus/core'
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
  constructor() {
    this.onAnimeClick = this.animeClickEvent.asObservable()
    this.onAnimeContextmenu = this.animeContextmenuEvent.asObservable()
    onAnimeFormatterClick.subscribe(animeInfo => {
      this.handleSelectAnime(animeInfo)
    })
    onAnimeFormatterContextmenu.subscribe(({ vdom, event }) => {
      this.handleAnimeContextmenu({vdom, event})
    })
  }

  handleSelectAnime(animeInfo: AnimeInfo) {
    // console.log('animeInfo', animeInfo)
    this.animeClickEvent.next(animeInfo)
  }

  handleAnimeContextmenu(args: ContextmenuInfo) {
    this.animeContextmenuEvent.next(args)
  }

}
