import { Injector } from '@textbus/core'
import { ButtonTool, ButtonToolConfig } from '../toolkit/_index'
import { MaterialTypeEnum, Player } from '../../..'

function speedDownToolConfigFactory(injector: Injector): ButtonToolConfig {
  const player = injector.get(Player)
  return {
    iconClasses: [`${MaterialTypeEnum.FILLED}keyboard_double_arrow_up`],
    tooltip: '减速',
    // keymap: {
    //   ctrlKey: true,
    //   key: '1'
    // },
    updateState() {
      return {}
    },
    onClick() {
      player.speedDown()
    }
  }
}

export function preview_speedDownTool() {
  return new ButtonTool(speedDownToolConfigFactory)
}
