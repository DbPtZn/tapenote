import { Injector } from '@textbus/core'
import { ButtonTool, ButtonToolConfig } from '../toolkit/_index'
import { MaterialTypeEnum, Player } from '../../..'

export function forwardToolConfigFactory(injector: Injector): ButtonToolConfig {
  const player = injector.get(Player)
  return {
    iconClasses: [`${MaterialTypeEnum.OUTLINED}forward_5`],
    tooltip: '快进',
    // keymap: {
    //   ctrlKey: true,
    //   key: '1'
    // },
    queryState() {
      return  {}
    },
    onClick() {
      player.forward()
    }
  }
}

export function forwardTool() {
  return new ButtonTool(forwardToolConfigFactory)
}
