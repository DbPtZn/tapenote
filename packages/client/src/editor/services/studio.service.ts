import { ComponentInstance, Injectable, Subscription, VElement, distinctUntilChanged } from '@textbus/core'
import { Observable, Subject } from '@textbus/core'


@Injectable()
export class StudioService {
  onTextToSpeech = new Subject<string>()

  textToSpeech(txt: string) {
    this.onTextToSpeech.next(txt)
  }
}
