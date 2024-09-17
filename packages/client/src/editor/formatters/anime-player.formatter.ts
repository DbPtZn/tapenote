import {
  VElement,
  Formatter,
  Subject,
  Observable,
  Injectable,
  VTextNode,
  RenderMode
} from '@textbus/core'
import { ANIME, ANIME_FORMATTER_NAME } from '../anime.constant'
import { FormatLoader } from '@textbus/platform-browser'

const animePlayerFormatterContextmenuEvent: Subject<{ vdom: VElement; event: MouseEvent }> = new Subject()
export const onAnimePlayerFormatterContextmenu: Observable<{ vdom: VElement; event: MouseEvent }> = animePlayerFormatterContextmenuEvent.asObservable()

export class AnimePlayerFormatter implements Formatter<any> {
  name = ANIME_FORMATTER_NAME
  tagName = ANIME
  columned = false
  priority = 0
  
  render(
    children: Array<VElement | VTextNode>,
    formatValue: Record<string, string>,
    renderMode: RenderMode
  ): VElement {
    const vdom = new VElement(
      ANIME,
      {
        'data-id': formatValue.dataId,
        'data-serial': formatValue.dataSerial,
        'data-effect': formatValue.dataEffect,
        'data-state': formatValue.dataState,
        'data-title': formatValue.dataTitle
      },
      children
    )
    // if (formatValue.state === 'active') {
    //   vdom.classes.add('active')
    // }
    // vdom.listeners.click = (ev: Event) => {
    //   ev.preventDefault()
    //   ev.stopPropagation()
    //   const element = ev.target as HTMLElement
    // }
    vdom.listeners.contextmenu = (event: Event) => {
      // console.log('右击')
      // event.preventDefault() // 阻止默认事件
      // event.stopPropagation() // 阻止事件冒泡
      animePlayerFormatterContextmenuEvent.next({ vdom, event: event as MouseEvent })
    }
    return vdom
  }
}

export const animePlayerFormatter = new AnimePlayerFormatter()

export const animePlayerFormatLoader: FormatLoader<any> = {
  match(element: HTMLElement) {
    return [ANIME].includes(element.tagName.toLowerCase())
  },
  // 当元素匹配成功时，会调用 read 方法获取样式的值
  read(node: HTMLElement) {
    const data = {
      dataId: node.dataset.id as string,
      dataSerial: node.dataset.serial as string,
      dataEffect: node.dataset.effect as string,
      dataState:  node.dataset.state as string,
      dataTitle: node.dataset.title as string,
    }
    return {
      formatter: animePlayerFormatter,
      value: data
    }
  }
}
