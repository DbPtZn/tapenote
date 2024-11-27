import { Injector } from '@textbus/core'
import { ButtonTool, ButtonToolConfig } from '../toolkit/_index'
import { MaterialTypeEnum, Player } from '../../..'

export function volumeDownToolConfigFactory(injector: Injector): ButtonToolConfig {
  const player = injector.get(Player)
  return {
    iconClasses: [`${MaterialTypeEnum.OUTLINED}volume_down`, `${MaterialTypeEnum.OUTLINED}volume_off`],
    tooltip: '降低音量',
    // keymap: {
    //   ctrlKey: true,
    //   key: '1'
    // },
    queryState() {
      return { iconIndex: player.volume > 0 ? 0 : 1, disabled: player.volume <= 0 }
    },
    onClick() {
      player.volumeDown()
    }
  }
}

export function volumeDownTool() {
  return new ButtonTool(volumeDownToolConfigFactory)
}
