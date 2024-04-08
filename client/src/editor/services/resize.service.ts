import { Injectable } from '@textbus/core'
import { Observable, Subject } from '@textbus/core'

@Injectable()
export class ResizeService {
  private resizeEvent: Subject<any> = new Subject()
  onResize: Observable<any>
  constructor() {
    this.onResize = this.resizeEvent.asObservable()
  }
  handleResize(value: any) {
    this.resizeEvent.next(value)
  }
}
