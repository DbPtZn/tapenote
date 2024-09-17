
import { Commander, QueryState, FormatValue, Query, QueryStateType, Injector } from '@textbus/core'
import { ButtonTool, ButtonToolConfig } from '../../toolkit'
import { I18n, italicFormatter } from '@textbus/editor'


export function italicToolConfigFactory(injector: Injector): ButtonToolConfig {
  const query = injector.get(Query)
  const commander = injector.get(Commander)
  const i18n = injector.get(I18n)
  return {
    iconClasses: ['textbus-icon-italic'],
    tooltip: i18n.get('plugins.toolbar.italicTool.tooltip'),
    keymap: {
      ctrlKey: true,
      key: 'i'
    },
    queryState(): QueryState<FormatValue> {
      return query.queryFormat(italicFormatter)
    },
    onClick() {
      const state = query.queryFormat(italicFormatter)
      const b = state.state === QueryStateType.Enabled
      b ? commander.unApplyFormat(italicFormatter) : commander.applyFormat(italicFormatter, true)
    }
  }
}

export function italicTool() {
  return new ButtonTool(italicToolConfigFactory)
}
