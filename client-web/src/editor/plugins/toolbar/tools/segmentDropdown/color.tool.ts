import { Injector } from '@textbus/core'
import { SegmentDropdownTool, SegmentDropdownToolConfig } from '../../toolkit/segment-dropdown-tool'
import { colorToolCreator } from '../_utils/color-tool-creator'
import { I18n } from '@textbus/editor'
import { colorFormatter } from '@/editor'


export function colorToolConfigFactory(injector: Injector): SegmentDropdownToolConfig {
  const i18n = injector.get(I18n).getContext('plugins.toolbar.colorTool')
  return {
    iconClasses: ['textbus-icon-color'],
    tooltip: i18n.get('tooltip'),
    keymap: {
      ctrlKey: true,
      // altKey: true,
      shiftKey: true,
      key: 'c'
    },
    ...colorToolCreator(injector, colorFormatter)
  }
}

export function colorTool() {
  return new SegmentDropdownTool(colorToolConfigFactory)
}
