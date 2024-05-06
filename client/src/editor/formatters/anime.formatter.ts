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
import { AnimeInfo } from '..'


const animeFormatterClickEvent: Subject<any> = new Subject()
export const onAnimeFormatterClick: Observable<AnimeInfo> = animeFormatterClickEvent.asObservable()

const animeFormatterContextmenuEvent: Subject<any> = new Subject()
export const onAnimeFormatterContextmenu: Observable<{ vdom: VElement; event: PointerEvent }> = animeFormatterContextmenuEvent.asObservable()

export class AnimeFormatter implements Formatter<any> {
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
        'data-state': formatValue.dataState || 'inactive', // 默认是未激活状态
        'data-title': formatValue.dataTitle,
        'title': formatValue.dataTitle, // 鼠标在标记上时显示动画名称
      },
      children
    )
    vdom.listeners.click = (ev: Event) => {
      ev.preventDefault()
      ev.stopPropagation()
      const element = ev.target as HTMLElement
      animeFormatterClickEvent.next({
        id: element.dataset.id,
        effect: element.dataset.effect,
        serial: element.dataset.serial
      })
    }
    vdom.listeners.contextmenu = (event: Event) => {
      // console.log('右击')
      // console.log(event)
      event.preventDefault() // 阻止默认事件
      event.stopPropagation() // 阻止事件冒泡
      animeFormatterContextmenuEvent.next({ vdom, event })
    }
    return vdom
  }
}

export const animeFormatter = new AnimeFormatter()

export const animeFormatLoader: FormatLoader<any> = {
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
      formatter: animeFormatter,
      value: data
    }
  }
}
