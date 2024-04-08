import { Injector } from '@textbus/core'
import { ButtonTool, ButtonToolConfig } from '../toolkit/_index'
import { MaterialTypeEnum, Player } from '@/editor'

export function rewindToolConfigFactory(injector: Injector): ButtonToolConfig {
  const player = injector.get(Player)
  return {
    iconClasses: [`${MaterialTypeEnum.FILLED}replay_5`],
    tooltip: '倒退',
    // keymap: {
    //   ctrlKey: true,
    //   key: '1'
    // },
    queryState() {
      return  {}
    },
    onClick() {
      player.rewind()
    }
  }
}

export function rewindTool() {
  return new ButtonTool(rewindToolConfigFactory)
}
