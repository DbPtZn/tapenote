import { Commander, QueryState, FormatValue, Query, QueryStateType, Injector, Selection } from '@textbus/core'
import { ButtonTool, ButtonToolConfig } from '../../toolkit'
import { I18n, linkFormatter } from '@textbus/editor'

export function cleanToolConfigFactory(injector: Injector): ButtonToolConfig<any> {
  const selection = injector.get(Selection)
  const commander = injector.get(Commander)
  const i18n = injector.get(I18n)
  return {
    iconClasses: ['textbus-icon-clear-formatting'],
    tooltip: i18n.get('plugins.toolbar.cleanTool.tooltip'),
    keymap: {
      ctrlKey: true,
      shiftKey: true,
      altKey: true,
      key: 'c'
    },
    queryState(): QueryState<any> {
      return {
        state: selection.isCollapsed ? QueryStateType.Disabled : QueryStateType.Normal,
        value: null
      }
    },
    onClick() {
      commander.cleanFormats([linkFormatter])
      commander.cleanAttributes()
    }
  }
}

export function cleanTool() {
  return new ButtonTool(cleanToolConfigFactory)
}
