import { Observable, Subject, distinctUntilChanged, type ComponentInstance, Injectable } from '@textbus/core'

@Injectable()
export class TestService {
  onComponentActive: Observable<ComponentInstance | null>
  private componentActiveEvent = new Subject<ComponentInstance | null>()

  constructor() {
    this.onComponentActive = this.componentActiveEvent.asObservable()
  }

  updateActiveComponent(component: ComponentInstance | null) {
    this.componentActiveEvent.next(component)
  }

  destory(){}
}
