import { Injectable } from '@textbus/core'
import { Observable, Subject } from '@textbus/core'

@Injectable()
export class OutlineService {
  isExpanded: boolean
  private expandEvent: Subject<any> = new Subject()
  onExpand: Observable<boolean>
  constructor() {
    this.isExpanded = false
    this.onExpand = this.expandEvent.asObservable()
  }
  handleExpand() {
    this.isExpanded = !this.isExpanded
    this.expandEvent.next(this.isExpanded)
  }

  destory(){}
}
