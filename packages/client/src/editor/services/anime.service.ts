import { ComponentInstance, Injectable, Subscription, VElement } from '@textbus/core'
import { Observable, Subject } from '@textbus/core'


@Injectable()
export class AnimeService {
  onAnimeUpdate = new Subject<void>()
  onAnimeContextmenu = new Subject<void>()
  onComponentActive = new Subject<ComponentInstance | null>()

  handleAnimeUpdate() {
    this.onAnimeUpdate.next()
  }

  handleAnimeContextmenu() {
    this.onAnimeContextmenu.next()
  }

  updateActiveComponent(component: ComponentInstance | null) {
    this.onComponentActive.next(component)
  }

}
