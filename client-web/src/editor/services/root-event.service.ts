import { Observable, Subject, distinctUntilChanged } from '@tanbo/stream'
import { ComponentInstance, Injectable } from '@textbus/core'

@Injectable()
export class RootEventService {
  onComponentContextmenu: Observable<MouseEvent | null>
  private componentContextmenuEvent = new Subject<MouseEvent | null>()

  constructor() {
    this.onComponentContextmenu = this.componentContextmenuEvent.asObservable().pipe(distinctUntilChanged())
  }

  handleContextmenu(ev: MouseEvent) {
    this.componentContextmenuEvent.next(ev)
  }
}
