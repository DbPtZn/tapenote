import { Injectable } from '@viewfly/core'
import { Component, Observable, Subject, distinctUntilChanged } from '@textbus/core'

@Injectable({
  provideIn: 'root'
})
export class AnimeService {
  private componentActiveEvent = new Subject<Component | null>()
  onComponentActive: Observable<Component | null> = this.componentActiveEvent.asObservable().pipe(distinctUntilChanged())

  updateComponentActive(component: Component | null) {
    this.componentActiveEvent.next(component)
  }
}
