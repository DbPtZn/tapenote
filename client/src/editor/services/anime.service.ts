// import { ComponentInstance, Injectable, Subscription, VElement } from '@textbus/core'
// import { Observable, Subject } from '@textbus/core'
// import { onAnimeFormatterClick, onAnimeFormatterContextmenu } from '../formatters/anime.formatter'
/** 基本动画信息 */
// export interface AnimeInfo {
//   id: string
//   effect: string
//   serial: string
// }
// interface ContextmenuInfo { 
//   event: Event
//   // vdom?: VElement
//   component?: ComponentInstance 
// }

/** 该服务已弃用 （改用事件委托） */
// @Injectable()
// export class AnimeService {
//   // private animeClickEvent: Subject<any> = new Subject()
//   // onAnimeClick: Observable<AnimeInfo> = this.animeClickEvent.asObservable()
//   // private animeContextmenuEvent: Subject<any> = new Subject()
//   // onAnimeContextmenu: Observable<ContextmenuInfo> = this.animeContextmenuEvent.asObservable()
//   // private subs: Subscription[] = []
//   // constructor() {}

//   setup() {
//     // this.subs = [
//     //   animeFormatterService.onAnimeFormatterClick.subscribe(animeInfo => {
//     //     // this.handleSelectAnime(animeInfo)
//     //   }),
//     //   animeFormatterService.onAnimeFormatterContextmenu.subscribe(({ vdom, event }) => {
//     //     // this.handleAnimeContextmenu({vdom, event})
//     //   })
//     // ]
//   }

//   // handleSelectAnime(animeInfo: AnimeInfo) {
//   //   // console.log('animeInfo', animeInfo)
//   //   this.animeClickEvent.next(animeInfo)
//   // }

//   // handleAnimeContextmenu(args: ContextmenuInfo) {
//   //   this.animeContextmenuEvent.next(args)
//   // }

//   // destory(){
//   //   console.log(this.subs)
//   //   console.log('AnimeService 销毁')
//   //   this.subs.forEach(s => s.unsubscribe())
//   //   console.log(this.subs)
//   //   // this.subs.length = 0
//   //   // this.subs = []
//   //   console.log(this.subs)
//   // }
// }
