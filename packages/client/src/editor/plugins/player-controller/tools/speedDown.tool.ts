import { Injector } from '@textbus/core'
import { ButtonTool, ButtonToolConfig } from '../toolkit/_index'
import { MaterialTypeEnum, Player } from '../../..'

export function speedDownToolConfigFactory(injector: Injector): ButtonToolConfig {
  const player = injector.get(Player)
  return {
    iconClasses: [`${MaterialTypeEnum.OUTLINED}keyboard_double_arrow_up`],
    tooltip: '减速',
    // keymap: {
    //   ctrlKey: true,
    //   key: '1'
    // },
    queryState() {
      return {}
    },
    onClick() {
      player.speedDown()
    }
  }
}

export function speedDownTool() {
  return new ButtonTool(speedDownToolConfigFactory)
}
