import { useProduce } from '@viewfly/hooks'
import { inject, onUnmounted, createSignal, Props } from '@viewfly/core'
import { Commander, Query, QueryStateType, Range, Slot, Selection } from '@textbus/core'
import { withScopedCSS } from '@viewfly/scoped-css'
import { HTMLAttributes } from '@viewfly/platform-browser'

import { Button } from '../../components/button/button'
import { RefreshService } from '../../services/refresh.service'
import { animeFormatter } from '../../textbus/formatters/_api'
import { Dropdown, DropdownProps } from '../../components/dropdown/dropdown'
import css from './anime-tool.scoped.scss'
import { AnimeProvider } from '../../providers/_api'

export interface AnimeToolProps extends Props {
  abreast?: DropdownProps['abreast']
  style?: HTMLAttributes<HTMLElement>['style']
  slot?: Slot | null

  /** 应用之前的回调 */
  applyBefore?(): void

  onExpendStateChange?(is: boolean): void
}

export function AnimeTool(props: AnimeToolProps) {
  const query = inject(Query)
  const refreshService = inject(RefreshService)
  const commander = inject(Commander)
  const selection = inject(Selection)
  const animeProvider = inject(AnimeProvider)
  const animeOptions = animeProvider.getOptions()

  const animeOption = createSignal('')

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
      <Dropdown style={props.style} width={'180px'} abreast={props.abreast} trigger={'hover'} onExpendStateChange={props.onExpendStateChange} menu={
        <div class="dropdown-container">
          <div class="title">动画选项</div>
          <div class="anime-options">
            <div class={{
              'no-background': true,
              active: animeOption() === ''
            }} onClick={() => {
              props.applyBefore?.()
              commander.unApplyFormat(animeFormatter)
            }}>
            </div>
            {
              animeOptions.map(c => {
                return <div class={{
                  active: animeOption() === c.value
                }} onClick={() => {
                  props.applyBefore?.()
                  commander.applyFormat(animeFormatter, {
                    dataId: animeProvider.generateAnimeId(),
                    dataSerial: animeProvider.generateAnimeSerial().toString(),
                    dataEffect: c.value,
                    dataState: 'inactive',
                    dataTitle: c.label
                  })
                }}>AM</div>
              })
            }
          </div>
        </div>
      }>
        {
          props.children || <Button highlight={vm.highlight} arrow={true} disabled={vm.disabled}>
          <span class="anime-btn">
            <span>
              <span class="anime-icon">AM</span>
            </span>
          </span>
          </Button>
        }
      </Dropdown>
    )
  })
}
