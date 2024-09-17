import { FormatHostBindingRender, VElement, VTextNode, Formatter } from '@textbus/core'
import { MatchRule, Matcher } from '@textbus/editor'
import { FormatLoader } from '@textbus/platform-browser'
import { rgbaToHex } from './utils'

class ColorFormatter implements Formatter<any> {
  columned = false
  priority = 0
  constructor(public name: string) {}

  render(children: Array<VElement | VTextNode>, formatValue: string): FormatHostBindingRender {
    // console.log(formatValue)
    // console.log(rgbaToHex(formatValue))
    return {
      fallbackTagName: 'span',
      attach: (host: VElement) => {
        host.styles.set('color', rgbaToHex(formatValue))
        host.attrs.set('data-color', rgbaToHex(formatValue))
      }
    }
  }
}
export const colorFormatter = new ColorFormatter('color')

class ColorFormatLoader extends Matcher<any, Formatter<any>> implements FormatLoader<any> {
  constructor(formatter: Formatter<any>) {
    super(formatter, {
      styles: {
        color: /.+/
      },
      attrs: [
        {
          key: 'data-color'
        }
      ]
    })
  }

  read(node: HTMLElement) {
    // console.log(
    //   this.extractFormatData(node, {
    //     styleName: 'color',
    //     attrs: ['data-color']
    //   })
    // )
    return {
      formatter: this.target,
      value: this.extractFormatData(node, {
        styleName: 'color',
        attrs: ['data-color']
      }).styles.color
    }
  }
}
export const colorFormatLoader = new ColorFormatLoader(colorFormatter)

// function createOuterStyleFormatter(styleName: string, config: { columned?: boolean, inheritable?: boolean, priority?: number} = { columned: false, inheritable: true, priority: 0 }) {
//   const { columned, inheritable, priority } = config
//   return new Formatter<string>(styleName, {
//     columned,
//     inheritable,
//     priority,
//     render(children, formatValue, renderEnv): FormatHostBindingRender {
//       return {
//         fallbackTagName: 'span',
//         attach: (host: VElement) => {
//           host.styles.set('color', rgbaToHex(formatValue))
//           host.attrs.set('data-color', rgbaToHex(formatValue))
//         }
//       }
//     }
//   })
// }

// export const colorFormatter = createOuterStyleFormatter('color')