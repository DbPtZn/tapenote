import { FormatValue, Formatter, VElement, VTextNode } from "@textbus/core"
import { MatchRule, Matcher, inlineTags } from "@textbus/editor"
import { FormatLoader } from "@textbus/platform-browser"
import { rgbaToHex } from "./utils"




export class TextBackgroundColorFormatter implements Formatter<any> {
  columned = true
  priority = 0
  constructor(public name: string,
              public styleName: string) {
  }

  render(children: Array<VElement | VTextNode>, formatValue: string): VElement {
    if (children.length === 1 && children[0] instanceof VElement) {
      const node = children[0]
      if (node instanceof VElement) {
        const reg = new RegExp(`^(${inlineTags.join('|')})$`, 'i')
        if (node && reg.test(node.tagName)) {
          node.styles.set(this.styleName, formatValue)
          return node
        }
      }
    }
    return new VElement('span', {
      'data-bgcolor': rgbaToHex(formatValue),
      style: {
        [this.styleName]: rgbaToHex(formatValue)
      }
    }, children)
  }
}

export const textBackgroundColorFormatter = new TextBackgroundColorFormatter('textBackgroundColor', 'backgroundColor')


export class InlineTagStyleFormatLoader<T extends FormatValue> extends Matcher<T, Formatter<any>> implements FormatLoader<any> {
  constructor(public styleName: string, formatter: Formatter<any>, rule: MatchRule, public forceMatchTags = false) {
    super(formatter, rule)
  }

  override match(element: HTMLElement): boolean {
    if (this.forceMatchTags) {
      const reg = new RegExp(`^(${inlineTags.join('|')})$`, 'i')
      if (!reg.test(element.tagName)) {
        return false
      }
    }
    return super.match(element)
  }

  read(node: HTMLElement) {
    return {
      formatter: this.target,
      value: this.extractFormatData(node, {
        styleName: this.styleName
      }).styles[this.styleName]
    }
  }
}

export const textBackgroundColorFormatLoader = new InlineTagStyleFormatLoader(
  'backgroundColor',
  textBackgroundColorFormatter,
  {
    styles: {
      backgroundColor: /.+/
    }
  },
  true
)