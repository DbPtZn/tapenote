import { ComponentInstance, Injectable, Subscription, VElement, distinctUntilChanged } from '@textbus/core'
import { Observable, Subject } from '@textbus/core'


@Injectable()
export class MessageService {
  onMessage = new Subject<{txt: string, type: string}>()

  info(txt: string) {
    this.onMessage.next({txt, type: 'info'})
  }
  error(txt: string) {
    this.onMessage.next({txt, type: 'error'})
  }
  warning(txt: string) {
    this.onMessage.next({txt, type: 'warning'})
  }
  success(txt: string) {
    this.onMessage.next({txt, type: 'success'})
  }
}
