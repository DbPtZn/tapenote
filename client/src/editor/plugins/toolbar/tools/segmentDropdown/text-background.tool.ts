
import { Injector } from '@textbus/core'
import { SegmentDropdownTool, SegmentDropdownToolConfig } from '../../toolkit/segment-dropdown-tool'
import { colorToolCreator } from '../_utils/color-tool-creator'
import { I18n } from '@textbus/editor'
import { textBackgroundColorFormatter } from '@/editor'
export function textBackgroundToolConfigFactory(injector: Injector): SegmentDropdownToolConfig {
  const i18n = injector.get(I18n).getContext('plugins.toolbar.textBackgroundColorTool')
  return {
    iconClasses: ['textbus-icon-background-color'],
    tooltip: i18n.get('tooltip'),
    ...colorToolCreator(injector, textBackgroundColorFormatter)
  }
}

export function textBackgroundTool() {
  return new SegmentDropdownTool(textBackgroundToolConfigFactory)
}
