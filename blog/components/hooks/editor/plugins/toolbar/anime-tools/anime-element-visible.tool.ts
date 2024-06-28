import { SwitchButtonState, SwitchButtonTool, SwitchButtonToolConfig  } from '..'
import { Injector } from '@textbus/core'
import { Layout } from '@textbus/editor'
import { MaterialTypeEnum } from '../toolkit/_utils/MaterialTypeEnum'


export function animeElementVisibleToolConfigFactory(injector: Injector, updateState: (state: SwitchButtonState) => void): SwitchButtonToolConfig {
  const layout = injector.get(Layout)
  const container = layout.container
  return {
    iconClasses: [`${MaterialTypeEnum.FILLED}visibility`, `${MaterialTypeEnum.FILLED}visibility_off`],
    // label: '隐藏动画',
    tooltip: '隐藏动画元素',
    onClick() {
      if (container.classList.contains('anime-element-hidden')) {
        container.classList.remove('anime-element-hidden')
        updateState({
          iconIndex: 0
        })
        return
      }
      container.classList.add('anime-element-hidden')
      updateState({
        iconIndex: 1
      })
    }
  }
}

export function animeElementVisibleTool() {
  return new SwitchButtonTool(animeElementVisibleToolConfigFactory)
}
