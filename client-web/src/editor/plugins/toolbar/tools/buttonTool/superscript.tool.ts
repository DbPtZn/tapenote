
import { Commander, QueryState, FormatValue, Query, QueryStateType, Injector } from '@textbus/core'
import { ButtonTool, ButtonToolConfig } from '../../toolkit'
import { I18n, superscriptFormatter } from '@textbus/editor'


export function superscriptToolConfigFactory(injector: Injector): ButtonToolConfig {
  const i18n = injector.get(I18n)
  const query = injector.get(Query)
  const commander = injector.get(Commander)
  return {
    iconClasses: ['textbus-icon-superscript'],
    tooltip: i18n.get('plugins.toolbar.superscript.tooltip'),
    queryState(): QueryState<FormatValue> {
      return query.queryFormat(superscriptFormatter)
    },
    onClick() {
      const state = query.queryFormat(superscriptFormatter)
      const b = state.state === QueryStateType.Enabled
      b ? commander.unApplyFormat(superscriptFormatter) : commander.applyFormat(superscriptFormatter, true)
    }
  }
}

export function superscriptTool() {
  return new ButtonTool(superscriptToolConfigFactory)
}
