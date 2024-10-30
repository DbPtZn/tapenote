import { VIEW_CONTAINER } from '@textbus/platform-browser'
import { Commander, ComponentInstance, ContentType, Injectable, Injector, Renderer, RootComponentRef, Selection, Slot } from '@textbus/core'
import anime from 'animejs'
import { animeFormatter } from '../formatters'
import { animeComponent } from '../components'

type AnimeMap = Map<string, { name: string; play: (target: Element) => anime.AnimeInstance }>

interface AnimeOption {
  label: string
  value: string
  disabled: boolean
  default?: boolean
  play: (target: HTMLElement) => void
}

interface AnimeState {
  id?: string
  effect?: string
  serial?: number
  active?: boolean
  title?: string
  range?: boolean
}

@Injectable()
export class AnimeProvider {
  animesMap: AnimeMap
  private viewContainer: HTMLElement | null = null
  private scroller?: HTMLElement | null = null
  private selection!: Selection
  private renderer!: Renderer
  private commander!: Commander
  private rootComponentRef!: RootComponentRef
  private injector!: Injector

  constructor() {
    this.animesMap = new Map([
      ['bounceIn', { name: '弹入', play: bounce.bounceIn }],
      ['bounceInDown', { name: '向下弹入', play: bounce.bounceInDown }],
      ['bounceInLeft', { name: '自左弹入', play: bounce.bounceInLeft }],
      ['bounceInRight', { name: '自右弹入', play: bounce.bounceInRight }],
      ['bounceInUp', { name: '向上弹入', play: bounce.bounceInUp }],
      ['fideIn', { name: '渐入', play: fide.fideIn }],
      ['fideInDown', { name: '向下渐入', play: fide.fideInDown }],
      ['fideInUp', { name: '向上渐入', play: fide.fideInUp }],
      ['fideInLeft', { name: '自左渐入', play: fide.fideInLeft }],
      ['fideInRight', { name: '自右渐入', play: fide.fideInRight }],
      ['filpInX', { name: '沿X轴翻转进入', play: filp.filpInX }],
      ['filpInY', { name: '沿Y轴翻转进入', play: filp.filpInY }]
    ])
  }

  setup(injector: Injector, scroller?: HTMLElement, customMap?: AnimeMap) {
    this.injector = injector
    this.viewContainer = injector.get(VIEW_CONTAINER)
    this.renderer = injector.get(Renderer)
    this.commander = injector.get(Commander)
    this.selection = injector.get(Selection)
    this.rootComponentRef = injector.get(RootComponentRef)
    this.scroller = scroller
    this.animesMap = customMap || this.animesMap
  }

  getAnime(key: string) {
    return this.animesMap.get(key)
  }

  getRandomAnime() {
    // 获取所有键的数组
    const map = this.animesMap
    const keys = Array.from(map.keys())
    // 随机选择一个键
    const randomKey = keys[Math.floor(Math.random() * keys.length)]
    // 获取对应的值
    const value = map.get(randomKey)

    return { key: randomKey, value }
  }

  getOptions() {
    const animeOptions: AnimeOption[] = []
    this.animesMap.forEach((value, key) => {
      animeOptions.push({
        label: value.name,
        value: key,
        disabled: false,
        default: false,
        play: value.play
      })
    })
    return animeOptions
  }

  /** 计算并返回新建动画标记的编号 */
  generateAnimeSerial() {
    if (!this.viewContainer) return 1
    const serialArr: number[] = []

    const animeFormatsArr = this.viewContainer.getElementsByTagName('anime') as HTMLCollectionOf<HTMLElement>
    const animeComponentsArr = this.viewContainer.getElementsByTagName('anime-component') as HTMLCollectionOf<HTMLElement>
    const animeAttributesArr = this.viewContainer.querySelectorAll<HTMLElement>('[data-anime="true"]')

    const animeFormatElements = Array.from(animeFormatsArr)
    const animeComponentElements = Array.from(animeComponentsArr)
    const animeAttributeElements = Array.from(animeAttributesArr)

    const animeElements = [...animeFormatElements, ...animeComponentElements, ...animeAttributeElements]

    const anime_amount = animeElements.length
    if (!anime_amount) {
      return 1
    }
    for (let i = 0; i < animeElements.length; i++) {
      const serial = animeElements[i].dataset.serial
      serial && serialArr.push(Number(serial))
    }
    let maxSerial = 1
    if (serialArr.length !== 0) {
      maxSerial = Math.max(...serialArr)
      return maxSerial + 1
    }
    return maxSerial
  }

  /** 生成动画块 id */
  generateAnimeId() {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let id = ''
    do {
      id = ''
      for (let i = 0; i < 8; i++) {
        id += chars[Math.floor(Math.random() * 62)]
      }
    } while (this.viewContainer?.querySelector(`[data-id="${id}"]`)) // 检查这个 data-id 是否已经被占用
    return id
  }

  /** 通过动画块 id 定位动画块位置 */
  locateAnimeBlock(aniId: string) {
    const element = <HTMLElement | null>this.viewContainer?.querySelector(`[data-id="${aniId}"]`)
    if (!element || !this.viewContainer || !this.scroller) return
    applyNativeScroll(element, this.viewContainer, this.scroller)
    // 滚动到目标元素位置
    const location = this.renderer.getLocationByNativeNode(element)
    // 选中目标元素
    if (element?.tagName.toLowerCase() === 'anime-component' || !location) return
    this.selection.setBaseAndExtent(location.slot, location.startIndex, location.slot, location.endIndex)
    this.selection.restore()
    // 组件无选中行为，不处理
  }

  /** 更新动画的状态 */
  updateAnimeState(aniId: string, state: AnimeState) {
    const elements = this.viewContainer?.querySelectorAll<HTMLElement>(`[data-id="${aniId}"]`)
    // console.log(elements)
    if (elements) {
      elements.forEach(element => {
        if (element.tagName.toLowerCase() === 'anime') {
          this.updateFormatterState(element, state)
        }
        if (element.dataset.anime === 'true' || element.tagName.toLocaleLowerCase() === 'anime-component') {
          this.updateComponentState(element, state)
        }
      })
    }
  }

  // 更新 Formatter 的状态 （设置成私有是因为存在动画块被分割的情况，所以不应该直接通过 element 去修改动画属性 ）
  private updateFormatterState(element: HTMLElement, state: AnimeState) {
    const location = this.renderer.getLocationByNativeNode(element)
    if (location) {
      /** 设置选区锚点位置 */
      this.selection.setAnchor(location.slot, location.startIndex)
      /** 设置选区焦点位置 */
      this.selection.setFocus(location.slot, location.endIndex)
      const dataId = element.dataset.id || ''
      const dataSerial = element.dataset.serial || ''
      const dataEffect = element.dataset.effect || ''
      const dataActive = element.dataset.active === 'true' || false
      const dataTitle = element.dataset.title || ''
      const dataRange = element.dataset.range === 'true' || false
      this.commander.applyFormat(animeFormatter, {
        dataId: state.id !== undefined ? state.id : dataId,
        dataSerial: state.serial !== undefined ? state.serial.toString() : dataSerial,
        dataEffect: state.effect !== undefined ? state.effect : dataEffect,
        dataActive: state.active !== undefined ? state.active : dataActive,
        dataTitle: state.title !== undefined ? state.title : dataTitle,
        dataRange: state.range !== undefined ? state.range : dataRange
      })
      /** 设置完成后向后移动光标——>取消选区 */
      this.selection.toNext()
    }
  }

  // 通过 element 查询 component，通过 compoent 实例直接更新其状态
  private updateComponentState(element: HTMLElement, state: AnimeState) {
    let component = this.renderer.getComponentByNativeNode(element)
    if (!component) {
      // 表格组件需要特别处理
      if(['table'].includes(element.tagName.toLocaleLowerCase())) {
        component = this.renderer.getComponentByNativeNode(element.parentElement)
      }
    }
    // console.log(component)
    if (!component) return
    if (component.state.dataAnime || component.name === 'AnimeComponent') {
      // console.log(component)
      // console.log(state)
      // console.log(component.state)
      component.updateState(draft => {
        if (state.id !== undefined) draft.dataId = state.id
        if (state.effect !== undefined) draft.dataEffect = state.effect
        if (state.serial !== undefined) draft.dataSerial = state.serial?.toString()
        if (state.title !== undefined) draft.dataTitle = state.title
        if (state.active !== undefined) draft.dataActive = state.active
        if (state.range !== undefined) draft.dataRange = state.range
      })
      return
    }
  }

  addAnime(componentInstance: ComponentInstance | null, effect: string, title: string, customSerial?: number) {
    if (!componentInstance) return
    const id = this.generateAnimeId()
    const serial = customSerial || this.generateAnimeSerial().toString()
    console.log(componentInstance.state)
    if (componentInstance.state.dataAnime === false) {
      // 将光标聚焦到目标组件内（当组件状态更新的时候会将页面滚动到光标所在的位置）
      this.selection.selectFirstPosition(componentInstance)
      componentInstance.updateState(draft => {
        draft.dataAnime = true
        draft.dataId = id
        draft.dataSerial = serial
        draft.dataActive = false
        draft.dataEffect = effect
        draft.dataTitle = title
        draft.range = false
      })
      return
    }
    if (componentInstance.state.dataAnime === true) return // 如果为 true, 直接跳出，自动添加动画的时候会遇到这个情况
    const slot = new Slot([ContentType.BlockComponent])
    const anime = animeComponent.createInstance(this.injector, {
      slots: [slot],
      state: {
        dataId: id,
        dataEffect: effect,
        dataSerial: serial.toString(),
        dataState: '',
        dataTitle: title
      }
    })
    this.commander.replaceComponent(componentInstance, anime)
    // 可以在插入组件后再把内容插入插槽
    slot.insert(componentInstance)
  }

  removeAnime(componentInstance: ComponentInstance | null) {
    if (!componentInstance) return
    if (componentInstance.state.dataAnime) {
      componentInstance.updateState(draft => {
        draft.dataAnime = false
        draft.dataId = ''
        draft.dataSerial = ''
        draft.dataActive = false
        draft.dataEffect = ''
        draft.dataTitle = ''
        draft.range = false
      })
      return
    }
    componentInstance.slots.toArray().forEach(slot => {
      slot.sliceContent().forEach(content => {
        if (typeof content !== 'string') {
          this.commander.replaceComponent(componentInstance, content)
        }
      })
    })
  }

  /**
   * 自动添加动画预设
   * @param selectAnimeOption 指定一种动画，如果提供该选项，则所有自动添加的预设都会采用该动画
   */
  autoAdd(selectAnimeOption?: { key: string; value: { name: string } }) {
    // console.log('add anime auto')
    const slots = this.rootComponentRef.component.slots.toArray()
    const group = slots.map(slot => slot.sliceContent())
    for (let i = 0; i < group.length; i++) {
      const components = group[i]
      outerLoop: for (let k = 0; k < components.length; k++) {
        const component = components[k] // 组件内的情况
        if (typeof component !== 'string') {
          // 排除列表，不设置动画
          if (['RootComponent', 'AnimeIgnoreComponent', 'AnimeComponent'].includes(component.name)) continue
          if (component.state && component.state.dataAnime) continue
          // console.log('a')

          // 要采用 formatter 设置动画的组件
          if (['ParagraphComponent'].includes(component.name)) {
            // console.log('formatter anime')
            component.slots.toArray().forEach(slot => {
              if (slot.sliceContent()[0] !== '\n') {
                setTimeout(() => {
                  this.addFormatterAnime(slot, selectAnimeOption)
                }, 0)
              }
            })
            continue
          }

          // 不需要设置动画的情况
          let parentComponent = component.parentComponent
          while (parentComponent) {
            if (parentComponent && parentComponent.name === 'RootComponent') break
            // 父组件包含 AnimeIgnoreComponent ，不设置动画
            if (parentComponent && parentComponent.name === 'AnimeIgnoreComponent') continue outerLoop
            // 父组件是动画组件，不设置动画
            if (parentComponent && parentComponent.name === 'AnimeComponent') continue outerLoop
            parentComponent = parentComponent.parentComponent
          }

          // console.log('b')

          // 如果是行内组件或文本组件, 也采用 formatter 设置动画
          if ([ContentType.InlineComponent, ContentType.Text].includes(component.type)) {
            // console.log('行内组件或文本组件')
            component.slots.toArray().forEach(slot => {
              setTimeout(() => {
                this.addFormatterAnime(slot, selectAnimeOption)
              }, 0)
            })
            continue
          }

          // console.log('c')
          // 将函数的执行推迟到当前执行栈清空之后, 确保DOM更新完成 (会先完成循环，在执行内部函数)
          setTimeout(() => {
            this.addComponentAnime(component, selectAnimeOption)
          }, 0)

          // 要同时采用 component 和 formatter 设置动画的组件
          if (['ListComponent'].includes(component.name)) {
            component.slots.toArray().forEach(slot => {
              setTimeout(() => {
                this.addFormatterAnime(slot, selectAnimeOption)
              }, 0)
            })
          }
        }
        // 暂时无法对 string 进行预设，因为不知道怎么选中它
      }
    }
  }

  /**
   * 添加组件动画
   * @param componentInstance 组件
   * @param selectAnimeOption 指定一种动画，不传的时候会在动画列表中随机选择
   */
  addComponentAnime(componentInstance: ComponentInstance | null, selectAnimeOption?: { key: string; value: { name: string } }, customSerial?: number) {
    if (!componentInstance) return
    const animeOption = selectAnimeOption || this.getRandomAnime()
    this.addAnime(componentInstance, animeOption.key, animeOption.value?.name || '', customSerial)
  }

  /**
   * 添加格式动画
   * @param slot 插槽
   * @param selectAnimeOption 指定一种动画，不传的时候会在动画列表中随机选择
   */
  addFormatterAnime(slot: Slot, selectAnimeOption?: { key: string; value: { name: string } }, customSerial?: number) {
    try {
      if (slot.sliceContent()[0] !== '\n') {
        const id = this.generateAnimeId()
        const serial = customSerial || this.generateAnimeSerial().toString()
        const animeOption = selectAnimeOption || this.getRandomAnime()
        slot.applyFormat(animeFormatter, {
          startIndex: 0,
          endIndex: slot.length,
          value: {
            dataId: id,
            dataSerial: serial,
            dataEffect: animeOption.key,
            dataActive: false,
            dataTitle: animeOption.value?.name || '',
            dataRange: false
          }
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  /** 应用动画样式 */
  applyFormat(effect: string, title: string) {
    const dataSerial = this.generateAnimeSerial().toString()
    const dataId = this.generateAnimeId()
    this.commander.applyFormat(animeFormatter, {
      dataId,
      dataSerial,
      dataEffect: effect,
      dataActive: false,
      dataTitle: title,
      dataRange: false
    })
  }

  /**
   * 动画元素迭代器：会找到所有动画元素并遍历循环
   * @param handler 执行的任务
   * @param isPerformChunk 是否使用分时任务进行处理
  */
  animeElementIterator(handler: (element: HTMLElement, index: number) => void, isPerformChunk: boolean = false) {
    const container = this.viewContainer
    if (!container) return
    const elements = AnimeProvider.queryAllAnimeElements(container)
    isPerformChunk
      ? browserPerformChunk(elements, (element, index) => handler(element, index))
      : elements.forEach((element, index) => {
          handler(element, index)
        })
  }
  
  hideAnimeBadge() {
    const container = this.viewContainer!
    container.classList.contains('anime-badge-hidden')
    ? container.classList.remove('anime-badge-hidden')
    : container.classList.add('anime-badge-hidden')
    return container.classList.contains('anime-badge-hidden')
  }
  hideAnimeElement() {
    const container = this.viewContainer!
    container.classList.contains('anime-element-hidden')
    ? container.classList.remove('anime-element-hidden')
    : container.classList.add('anime-element-hidden')
    return container.classList.contains('anime-element-hidden')
  }

  /** 如果是动画元素则返回改元素，如果是动画标签元素则返回其父元素 */
  static toAnimeElement(target: HTMLElement) {
    if (['anime-component', 'anime'].includes(target.tagName.toLocaleLowerCase())) return target
    if (target.classList.contains('anime-component-tab') && target.parentElement?.dataset.anime === 'true') return target.parentElement
  }

  static queryAllAnimeElements(container: HTMLElement) {
    const elements = container.querySelectorAll('anime' + ',' + 'anime-component' + ',' + '[data-anime="true"]') as NodeListOf<HTMLElement>
    return Array.from(elements)
  }

  destory() {
    //
  }
}

/**
 * 应用原生页面滚动
 * @param el 元素对象
 * @param container // 容器层
 * @param scroller // 滚动层
 * @param offset // 偏移值
 */
function applyNativeScroll(el: HTMLElement, container: HTMLElement, scroller: HTMLElement, offset?: number) {
  if (!container || !scroller) return console.error('无法获取容器层或滚动层，请检查依赖！')
  const offsetVal = offset || scroller.clientHeight / 3
  const top = getTopDistance(el) - container.offsetTop
  const timeout = setTimeout(() => {
    scroller.scrollTo({ top: top - offsetVal, behavior: 'smooth' })
    clearTimeout(timeout)
  }, 0)
}

/**
 * 获取最外层（祖先）元素到顶部的距离
 * @param el 目标元素
 * @returns 返回距离
 */
function getTopDistance(el: HTMLElement) {
  let i = el.offsetTop
  while (el.offsetParent) {
    el = el.offsetParent as HTMLElement
    i += el.offsetTop
  }
  return i
}

const DURATION = 1000 // 动画持续时间基本量 / 1秒
/** 弹入 */
const bounce = {
  bounceIn(target: Element) {
    return anime({
      targets: target,
      scale: [0, 1],
      opacity: [0, 1],
      duration: DURATION
    })
  },
  bounceInDown(target: Element) {
    return anime({
      targets: target,
      translateY: [-100, 0],
      scale: [0, 1],
      opacity: [0, 1],
      duration: DURATION
    })
  },
  bounceInLeft(target: Element) {
    return anime({
      targets: target,
      translateX: [-100, 0],
      scale: [0, 1],
      opacity: [0, 1],
      duration: DURATION
    })
  },
  bounceInRight(target: Element) {
    return anime({
      targets: target,
      translateX: [100, 0],
      scale: [0, 1],
      opacity: [0, 1],
      duration: DURATION
    })
  },
  bounceInUp(target: Element) {
    return anime({
      targets: target,
      translateY: [100, 0],
      scale: [0, 1],
      opacity: [0, 1],
      duration: DURATION
    })
  }
}

/** 渐入 */
const fide = {
  fideIn(target: Element) {
    return anime({
      targets: target,
      opacity: [0, 1],
      easing: 'easeOutQuad',
      duration: DURATION
    })
  },
  fideInDown(target: Element) {
    return anime({
      targets: target,
      translateY: [-100, 0],
      opacity: [0, 1],
      easing: 'easeOutQuad',
      duration: DURATION
    })
  },
  fideInLeft(target: Element) {
    return anime({
      targets: target,
      translateX: [-100, 0],
      opacity: [0, 1],
      easing: 'easeOutQuad',
      duration: DURATION
    })
  },
  fideInRight(target: Element) {
    return anime({
      targets: target,
      translateX: [100, 0],
      opacity: [0, 1],
      easing: 'easeOutQuad',
      duration: DURATION
    })
  },
  fideInUp(target: Element) {
    return anime({
      targets: target,
      translateY: [100, 0],
      opacity: [0, 1],
      easing: 'easeOutQuad',
      duration: DURATION
    })
  }
}

/** 翻入 */
const filp = {
  filpInX(target: Element) {
    return anime({
      targets: target,
      rotateX: [-180, 0],
      opacity: [0, 1],
      duration: DURATION * 2
    })
  },
  filpInY(target: Element) {
    return anime({
      targets: target,
      rotateY: [-180, 0],
      opacity: [0, 1],
      duration: DURATION * 2
    })
  }
}

/** 闪入 */
const zoom = {
  zoomIn(target: Element) {
    return anime({
      targets: target,
      rotateX: [-180, 0],
      opacity: [0, 1],
      duration: DURATION
    })
  }
}

/**
 * 分时函数，用于按分片执行任务数组中的任务
 * @param datas 任务数组，如果传入的是一个数字，则会创建一个从0到该数字的数组
 * @param taskHandler 任务处理器，一个接受单个任务并执行相应操作的函数
 * @param scheduler 分片调度器，一个接受一个回调函数作为参数的函数，用于控制下一分片的执行
 * @returns 无返回值
 */
export function performChunk<T>(datas: T[], taskHandler: (data: T, index: number) => void, scheduler: (task: (goOn: () => boolean) => void) => void) {
  // 如果datas是一个数字，则生成一个从0到该数字的数组
  if (typeof datas === 'number') {
    datas = Array.from({ length: datas }, (_, i) => i) as T[]
  }
  // 如果任务数组为空，则直接返回
  if (datas.length === 0) {
    return
  }

  let i = 0

  // 开启下一个分片的执行
  function _run() {
    // 如果已经处理完所有任务，则直接返回
    if (i >= datas.length) {
      return
    }

    // 调度器函数，根据分片调度器的控制来执行任务
    scheduler((goOn: () => any) => {
      // 在 goOn() 返回 true 且还有任务未处理的情况下，持续执行任务处理器
      while (goOn() && i < datas.length) {
        taskHandler(datas[i], i)
        i++
      }
      // 所有任务处理完毕后，再次调用_run函数，开始下一分片的执行
      _run()
    })
  }
  // 开始执行第一个分片
  _run()
}

/**
 * 在浏览器环境中处理数据块
 * 该函数使用requestIdleCallback来安排任务，在浏览器空闲时执行任务处理
 *
 * @param datas - 待处理的数据数组
 * @param taskHandler - 用于处理每个数据的函数
 */
export function browserPerformChunk<T>(datas: T[], taskHandler: (data: T, index: number) => void) {
  // 定义一个调度器函数，用于将任务安排在浏览器空闲时执行
  const scheduler = task => {
    requestIdleCallback(idle => {
      // 执行任务，并允许其在浏览器空闲时运行
      task(() => idle.timeRemaining())
    })
  }
  // 调用performChunk函数，传入数据数组、任务处理器和调度器
  performChunk(datas, taskHandler, scheduler)
}

/**
 * 模拟环境中使用 setTimeout 来分时处理数据块（非浏览器环境）
 * @param datas - 待处理的数据数组
 * @param taskHandler - 用于处理每个数据的函数
 */
export function timeoutPerformChunk<T>(datas: T[], taskHandler: (data: T) => void, delay = 100) {
  const scheduler = task => {
    setTimeout(() => {
      task(() => true)
    }, delay)
  }

  performChunk(datas, taskHandler, scheduler)
}
