import { Attribute, FormatValue, Formatter, VElement, VTextNode } from "@textbus/core"
import { MatchRule, Matcher, blockTags, inlineTags } from "@textbus/editor"
import { AttributeLoader, FormatLoader } from "@textbus/platform-browser"
import { rgbaToHex } from "./utils"




class BlockBackgroundColorFormatter implements Attribute<string> {
  constructor(public name: string,
              public styleName: string) {
  }

  render(host: VElement, formatValue: string) {
    const color = rgbaToHex(formatValue)
    host.styles.set(this.styleName, color)
    host.attrs.set('data-bgcolor', color)
  }
}

export const blockBackgroundColorFormatter = new BlockBackgroundColorFormatter('blockBackgroundColor', 'backgroundColor')


class BlockStyleFormatLoader<T extends FormatValue> extends Matcher<T, Attribute<T>> implements AttributeLoader<T> {
  constructor(public styleName: string, formatter: Attribute<any>, rule: MatchRule) {
    super(formatter, rule)
  }

  override match(p: HTMLElement) {
    const reg = new RegExp(`^(${blockTags.join('|')})$`, 'i')
    if (!reg.test(p.tagName)) {
      return false
    }
    return super.match(p)
  }

  read(node: HTMLElement) {
    return {
      attribute: this.target,
      value: this.extractFormatData(node, {
        styleName: this.styleName
      }).styles[this.styleName] as T
    }
  }
}

export const blockBackgroundColorFormatterLoader = new BlockStyleFormatLoader(
  'backgroundColor',
  blockBackgroundColorFormatter,
  {
    styles: {
      backgroundColor: /.+/
    }
  }
)