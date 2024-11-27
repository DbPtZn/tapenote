import { Attribute, Formatter } from '@textbus/core'
import {
  // blockBackgroundColorFormatLoader,
  // blockBackgroundColorFormatter,
  boldFormatLoader,
  boldFormatter,
  codeFormatLoader,
  codeFormatter,
  // codeFormatLoader,
  // codeFormatter,
  // colorFormatLoader,
  // colorFormatter,
  dirFormatLoader,
  dirFormatter,
  fontFamilyFormatLoader,
  fontFamilyFormatter,
  fontSizeFormatLoader,
  fontSizeFormatter,
  italicFormatLoader,
  italicFormatter,
  letterSpacingFormatLoader,
  letterSpacingFormatter,
  lineHeightFormatLoader,
  lineHeightFormatter,
  linkFormatLoader,
  linkFormatter,
  strikeThroughFormatLoader,
  strikeThroughFormatter,
  subscriptFormatLoader,
  subscriptFormatter,
  superscriptFormatLoader,
  superscriptFormatter,
  textAlignFormatLoader,
  textAlignFormatter,
  // textBackgroundColorFormatLoader,
  // textBackgroundColorFormatter,
  textIndentFormatLoader,
  textIndentFormatter,
  underlineFormatLoader,
  underlineFormatter,
  verticalAlignFormatLoader,
  verticalAlignFormatter
} from '@textbus/editor'
import { FormatLoader, AttributeLoader } from '@textbus/platform-browser'
import { blockBackgroundColorFormatLoader, blockBackgroundColorFormatter, colorFormatLoader, colorFormatter, textBackgroundColorFormatLoader, textBackgroundColorFormatter } from './formatters'

export const defaultFormatters: Formatter<any>[] = [
  boldFormatter,
  italicFormatter,
  colorFormatter,
  fontFamilyFormatter,
  fontSizeFormatter,
  letterSpacingFormatter,
  lineHeightFormatter,
  strikeThroughFormatter,
  subscriptFormatter,
  superscriptFormatter,
  underlineFormatter,
  codeFormatter,
  linkFormatter,
  textBackgroundColorFormatter,
  verticalAlignFormatter
]

export const defaultAttributes: Attribute<any>[] = [blockBackgroundColorFormatter, textAlignFormatter, textIndentFormatter, dirFormatter]

export const defaultFormatLoaders: FormatLoader<any>[] = [
  boldFormatLoader,
  italicFormatLoader,
  colorFormatLoader,
  fontFamilyFormatLoader,
  fontSizeFormatLoader,
  letterSpacingFormatLoader,
  lineHeightFormatLoader,
  strikeThroughFormatLoader,
  subscriptFormatLoader,
  superscriptFormatLoader,
  underlineFormatLoader,
  codeFormatLoader,
  linkFormatLoader,
  textBackgroundColorFormatLoader,
  verticalAlignFormatLoader
]

export const defaultAttributeLoaders: AttributeLoader<any>[] = [
  blockBackgroundColorFormatLoader,
  textAlignFormatLoader,
  textIndentFormatLoader,
  dirFormatLoader
]
