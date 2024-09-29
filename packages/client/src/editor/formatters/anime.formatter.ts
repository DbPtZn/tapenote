import {
  VElement,
  Formatter,
  VTextNode,
  RenderMode,
} from '@textbus/core'
import { FormatLoader } from '@textbus/platform-browser'
interface AnimeState {
  dataId: string
  dataEffect: string
  dataSerial: string
  dataActive: boolean
  dataTitle: string
  dataRange: boolean
}
export class AnimeFormatter implements Formatter<any> {
  name = 'AnimeFormatter'
  tagName = 'anime'
  columned = false
  priority = 0
  
  render(
    children: Array<VElement | VTextNode>,
    formatValue: Record<string, any>,
    renderMode: RenderMode
  ): VElement {
    const vdom = new VElement(
      'anime',
      {
        'data-id': formatValue.dataId,
        'data-serial': formatValue.dataSerial,
        'data-effect': formatValue.dataEffect,
        'data-active': `${formatValue.dataActive}`, // 默认是未激活状态
        'data-title': formatValue.dataTitle,
        'data-range': `${formatValue.dataRange}`,
        'title': formatValue.dataTitle, // 鼠标在标记上时显示动画名称
      },
      children
    )
    return vdom
  }
}

export const animeFormatter = new AnimeFormatter()

export const animeFormatLoader: FormatLoader<any> = {
  match(element: HTMLElement) {
    return element.tagName.toLowerCase() === 'anime'
  },
  // 当元素匹配成功时，会调用 read 方法获取样式的值
  read(node: HTMLElement) {
    const data = {
      dataId: node.dataset.id,
      dataSerial: node.dataset.serial,
      dataEffect: node.dataset.effect,
      dataActive:  node.dataset.active === 'true',
      dataTitle: node.dataset.title,
      dataRange: node.dataset.range === 'true'
    }
    return {
      formatter: animeFormatter,
      value: data
    }
  }
}
