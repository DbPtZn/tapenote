import { Injector } from '@textbus/core'
import { ButtonTool, ButtonToolConfig } from '../toolkit/_index'
import { MaterialTypeEnum, Player } from '../../..'

export function speedUpToolConfigFactory(injector: Injector): ButtonToolConfig {
  const player = injector.get(Player)
  return {
    iconClasses: [`${MaterialTypeEnum.OUTLINED}keyboard_double_arrow_down`],
    tooltip: '加速',
    // keymap: {
    //   ctrlKey: true,
    //   key: '1'
    // },
    queryState() {
      return {}
    },
    onClick() {
      player.speedUp()
    }
  }
}

export function speedUpTool() {
  return new ButtonTool(speedUpToolConfigFactory)
}
