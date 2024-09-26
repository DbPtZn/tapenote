import { ComponentInstance, Injectable, Subscription, VElement } from '@textbus/core'
import { Observable, Subject } from '@textbus/core'

/** 该服务已弃用 （改用事件委托） */
@Injectable()
export class AnimeService {
  // private animeUpdateEvent = new Subject<void>()
  // onAnimeUpdate: Observable<void> = this.animeUpdateEvent.asObservable()
  onAnimeUpdate = new Subject<void>()

  handleAnimeUpdate() {
    this.onAnimeUpdate.next()
  }

  // handleSelectAnime(animeInfo: AnimeInfo) {
  //   // console.log('animeInfo', animeInfo)
  //   this.animeClickEvent.next(animeInfo)
  // }

  // handleAnimeContextmenu(args: ContextmenuInfo) {
  //   this.animeContextmenuEvent.next(args)
  // }
}
