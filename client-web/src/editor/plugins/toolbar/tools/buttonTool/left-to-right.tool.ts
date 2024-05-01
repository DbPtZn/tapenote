
import { Commander, QueryState, FormatValue, Query, QueryStateType, Injector, Selection } from '@textbus/core'
import { ButtonTool, ButtonToolConfig } from '../../toolkit'
import { I18n, dirFormatter } from '@textbus/editor'


export function leftToRightToolConfigFactory(injector: Injector): ButtonToolConfig {
  const i18n = injector.get(I18n)
  const query = injector.get(Query)
  const commander = injector.get(Commander)
  return {
    iconClasses: ['textbus-icon-ltr'],
    tooltip: i18n.get('plugins.toolbar.leftToRightTool.tooltip'),
    queryState(): QueryState<FormatValue> {
      const state = query.queryAttribute(dirFormatter)
      return {
        state: state.value === 'ltr' ? QueryStateType.Enabled : QueryStateType.Normal,
        value: state.value
      }
    },
    onClick() {
      const state = query.queryAttribute(dirFormatter)
      const b = state.value === 'ltr'
      b ? commander.unApplyAttribute(dirFormatter) : commander.applyAttribute(dirFormatter, 'ltr')
    }
  }
}

export function leftToRightTool() {
  return new ButtonTool(leftToRightToolConfigFactory)
}
