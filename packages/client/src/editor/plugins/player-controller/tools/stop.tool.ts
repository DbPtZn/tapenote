import { Injector } from '@textbus/core'
import { ButtonTool, ButtonToolConfig } from '../toolkit/_index'
import { MaterialTypeEnum, Player } from '../../..'

export function stopToolConfigFactory(injector: Injector): ButtonToolConfig {
  const player = injector.get(Player)
  return {
    iconClasses: [`${MaterialTypeEnum.FILLED}stop`],
    tooltip: '停止',
    disabled: true,
    // keymap: {
    //   ctrlKey: true,
    //   key: '1'
    // },
    queryState() {
      return { disabled: !((player.isPlaying === false && player.isPause === true) || (player.isPlaying === true && player.isPause === false))}
      // if (player.isPlaying === false && player.isPause === true) return { disabled: false }
      // if (player.isPlaying === true && player.isPause === false) return { disabled: false }
      // return { disabled: !player.isPlaying }
    },
    onClick() {
      player.stop()
    }
  }
}

export function stopTool() {
  return new ButtonTool(stopToolConfigFactory)
}
