import { Controller, Keymap, QueryState, QueryStateType, Injector } from '@textbus/core'
import {  Ref, VNode, h, ref } from 'vue'
import { Tool } from './types';
import AnimePopover from './utils/UIAnimePopover.vue'
import { AnimeProvider } from '@/editor';
export interface AnimeSegmentPopoverToolConfig<T = any> {

  /** 快捷键配置 */
  keymap?: Keymap;
  /** 给当前控件添加一组 css class */
  classes?: string[];
  /** 给当前控件添加一组 icon css class */
  iconClasses?: string[];
  /** 当鼠标放在控件上的提示文字 */
  tooltip?: string;
  /** 设置控件显示的文字 */
  label?: string;

  useValue?(value: T): void

  queryState?(): QueryState<T>

  onDestroy?(): void
}

export class AnimeSegmentPopoverTool implements Tool {
  private config!: AnimeSegmentPopoverToolConfig
  private controller!: Controller
  private isHighlight: Ref<boolean>
  private isDisabled: Ref<boolean>
  private currentValue: Ref<any>

  constructor(private factory: (injector: Injector) => AnimeSegmentPopoverToolConfig) {
    this.isHighlight = ref(false)
    this.isDisabled = ref(false)
    this.currentValue = ref('')
  }

  setup(injector: Injector): VNode {
    const anime = injector.get(AnimeProvider)
    const animeOptions = anime.getOptions()
    const config = this.factory(injector)
    this.controller = injector.get(Controller)
    this.config = config
    const segmentPopover = h(AnimePopover, {
      tooltip: config.tooltip,
      keymap: config.keymap,
      iconClasses: config.iconClasses,
      options: animeOptions,
      onSelected: (value: string) => {
        config.useValue && config.useValue(value)
      },
      currentValue: () => this.currentValue.value,
      highlight: () => this.isHighlight.value,
      disabled: () => this.isDisabled.value
    })
    this.controller.onReadonlyStateChange.subscribe(v => {
      this.isDisabled.value = v
    })
    return segmentPopover
  }

  disabled(is: boolean) {
    if (is) {
      this.isDisabled.value = true
      this.isHighlight.value = false
    }
  }

  refreshState() {
    if (!this.config.queryState) {
      return
    }
    if (this.controller.readonly) {
      this.isDisabled.value = true
      this.isHighlight.value = false
      return
    }
    const state = this.config.queryState()
    this.currentValue.value = state.value
    switch (state.state) {
      case QueryStateType.Enabled:
        this.isDisabled.value = false
        this.isHighlight.value = true
        break
      case QueryStateType.Normal:
        this.isDisabled.value = false
        this.isHighlight.value = false
        break
      case QueryStateType.Disabled:
        this.isDisabled.value = true
        this.isHighlight.value = false
        break
    }
  }

  onDestroy() {
    this.config.onDestroy?.()
  }
}
