import { SwitchButtonState, SwitchButtonTool, SwitchButtonToolConfig } from '@/editor'
import { Injector } from '@textbus/core'
import { Layout } from '@textbus/editor'
import { MaterialTypeEnum } from '../toolkit/_utils/MaterialTypeEnum'

export function animeBadgeVisibleToolConfigFactory(injector: Injector, updateState: (state: SwitchButtonState) => void): SwitchButtonToolConfig {
  // const editor = injector.get(Editor)
  // const commander = injector.get(Commander)
  // const animeState = injector.get(AnimeStateProvider)
  const layout = injector.get(Layout)
  const container = layout.container
  return {
    iconClasses: [`${MaterialTypeEnum.FILLED}bubble_chart`, `${MaterialTypeEnum.OUTLINED}bubble_chart`],
    // iconClasses: [`textbus-icon-bold`],
    // label: '隐藏标记',
    tooltip: '隐藏动画标记',
    onClick() {
      if (container.classList.contains('anime-badge-hidden')) {
        container.classList.remove('anime-badge-hidden')
        updateState({
          iconIndex: 0
        })
        return
      }
      container.classList.add('anime-badge-hidden')
      // editor.readonly = true
      updateState({
        iconIndex: 1
      })
    }
  }
}

export function animeBadgeVisibleTool() {
  return new SwitchButtonTool(animeBadgeVisibleToolConfigFactory)
}
