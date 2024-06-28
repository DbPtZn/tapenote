
import { Commander, QueryState, FormatValue, Query, QueryStateType, Injector } from '@textbus/core'
import { ButtonTool, ButtonToolConfig } from '../../toolkit'
import { I18n, subscriptFormatter } from '@textbus/editor'


export function subscriptToolConfigFactory(injector: Injector): ButtonToolConfig {
  const i18n = injector.get(I18n)
  const query = injector.get(Query)
  const commander = injector.get(Commander)
  return {
    iconClasses: ['textbus-icon-subscript'],
    tooltip: i18n.get('plugins.tooltip.subscript.tooltip'),
    queryState(): QueryState<FormatValue> {
      return query.queryFormat(subscriptFormatter)
    },
    onClick() {
      const state = query.queryFormat(subscriptFormatter)
      const b = state.state === QueryStateType.Enabled
      b ? commander.unApplyFormat(subscriptFormatter) : commander.applyFormat(subscriptFormatter, true)
    }
  }
}

export function subscriptTool() {
  return new ButtonTool(subscriptToolConfigFactory)
}
