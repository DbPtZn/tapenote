import { Injectable, Injector } from '@viewfly/core'
import { VIEW_CONTAINER, DomAdapter } from '@textbus/platform-browser'
import { Selection } from '@textbus/core'
import anime from 'animejs'

type AnimeMap = Map<string, { name: string; play: (target: Element) => anime.AnimeInstance }>
interface AnimeOption {
  label: string
  value: string
  disabled: boolean
  default?: boolean
  play: (target: HTMLElement) => void
}

@Injectable()
export class AnimeProvider {
  animesMap: AnimeMap
  private viewContainer: HTMLElement | null = null
  private scroller?: HTMLElement | null = null
  private selection!: Selection
  private adapter!: DomAdapter
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
    this.viewContainer = injector.get(VIEW_CONTAINER)
    this.adapter = injector.get(DomAdapter)
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

  /** 生成动画块 Id */
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
    const location = this.adapter.getLocationByNativeNode(element)
    // 选中目标元素
    if (element?.tagName.toLowerCase() === 'anime-component' || !location) return
    this.selection.setBaseAndExtent(location.slot, location.startIndex, location.slot, location.endIndex)
    this.selection.restore()
    // 组件无选中行为，不处理
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