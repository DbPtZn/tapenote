import { Injector } from '@textbus/core'
import { ButtonTool, ButtonToolConfig } from '../toolkit/_index'
import { MaterialTypeEnum, Player } from '@/editor'

export function volumeUpToolConfigFactory(injector: Injector): ButtonToolConfig {
  const player = injector.get(Player)
  return {
    iconClasses: [`${MaterialTypeEnum.FILLED}volume_up`],
    tooltip: '增大音量',
    // keymap: {
    //   ctrlKey: true,
    //   key: '1'
    // },
    queryState() {
      return { disabled: player.volume >= 1 }
    },
    onClick() {
      player.volumeUp()
    }
  }
}

export function volumeUpTool() {
  return new ButtonTool(volumeUpToolConfigFactory)
}
