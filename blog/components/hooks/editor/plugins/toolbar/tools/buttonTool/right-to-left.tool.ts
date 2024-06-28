
import { Commander, QueryState, FormatValue, Query, QueryStateType, Injector } from '@textbus/core'
import { ButtonTool, ButtonToolConfig } from '../../toolkit'
import { I18n, dirFormatter } from '@textbus/editor'


export function rightToLeftToolConfigFactory(injector: Injector): ButtonToolConfig {
  const i18n = injector.get(I18n)
  const query = injector.get(Query)
  const commander = injector.get(Commander)
  return {
    iconClasses: ['textbus-icon-rtl'],
    tooltip: i18n.get('plugins.toolbar.rightToLeftTool.tooltip'),
    queryState(): QueryState<FormatValue> {
      const state = query.queryAttribute(dirFormatter)
      return {
        state: state.value === 'rtl' ? QueryStateType.Enabled : QueryStateType.Normal,
        value: state.value
      }
    },
    onClick() {
      const state = query.queryAttribute(dirFormatter)
      const b = state.value === 'rtl'
      b ? commander.unApplyAttribute(dirFormatter) : commander.applyAttribute(dirFormatter, 'rtl')
    }
  }
}

export function rightToLeftTool() {
  return new ButtonTool(rightToLeftToolConfigFactory)
}
