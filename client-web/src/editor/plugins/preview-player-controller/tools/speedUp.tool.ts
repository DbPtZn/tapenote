import { Injector } from '@textbus/core'
import { ButtonTool, ButtonToolConfig } from '../toolkit/_index'
import { MaterialTypeEnum, Player } from '@/editor'

function speedUpToolConfigFactory(injector: Injector): ButtonToolConfig {
  const player = injector.get(Player)
  return {
    iconClasses: [`${MaterialTypeEnum.FILLED}keyboard_double_arrow_down`],
    tooltip: '加速',
    // keymap: {
    //   ctrlKey: true,
    //   key: '1'
    // },
    updateState() {
      return {}
    },
    onClick() {
      player.speedUp()
    }
  }
}

export function preview_speedUpTool() {
  return new ButtonTool(speedUpToolConfigFactory)
}
