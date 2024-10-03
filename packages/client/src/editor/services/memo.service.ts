import { ComponentInstance, Injectable, Subscription, VElement } from '@textbus/core'
import { Observable, Subject } from '@textbus/core'


@Injectable()
export class MemoService {
  onCreateMeno = new Subject<{ x: number, y: number }>()

  createMeno(x: number, y: number) {
    this.onCreateMeno.next({ x, y })
  }
}
