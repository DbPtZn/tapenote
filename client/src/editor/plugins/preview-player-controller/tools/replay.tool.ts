import { Injector } from '@textbus/core'
import { ButtonTool, ButtonToolConfig } from '../toolkit/_index'
import { MaterialTypeEnum, Player } from '@/editor'

function replayToolConfigFactory(injector: Injector): ButtonToolConfig {
  const player = injector.get(Player)
  return {
    iconClasses: [`${MaterialTypeEnum.FILLED}replay`],
    tooltip: '重播',
    // keymap: {
    //   ctrlKey: true,
    //   key: '1'
    // },
    updateState() {
      return  {}
    },
    onClick() {
      player.replay()
    }
  }
}

export function preview_replayTool() {
  return new ButtonTool(replayToolConfigFactory)
}
