import {
  VElement,
  Formatter,
  VTextNode,
  RenderMode,
} from '@textbus/core'
import { ANIME, ANIME_FORMATTER_NAME } from '../anime.constant'
import { FormatLoader } from '@textbus/platform-browser'

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
    /** ----------------- 弃用 （ 改用事件委托 ）  -------------------- */
    // vdom.listeners.click = (ev: Event) => {
    //   // console.log('anime formatter click ------>')
    //   // ev.preventDefault()
    //   // ev.stopPropagation()
    //   // const element = ev.target as HTMLElement
    //   // animeFormatterService.handleSelectAnime({
    //   //   id: element.dataset.id!,
    //   //   effect: element.dataset.effect!,
    //   //   serial: element.dataset.serial!
    //   // })
    // }
    // vdom.listeners.contextmenu = (event: Event) => {
    //   // console.log('anime formatter contextmenu ------>')
    //   // event.preventDefault() // 阻止默认事件
    //   // event.stopPropagation() // 阻止事件冒泡
    //   // animeFormatterService.handleAnimeContextmenu({ vdom, event })
    // }
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
