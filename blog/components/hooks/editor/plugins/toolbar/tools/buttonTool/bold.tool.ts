import { Commander, QueryState, FormatValue, Query, QueryStateType, Injector } from '@textbus/core'
import { ButtonTool, ButtonToolConfig } from '../../toolkit'
import { I18n, boldFormatter } from '@textbus/editor'


export function boldToolConfigFactory(injector: Injector): ButtonToolConfig {
  const query = injector.get(Query)
  const commander = injector.get(Commander)
  const i18n = injector.get(I18n)
  return {
    // iconClasses: [`${MaterialTypeEnum.FILLED}format_bold`],
    iconClasses: [`textbus-icon-bold`],
    tooltip: i18n.get('plugins.toolbar.boldTool.tooltip'),
    keymap: {
      ctrlKey: true,
      key: 'b'
    },
    queryState(): QueryState<FormatValue> {
      return query.queryFormat(boldFormatter)
    },
    onClick() {
      const state = query.queryFormat(boldFormatter)
      const b = state.state === QueryStateType.Enabled
      b ? commander.unApplyFormat(boldFormatter) : commander.applyFormat(boldFormatter, '')
    }
  }
}

export function boldTool() {
  return new ButtonTool(boldToolConfigFactory)
}
