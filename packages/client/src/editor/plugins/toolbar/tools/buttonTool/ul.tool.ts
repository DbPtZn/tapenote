
import { Injector } from '@textbus/core'
import { ButtonTool, ButtonToolConfig } from '../../toolkit'

import { listToolCreator } from '../_utils/list-tool-creator'
import { I18n } from '@textbus/editor'


export function ulToolConfigFactory(injector: Injector): ButtonToolConfig {
  const i18n = injector.get(I18n)
  return {
    iconClasses: ['textbus-icon-list'],
    tooltip: i18n.get('plugins.toolbar.ulTool.tooltip'),
    keymap: {
      shiftKey: true,
      ctrlKey: true,
      key: 'u'
    },
    ...listToolCreator(injector, 'ul')
  }
}

export function ulTool() {
  return new ButtonTool(ulToolConfigFactory)
}
