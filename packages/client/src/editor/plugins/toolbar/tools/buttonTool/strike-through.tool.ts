
import { Commander, QueryState, FormatValue, Query, QueryStateType, Injector } from '@textbus/core'
import { ButtonTool, ButtonToolConfig } from '../../toolkit'
import { I18n, strikeThroughFormatter } from '@textbus/editor'

// import { zh_CN } from '../../../../i18n/_api'

export function strikeThroughToolConfigFactory(injector: Injector): ButtonToolConfig {
  const i18n = injector.get(I18n)
  const query = injector.get(Query)
  const commander = injector.get(Commander)
  return {
    iconClasses: ['textbus-icon-strikethrough'],
    tooltip: i18n.get('plugins.toolbar.strikeThrough.tooltip'),
    keymap: {
      ctrlKey: true,
      key: 'd'
    },
    queryState(): QueryState<FormatValue> {
      return query.queryFormat(strikeThroughFormatter)
    },
    onClick() {
      const state = query.queryFormat(strikeThroughFormatter)
      const b = state.state === QueryStateType.Enabled
      b ? commander.unApplyFormat(strikeThroughFormatter) : commander.applyFormat(strikeThroughFormatter, true)
    }
  }
}

export function strikeThroughTool() {
  return new ButtonTool(strikeThroughToolConfigFactory)
}
