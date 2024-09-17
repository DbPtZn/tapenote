import { Commander, QueryState, FormatValue, Query, QueryStateType, Injector } from '@textbus/core'
import { ButtonTool, ButtonToolConfig } from '../../toolkit'
import { I18n, codeFormatter } from '@textbus/editor'

export function codeToolConfigFactory(injector: Injector): ButtonToolConfig {
  const i18n = injector.get(I18n)
  const query = injector.get(Query)
  const commander = injector.get(Commander)
  return {
    iconClasses: ['textbus-icon-code'],
    tooltip: i18n.get('plugins.toolbar.codeTool.tooltip'),
    keymap: {
      key: ';',
      ctrlKey: true,
    },
    queryState(): QueryState<FormatValue> {
      return query.queryFormat(codeFormatter)
    },
    onClick() {
      const state = query.queryFormat(codeFormatter)
      const b = state.state === QueryStateType.Enabled
      b ? commander.unApplyFormat(codeFormatter) : commander.applyFormat(codeFormatter, true)
    }
  }
}

export function codeTool() {
  return new ButtonTool(codeToolConfigFactory)
}
