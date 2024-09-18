import {
  Formatter, 
  VElement,
  VTextNode
} from '@textbus/core'
import { FormatLoader } from '@textbus/platform-browser'
import './anime.formatter.scss'

interface FormatterValue {
  dataId: string
  dataSerial: string
  dataEffect: string
  dataState: 'active' | 'inactive'
  dataTitle: string
}


export const animeFormatter = new Formatter('anime', {
  inheritable: false,
  priority: 0,
  columned: false,
  render(
    children: Array<VElement | VTextNode>,
    formatValue: FormatterValue,
  ): VElement {
    const vdom = new VElement(
      'anime',
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
    return vdom
  }
})

export const animeFormatLoader: FormatLoader = {
  match(element): boolean {
    return ['anime'].includes(element.tagName.toLowerCase())
  },
  
  read(element) {
    const data = {
      dataId: element.dataset.id as string,
      dataSerial: element.dataset.serial as string,
      dataEffect: element.dataset.effect as string,
      dataState:  element.dataset.state as string,
      dataTitle: element.dataset.title as string,
    }
    return {
      formatter: animeFormatter,
      value: data
    }
  }
}
