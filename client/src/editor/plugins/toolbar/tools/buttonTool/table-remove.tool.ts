
import { Commander, QueryState, FormatValue, Query, QueryStateType, Injector } from '@textbus/core'
import { ButtonTool, ButtonToolConfig } from '../../toolkit'
import { I18n, tableComponent } from '@textbus/editor'

export function tableRemoveToolConfigFactory(injector: Injector): ButtonToolConfig {
  const i18n = injector.get(I18n)
  const query = injector.get(Query)
  const commander = injector.get(Commander)
  return {
    iconClasses: ['textbus-icon-table-remove'],
    tooltip: i18n.get('plugins.toolbar.tableAddTool.tooltip'),
    queryState(): QueryState<any> {
      const s = query.queryComponent(tableComponent)
      if (s.state !== QueryStateType.Enabled) {
        s.state = QueryStateType.Disabled
      } else if (s.state === QueryStateType.Enabled) {
        s.state = QueryStateType.Normal
      }
      return s
    },
    onClick() {
      const s = query.queryComponent(tableComponent)
      if (s.state === QueryStateType.Enabled) {
        commander.removeComponent(s.value!)
      }
    }
  }
}

export function tableRemoveTool() {
  return new ButtonTool(tableRemoveToolConfigFactory)
}
