
import { Commander, QueryState, FormatValue, Query, QueryStateType, Injector } from '@textbus/core'
import { ButtonTool, ButtonToolConfig } from '../../toolkit'
import { I18n, underlineFormatter } from '@textbus/editor'


export function underlineToolConfigFactory(injector: Injector): ButtonToolConfig {
  const query = injector.get(Query)
  const commander = injector.get(Commander)
  const i18n = injector.get(I18n)
  return {
    iconClasses: ['textbus-icon-underline'],
    tooltip: i18n.get('plugins.toolbar.ulTool.tooltip'),
    keymap: {
      ctrlKey: true,
      key: 'u'
    },
    queryState(): QueryState<FormatValue> {
      return query.queryFormat(underlineFormatter)
    },
    onClick() {
      const state = query.queryFormat(underlineFormatter)
      const b = state.state === QueryStateType.Enabled
      b ? commander.unApplyFormat(underlineFormatter) : commander.applyFormat(underlineFormatter, true)
    }
  }
}

export function underlineTool() {
  return new ButtonTool(underlineToolConfigFactory)
}
