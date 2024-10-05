import { ComponentInstance, Injectable, Subscription, VElement } from '@textbus/core'
import { Observable, Subject } from '@textbus/core'


@Injectable()
export class MemoService {
  onCreateMeno = new Subject<{ x: number, y: number }>()

  onResize = new Subject<{ id: string, height: number, width: number }>()
  onMove = new Subject<{ id: string, x: number, y: number }>()
  onUpdateBgColor = new Subject<{ id: string, bgColor: any }>()
  onExpand = new Subject<{ id: string, isExpanded: boolean }>()
  onDelete = new Subject<{ id: string }>()
  onSave = new Subject<{ id: string, content: string }>()
  createMeno(x: number, y: number) {
    this.onCreateMeno.next({ x, y })
  }
}
