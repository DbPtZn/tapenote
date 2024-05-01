import { Subscription, fromEvent } from '@tanbo/stream'
import { VIEW_DOCUMENT, VIEW_CONTAINER } from '@textbus/platform-browser'
import { Plugin, Injector, Commander } from '@textbus/core'
import _ from 'lodash'
import { ConfigProvider, Structurer } from '@/editor'
import { Layout } from '@textbus/editor'
/**
 * 主题控制器（插件）
 */
export class Clipboard implements Plugin {
  private subs: Subscription[] = []
  private editorHost: HTMLElement | null = null
  private toolbarHost: HTMLElement | null = null
  private layout: Layout | null = null
  constructor() {
  }
  setup(injector: Injector): void {
    this.layout = injector.get(Layout)
    this.editorHost = this.layout.container
    const vDocument = injector.get(VIEW_DOCUMENT)
    const vContainer = injector.get(VIEW_CONTAINER)
    const commander = injector.get(Commander)
    // const configProvider = injector.get(ConfigProvider)
    const structurer = injector.get(Structurer)
    this.toolbarHost = structurer.toolbarRef
    // this.subs.push(
    //   // fromEvent<ClipboardEvent>(this.layout.workbench, 'copy').subscribe((ev) => {
    //   //   // console.log(ev)
    //   //   // console.log((ev.target as Element).outerHTML)
    //   //   // console.log(ev.clipboardData?.getData('text/plain'))
    //   //   // console.log(ev.clipboardData?.getData('text/html'))
    //   //   // navigator.clipboard.read().then((items) => {
    //   //   //   console.log(items)
    //   //   //   const item = items[0]
    //   //   //   console.log(item.getType('text/html'))
    //   //   //   item.types.filter((i: string) => i === 'text/html').forEach((type: string) => {
    //   //   //     (item.getType(type) as Promise<Blob>).then(blob => {
    //   //   //       console.log(blob)
    //   //   //       return blob.text()
    //   //   //     }).then(text => {
    //   //   //       console.log(text)
    //   //   //     })
    //   //   //   })
    //   //   // })
    //   // }),
    //   // fromEvent(this.layout.workbench, 'cut').subscribe((ev) => {
    //   //   console.log(ev)
    //   // }),
    //   // fromEvent<ClipboardEvent>(vDocument.firstElementChild!, 'paste').subscribe((ev) => {
    //   //   console.log(ev)
    //   // }),
    //   // fromEvent<ClipboardEvent>(vContainer, 'paste').subscribe((ev) => {
    //   //   console.log(ev)
    //   // })
    // )
    // this.layout.workbench.addEventListener('paste', (ev) => {
    //   console.log(ev)
    // })
    // commander.paste()
  }

  onDestroy() {
    this.subs.forEach(i => i.unsubscribe())
  }
}
