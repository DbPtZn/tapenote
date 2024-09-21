import { useProduce } from '@viewfly/hooks'
import { inject, onUnmounted, createSignal, Props } from '@viewfly/core'
import { Commander, Query, QueryStateType, Range, Slot, Selection, Component, ContentType, Textbus } from '@textbus/core'
import { withScopedCSS } from '@viewfly/scoped-css'
import { HTMLAttributes } from '@viewfly/platform-browser'

import { Button } from '../../components/button/button'
import { RefreshService } from '../../services/refresh.service'
import { animeFormatter } from '../../textbus/formatters/_api'
import { Dropdown, DropdownProps } from '../../components/dropdown/dropdown'
import css from './anime-tool.scoped.scss'
import { AnimeProvider } from '../../providers/_api'
import { AnimeComponent } from '../../textbus/components/_api'

export interface AnimeToolProps extends Props {
  abreast?: DropdownProps['abreast']
  style?: HTMLAttributes<HTMLElement>['style']
  slot?: Slot | null
  component?: Component | null

  /** 应用之前的回调 */
  applyBefore?(): void
  onApply?(effect: string, title: string): void
  onExpendStateChange?(is: boolean): void
}

export function AnimeTool(props: AnimeToolProps) {
  const query = inject(Query)
  const refreshService = inject(RefreshService)
  const commander = inject(Commander)
  const selection = inject(Selection)
  const animeProvider = inject(AnimeProvider)
  const animeOptions = animeProvider.getOptions()
  const textbus = inject(Textbus)
  
  const animeOption = createSignal('')
  const usedOption = createSignal(animeOptions[0])
  
  const [viewModel] = useProduce({
    highlight: false,
    disabled: false,
  })

  function updateCheckState() {
    if (!props.slot && !selection.isSelected) {
      return
    }
    const range: Range = props.slot ? {
      startSlot: props.slot,
      endSlot: props.slot,
      startOffset: 0,
      endOffset: props.slot.length
    } : {
      startSlot: selection.startSlot!,
      startOffset: selection.startOffset!,
      endSlot: selection.endSlot!,
      endOffset: selection.endOffset!
    }
    const animeState = query.queryFormatByRange(animeFormatter, range)

    animeOption.set(animeState.state === QueryStateType.Enabled ? animeState.value?.dataEffect || '' : '')
  }

  const sub = refreshService.onRefresh.subscribe(() => {
    updateCheckState()
  })

  updateCheckState()

  onUnmounted(() => {
    sub.unsubscribe()
  })

  return withScopedCSS(css, () => {
    const vm = viewModel()
    return (
      <Dropdown style={props.style} width={'326px'} abreast={props.abreast} trigger={'hover'} onExpendStateChange={props.onExpendStateChange} menu={
        <div class="dropdown-container">
          <div class="title">动画选项</div>
          <div class="anime-options">
            {
              animeOptions.map(c => {
                return <div 
                    class={{
                      'anime-option': true,
                      active: animeOption() === c.value
                    }} 
                    onClick={() => {
                      props.applyBefore?.()
                      props.onApply?.(c.value, c.label)
                      if(props.component) {
                        AnimeComponent.addAnime(props.component, textbus, c.value, c.label)
                        return
                      }
                      usedOption.set(c)
                      commander.applyFormat(animeFormatter, {
                        dataId: animeProvider.generateAnimeId(),
                        dataSerial: animeProvider.generateAnimeSerial().toString(),
                        dataEffect: c.value,
                        dataState: 'inactive',
                        dataTitle: c.label
                      })
                    }}
                    onMouseenter={ev => c.play((ev.target as HTMLElement).firstChild as HTMLElement)}
                    >
                      <div>{c.label}</div>
                </div>
              })
            }
          </div>
        </div>
      }>
        {
          props.children || <Button highlight={vm.highlight} arrow={true} disabled={vm.disabled}>
          <span class="anime-btn">
            <span class="anime-icon">{ usedOption().label }</span>
          </span>
          </Button>
        }
      </Dropdown>
    )
  })
}
