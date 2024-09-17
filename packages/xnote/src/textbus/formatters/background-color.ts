import { Component, FormatHostBindingRender, Formatter, VElement, VTextNode } from '@textbus/core'
import { FormatLoader, FormatLoaderReadResult } from '@textbus/platform-browser'
import { rgbaToHex } from '../_utils/rgbaToHex'

export const backgroundColorFormatter = new Formatter<string>('backgroundColor', {
  columned: true,
  render(children: Array<VElement | VTextNode | Component>, formatValue: string): VElement | FormatHostBindingRender {
    return {
      fallbackTagName: 'span',
      attach(host: VElement) {
        // host.styles.set('backgroundColor', formatValue)
        host.styles.set('backgroundColor', rgbaToHex(formatValue))
        host.attrs.set('data-bgcolor', rgbaToHex(formatValue))
      }
    }
  }
})

export const backgroundColorFormatLoader: FormatLoader<string> = {
  match(element: HTMLElement): boolean {
    return !!element.style.backgroundColor
  },
  read(element: HTMLElement): FormatLoaderReadResult<string> {
    return {
      formatter: backgroundColorFormatter,
      value: element.style.backgroundColor
    }
  }
}
