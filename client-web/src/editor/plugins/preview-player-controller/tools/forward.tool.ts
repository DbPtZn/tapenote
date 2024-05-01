import { Injector } from '@textbus/core'
import { ButtonTool, ButtonToolConfig } from '../toolkit/_index'
import { MaterialTypeEnum, Player } from '@/editor'

function forwardToolConfigFactory(injector: Injector): ButtonToolConfig {
  const player = injector.get(Player)
  return {
    iconClasses: [`${MaterialTypeEnum.FILLED}forward_5`],
    tooltip: '快进',
    // keymap: {
    //   ctrlKey: true,
    //   key: '1'
    // },
    updateState() {
      return  {}
    },
    onClick() {
      player.forward()
    }
  }
}

export function preview_forwardTool() {
  return new ButtonTool(forwardToolConfigFactory)
}
