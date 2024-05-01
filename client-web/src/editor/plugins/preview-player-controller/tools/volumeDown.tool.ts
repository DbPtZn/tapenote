import { Injector } from '@textbus/core'
import { ButtonTool, ButtonToolConfig } from '../toolkit/_index'
import { MaterialTypeEnum, Player } from '@/editor'

function volumeDownToolConfigFactory(injector: Injector): ButtonToolConfig {
  const player = injector.get(Player)
  return {
    iconClasses: [`${MaterialTypeEnum.FILLED}volume_down`, `${MaterialTypeEnum.FILLED}volume_off`],
    tooltip: '降低音量',
    // keymap: {
    //   ctrlKey: true,
    //   key: '1'
    // },
    updateState() {
      return { iconIndex: player.volume > 0 ? 0 : 1, disabled: player.volume <= 0 }
    },
    onClick() {
      player.volumeDown()
    }
  }
}

export function preview_volumeDownTool() {
  return new ButtonTool(volumeDownToolConfigFactory)
}
