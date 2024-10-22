import { ComponentInstance, Injectable, Subscription, VElement, distinctUntilChanged } from '@textbus/core'
import { Observable, Subject } from '@textbus/core'


@Injectable()
export class ImgService {
  onImgActive = new Subject<ComponentInstance | null>()

  updateActiveComponent(component: ComponentInstance | null) {
    this.onImgActive.next(component)
  }
}
