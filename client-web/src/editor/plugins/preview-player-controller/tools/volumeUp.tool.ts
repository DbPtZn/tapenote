import { Injector } from '@textbus/core'
import { ButtonTool, ButtonToolConfig } from '../toolkit/_index'
import { MaterialTypeEnum, Player } from '@/editor'

function volumeUpToolConfigFactory(injector: Injector): ButtonToolConfig {
  const player = injector.get(Player)
  return {
    iconClasses: [`${MaterialTypeEnum.FILLED}volume_up`],
    tooltip: '增大音量',
    // keymap: {
    //   ctrlKey: true,
    //   key: '1'
    // },
    updateState() {
      return { disabled: player.volume >= 1 }
    },
    onClick() {
      player.volumeUp()
    }
  }
}

export function preview_volumeUpTool() {
  return new ButtonTool(volumeUpToolConfigFactory)
}
