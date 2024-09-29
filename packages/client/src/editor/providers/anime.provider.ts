import { VIEW_CONTAINER } from '@textbus/platform-browser'
import { Commander, ComponentInstance, ContentType, Injectable, Injector, Renderer, RootComponentRef, Selection, Slot } from '@textbus/core'
import anime from 'animejs'
import { animeFormatter } from '../formatters'
import { animeComponent } from '../components/anime/_api'

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
    if(!element || !this.viewContainer || !this.scroller) return
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
    if(elements) {
      elements.forEach(element => {
        if (element.tagName.toLowerCase() === 'anime') {
          this.updateFormatterState(element, state)
        }
        if (element.dataset.anime === 'true' || element.tagName.toLocaleLowerCase() === 'anime-component') {
          // console.log(element)
          this.updateComponentState(element, state)
        }
      })
    }
  }

  // 更新 Formatter 的状态
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
    const component = this.renderer.getComponentByNativeNode(element)
    // console.log(component)
    if (!component) return
    if (component.state.dataAnime || component.name === 'AnimeComponent') {
      component.updateState(draft => {
        if (state.id !== undefined) draft.dataId = state.id
        if (state.effect!== undefined) draft.dataEffect = state.effect
        if (state.serial !== undefined) draft.dataSerial = state.serial?.toString()
        if (state.title !== undefined) draft.dataTitle = state.title
        if (state.active !== undefined) draft.dataActive = state.active
        if (state.range  !== undefined) draft.dataRange = state.range
      })
      return
    }
  }

  addAnime(componentInstance: ComponentInstance | null, effect: string, title: string) {
    if (!componentInstance) return
    const id = this.generateAnimeId()
    const serial = this.generateAnimeSerial().toString()
    if(componentInstance.state.dataAnime === false) {
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
    componentInstance.slots.toArray().forEach((slot) => {
      slot.sliceContent().forEach((content) => {
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
    // 获取根节点插槽
    const content = this.rootComponentRef.component.state.content.sliceContent()
    for(let i = 0; i < content.length; i++) {
      const components = content[i]
      outerLoop: for(let k = 0; k < components.length; k++) {
        const component = components[k]
        if (typeof component !== 'string') {
          // 排除列表，不设置动画
          if (['RootComponent', 'AnimeIgnoreComponent', 'AnimeComponent'].includes(component.name)) continue
          // console.log('a')

          // 要采用 formatter 设置动画的组件
          if (['ParagraphComponent'].includes(component.name)) {
            console.log('formatter anime')
            component.slots.toArray().forEach(slot => {
              setTimeout(() => {
                this.addFormatterAnime(slot, selectAnimeOption)
              }, 0)
            })
            continue
          }

          // 父组件包含在 AnimeIgnoreComponent 中，不设置动画
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
            console.log('行内组件或文本组件')
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
      }
    }
  }

  /**
   * 添加组件动画
   * @param componentInstance 组件
   * @param selectAnimeOption 指定一种动画，不传的时候会在动画列表中随机选择
   */
  addComponentAnime(componentInstance: ComponentInstance | null, selectAnimeOption?: { key: string; value: { name: string } }) {
    if (!componentInstance) return
    const animeOption = selectAnimeOption || this.getRandomAnime()
    this.addAnime(componentInstance, animeOption.key, animeOption.value?.name || '')
  }

  /**
   * 添加格式动画
   * @param slot 插槽
   * @param selectAnimeOption 指定一种动画，不传的时候会在动画列表中随机选择
   */
  addFormatterAnime(slot: Slot, selectAnimeOption?: { key: string; value: { name: string } }) {
    try {
      if(slot.sliceContent()[0] !== '\n') {
        const id = this.generateAnimeId()
        const serial = this.generateAnimeSerial().toString()
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
  applyFormat(effect: string, title: string ) {
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

  /** 如果是动画元素则返回改元素，如果是动画标签元素则返回其父元素  ， */
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