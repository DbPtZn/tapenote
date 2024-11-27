import { Commander, Injector } from '@textbus/core'
import { ButtonTool, ButtonToolConfig } from '../../toolkit'
import { I18n } from '@textbus/editor'
import { dividerComponent } from '../../../../components'


export function dividerToolConfigFactory(injector: Injector): ButtonToolConfig {
  // const query = injector.get(Query)
  const commander = injector.get(Commander)
  const i18n = injector.get(I18n)
  return {
    iconClasses: [`material-icons-outlined-horizontal_rule`],
    tooltip: i18n.get('plugins.toolbar.dividerTool.tooltip'),
    // keymap: {
    //   altKey: true,
    //   key: 'd'
    // },
    // queryState(): QueryState<any>  {
    //   const divider = query.queryComponent(dividerComponent)
    //   return divider
    // },
    onClick() {
      const divider = dividerComponent.createInstance(injector)
      commander.insert(divider)
    }
  }
}

export function dividerTool() {
  return new ButtonTool(dividerToolConfigFactory)
}
