import {
  Commander,
  Injector,
  Selection,
  Renderer,
  Injectable,
  VElement,
} from '@textbus/core'
import { animeFormatter } from '../formatters'
import { Layout } from '@textbus/editor'
import { ANIME, ANIME_COMPONENT_NAME } from '../anime.constant'
import { Input } from '@textbus/platform-browser'
interface AnimeState {
  id?: string
  effect?: string
  serial?: number
  state?: 'active' | 'inactive'
  title?: string
}
/** 控制管理动画状态 */
@Injectable()
export class AnimeStateProvider {
  private commander!: Commander
  private selection!: Selection
  private renderer!: Renderer
  private container!: HTMLElement
  // private animeUpdateEvent: Subject<AnimeState>
  // onAnimeUpdate: Observable<AnimeState>
  // private scrollerRef!: HTMLElement | null
  private input!: Input
  constructor() {
    // this.animeUpdateEvent = new Subject()
    // this.onAnimeUpdate = this.animeUpdateEvent.asObservable()
  }
  setup(injector: Injector, scrollerRef?: HTMLElement) {
    // this.injector = injector
    // this.rootComponent = injector.get(RootComponentRef)
    // this.scrollerRef = scrollerRef
    this.input = injector.get(Input)
    this.commander = injector.get(Commander)
    this.selection = injector.get(Selection)
    this.renderer = injector.get(Renderer)
    this.container = injector.get(Layout).container
  }
  // 启动激活
  setActive(aniId: string) {
    const elements = <NodeListOf<HTMLElement>>(
      this.container.querySelectorAll(`[data-id="${aniId}"]`)
    )
    if (elements.length !== 0) {
      elements.forEach((item) => {
        this.handleStateUpdate(item, aniId, { state: 'active' })
      })
    }
  }
  // 取消激活
  setInactive(aniId: string) {
    const elements = <NodeListOf<HTMLElement>>(
      this.container.querySelectorAll(`[data-id="${aniId}"]`)
    )
    if (elements.length !== 0) {
      elements.forEach((item) => {
        this.handleStateUpdate(item, aniId, { state: 'inactive' })
      })
    }
  }

  // 更新编号
  updateSerial(aniId: string, serial: number) {
    const elements = <NodeListOf<HTMLElement>>(
      this.container.querySelectorAll(`[data-id="${aniId}"]`)
    )
    if (elements.length !== 0) {
      elements.forEach((item) => {
        this.handleStateUpdate(item, aniId, { serial })
      })
    }
  }

  /** 更新动画的状态 */
  handleStateUpdate(element: HTMLElement, aniId: string, state: AnimeState) {
    if (element.tagName.toLowerCase() === ANIME) {
      // console.log('formatter')
      this.setFormatterState(element, state)
    } else {
      // console.log('component')
      this.setComponentStateByElement(element, state)
    }
  }

  // 更新 Formatter 的状态
  setFormatterState(element: HTMLElement, state: AnimeState) {
    // 目的是不要在设置时强制滚动到光标位置，但此方法切换后无法正常恢复（输入会出现问题）
    // this.input.disabled = true 
    const location = this.renderer.getLocationByNativeNode(element)
    if (location) {
      /** 设置选区锚点位置 */
      this.selection.setAnchor(location.slot, location.startIndex)
      /** 设置选区焦点位置 */
      this.selection.setFocus(location.slot, location.endIndex)
      const dataId = element.dataset.id!
      const dataSerial = element.dataset.serial!
      const dataEffect = element.dataset.effect!
      const dataState = element.dataset.state!
      const dataTitle = element.dataset.title!
      this.commander.applyFormat(animeFormatter, {
        dataId: state.id !== undefined ? state.id : dataId,
        dataSerial: state.serial !== undefined ? state.serial.toString() : dataSerial,
        dataEffect: state.effect !== undefined ? state.effect : dataEffect ,
        dataState: state.state !== undefined ? state.state : dataState,
        dataTitle: state.title !== undefined ? state.title : dataTitle
      })
      /** 设置完成后向后移动光标——>取消选区 */
      this.selection.toNext()
      // this.input.disabled = true 
      // const timer = setTimeout(() => {
      //   this.input.disabled = false
      //   clearTimeout(timer)
      // }, 0)
    }
  }

  // 通过 element 查询 component，通过 compoent 实例直接更新其状态
  setComponentStateByElement(element: HTMLElement, state: AnimeState) {
    const vNode = <VElement>this.renderer.getVNodeByNativeNode(element)
    const location = this.renderer.getLocationByVNode(vNode)!
    const component = location.slot.sliceContent(location.startIndex, location.endIndex)[0]
    if (typeof component !== 'string') {
      if (component.name === ANIME_COMPONENT_NAME) {
        // this.input.disabled = true
        component.updateState((draft) => {
          if (state.id !== undefined) draft.dataId = state.id
          if (state.effect!== undefined) draft.dataEffect = state.effect
          if (state.serial !== undefined) draft.dataSerial = state.serial.toString()
          if (state.state  !== undefined) draft.dataState = state.state
        })
        // const timer = setTimeout(() => {
        //   this.input.disabled = false
        //   clearTimeout(timer)
        // }, 0)
      }
    }
  }


  // 可选，编辑器销毁时调用
  destory() {
    //
  }
}

// this.setComponentState(aniId, state)

// 更新 component 的状态（通过组件内部的事件订阅修改组件状态）（暂时保留）
// setComponentState(aniId: string, state: AnimeState) {
//   this.animeUpdateEvent.next({ 
//     id: aniId,
//     effect: state.effect,
//     serial: state.serial,
//     state: state.state,
//     title: state.title
//   })
// }

/** AnimeStateProvider for State Control and Check  （组件内代码）*/
// const animeStateProvider = useContext(AnimeStateProvider)
// const animeActiveEvent = animeStateProvider.onAnimeUpdate.subscribe((args) => {
//   if (state.dataId === args.id) {
//     animeController.update((draft) => {
//       if(args.effect!== undefined) draft.dataEffect = args.effect
//       if(args.serial!== undefined) draft.dataSerial = args.serial
//       if(args.state!== undefined) draft.dataState = args.state
//       if(args.title!== undefined) draft.dataTitle = args.title
//     })
//   }
// })