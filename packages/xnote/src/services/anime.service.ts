import { Injectable } from '@viewfly/core'
import { Component, Observable, Subject, distinctUntilChanged } from '@textbus/core'

@Injectable({
  provideIn: 'root'
})
export class AnimeService {
  private componentActiveEvent = new Subject<Component | null>()
  onComponentActive: Observable<Component | null> = this.componentActiveEvent.asObservable().pipe(distinctUntilChanged())

  private contextmenuEvent = new Subject<HTMLElement | null>()
  onContextmenu: Observable<HTMLElement | null> = this.contextmenuEvent.asObservable()
  
  updateComponentActive(component: Component | null) {
    this.componentActiveEvent.next(component)
  }
  
  handleContextmenu(element: HTMLElement) {
    this.contextmenuEvent.next(element)
  }
}
