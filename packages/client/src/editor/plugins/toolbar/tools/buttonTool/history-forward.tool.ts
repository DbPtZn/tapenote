import { QueryState, History, QueryStateType, Injector } from '@textbus/core'
import { ButtonTool, ButtonToolConfig } from '../../toolkit'
import { I18n } from '@textbus/editor'

export function historyForwardToolConfigFactory(injector: Injector): ButtonToolConfig {
  const history = injector.get(History)
  const i18n = injector.get(I18n)
  return {
    iconClasses: [`textbus-icon-history-forward`],
    tooltip: i18n.get('plugins.toolbar.historyForwardTool.tooltip'),
    keymap: {
      ctrlKey: true,
      // shiftKey: true,
      key: 'y'
    },
    queryState(): QueryState<boolean> {
      return {
        state: history.canForward ? QueryStateType.Normal : QueryStateType.Disabled,
        value: null
      }
    },
    onClick() {
      history.forward()
    }
  }
}

export function historyForwardTool() {
  return new ButtonTool(historyForwardToolConfigFactory)
}
