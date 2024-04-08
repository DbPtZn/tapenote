import { QueryState, History, QueryStateType, Injector } from '@textbus/core'
import { ButtonTool, ButtonToolConfig } from '../../toolkit'
import { I18n } from '@textbus/editor'
// import { zh_CN } from '../../../../i18n/_api'

export function historyBackToolConfigFactory(injector: Injector): ButtonToolConfig {
  const history = injector.get(History)
  const i18n = injector.get(I18n)
  return {
    iconClasses: [`textbus-icon-history-back`],
    tooltip: i18n.get('plugins.toolbar.historyBackTool.tooltip'),
    keymap: {
      ctrlKey: true,
      key: 'z'
    },
    queryState(): QueryState<boolean> {
      return {
        state: history.canBack ? QueryStateType.Normal : QueryStateType.Disabled,
        value: null
      }
    },
    onClick() {
      history.back()
    }
  }
}

export function historyBackTool() {
  return new ButtonTool(historyBackToolConfigFactory)
}
