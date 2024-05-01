import { Observable, Subject, distinctUntilChanged } from '@tanbo/stream'
import { ComponentInstance, Injectable } from '@textbus/core'

@Injectable()
export class AddAnimeService {
  onComponentActive: Observable<ComponentInstance | null>
  private componentActiveEvent = new Subject<ComponentInstance | null>()

  constructor() {
    this.onComponentActive = this.componentActiveEvent.asObservable().pipe(distinctUntilChanged())
  }

  updateActiveComponent(component: ComponentInstance | null) {
    this.componentActiveEvent.next(component)
  }
}
