import { Injector } from '@textbus/core'
import { ButtonTool, ButtonToolConfig } from '../toolkit/_index'
import { MaterialTypeEnum, Player } from '@/editor'

function startToolConfigFactory(injector: Injector): ButtonToolConfig {
  const player = injector.get(Player)
  return {
    iconClasses: [`${MaterialTypeEnum.FILLED}play_arrow`, `${MaterialTypeEnum.FILLED}pause`],
    tooltip: '开始',
    keymap: {
      ctrlKey: true,
      key: '1'
    },
    updateState() {
      return { iconIndex: player.isPlaying ? 1 : 0 }
    },
    onClick() {
      if (!player.isPlaying && !player.isPause) return player.start()
      if (player.isPlaying && !player.isPause) return player.pause()
      if (!player.isPlaying && player.isPause) return player.resume()
    }
  }
}

export function preview_startTool() {
  return new ButtonTool(startToolConfigFactory)
}
