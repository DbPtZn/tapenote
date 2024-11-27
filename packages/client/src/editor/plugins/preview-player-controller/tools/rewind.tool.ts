import { Injector } from '@textbus/core'
import { ButtonTool, ButtonToolConfig } from '../toolkit/_index'
import { MaterialTypeEnum, Player } from '../../..'

function rewindToolConfigFactory(injector: Injector): ButtonToolConfig {
  const player = injector.get(Player)
  return {
    iconClasses: [`${MaterialTypeEnum.OUTLINED}replay_5`],
    tooltip: '倒退',
    // keymap: {
    //   ctrlKey: true,
    //   key: '1'
    // },
    updateState() {
      return  {}
    },
    onClick() {
      player.rewind()
    }
  }
}

export function preview_rewindTool() {
  return new ButtonTool(rewindToolConfigFactory)
}
