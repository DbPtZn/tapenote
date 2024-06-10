import { Injector, ClassProvider, Injectable, Selection, Renderer } from '@textbus/core'
import { Layout } from '@textbus/editor'
import { ANIME, ANIME_COMPONENT } from '../anime.constant'
import { VIEW_CONTAINER, VIEW_DOCUMENT } from '@textbus/platform-browser'

@Injectable()
export class AnimeUtilsProvider {
  private containerRef!: HTMLElement
  private renderer!: Renderer
  private selection!: Selection
  private scrollerRef!: HTMLElement
  private injector!: Injector
  // private anime!: AnimeProvider
  constructor() {}
  setup(injector: Injector, scrollerRef: HTMLElement) {
    this.injector = injector
    // const layout = injector.get(Layout)
    this.containerRef = injector.get(VIEW_DOCUMENT)
    this.scrollerRef = scrollerRef
    this.renderer = injector.get(Renderer)
    this.selection = injector.get(Selection)
    // this.anime = injector.get(AnimeProvider)
  }
  /** 通过动画块 id 定位动画块位置 */
  locateAnimeBlock(aniId: string) {
    const element = <HTMLElement | null>this.containerRef.querySelector(`[data-id="${aniId}"]`)
    element && this.applyNativeScroll(element, this.containerRef, this.scrollerRef)
    const location = this.renderer.getLocationByNativeNode(element)
    if (element?.tagName.toLowerCase() !== ANIME_COMPONENT) {
      if (location) {
        // console.log(location)
        // /** 设置选区锚点位置 */
        // this.selection.setAnchor(location.slot, location.startIndex)
        // /** 设置选区焦点位置 */
        // this.selection.setFocus(location.slot, location.endIndex)
        this.selection.setBaseAndExtent(location.slot, location.startIndex, location.slot, location.endIndex)
        this.selection.restore()
      }
    } else {
      // 组件没有选中行为，不需要处理
      // console.log('组件')
    }
  }

  /** 计算并返回新建动画标记的编号 */
  generateAnimeSerial() {
    if (!this.containerRef) return 1
    // console.log('generateAnimeSerial')
    const serialArr: number[] = []
    const animeFormatsArr = this.containerRef.getElementsByTagName(ANIME) as HTMLCollectionOf<HTMLElement>
    const animeComponentsArr = this.containerRef.getElementsByTagName(ANIME_COMPONENT) as HTMLCollectionOf<HTMLElement>
    // console.log('animeFormatsArr:')
    // console.log(animeFormatsArr.length)
    // console.log('animeComponentsArr:')
    // console.log(animeComponentsArr.length)
    const anime_amount = animeFormatsArr.length + animeComponentsArr.length
    // console.log('anime_amount:' + anime_amount)
    if (!anime_amount) {
      return 1
    }
    for (let i = 0; i < animeFormatsArr.length; i++) {
      const serial = animeFormatsArr[i].dataset.serial
      serial && serialArr.push(Number(serial))
    }
    for (let i = 0; i < animeComponentsArr.length; i++) {
      const serial = animeComponentsArr[i].dataset.serial
      serial && serialArr.push(Number(serial))
    }
    let maxSerial = 1
    // console.log('serialArr:' + serialArr)
    if (serialArr.length !== 0) {
      maxSerial = Math.max(...serialArr)
      return maxSerial + 1
    } else {
      return maxSerial
    }
  }
  
  /** 生成动画块 Id */
  generateAnimeId() {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let uuid = ''
    do {
      uuid = ''
      for (let i = 0; i < 8; i++) {
        uuid += chars[Math.floor(Math.random() * 62)]
      }
    } while (this.containerRef.querySelector(`[data-id="${uuid}"]`)) // 检查这个 data-id 是否已经被占用
    return uuid
  }

  /**
   * 获取最外层（祖先）元素到顶部的距离
   * @param el 目标元素
   * @returns 返回距离
   */
  private getTopDistance(el: HTMLElement) {
    let i = el.offsetTop
    while (el.offsetParent) {
      el = el.offsetParent as HTMLElement
      i += el.offsetTop
    }
    return i
  }
  /**
   * 应用原生页面滚动
   * @param el 元素对象
   * @param scrollerRef // 滚动层 
   * @param offset // 偏移值
   */
  private applyNativeScroll(el: HTMLElement, container: HTMLElement, scrollerRef: HTMLElement, offset?: number) {
    if (!container || !scrollerRef) return console.error('无法获取容器层或滚动层，请检查依赖！')
    const offsetVal = offset || scrollerRef.clientHeight / 3
    const top = this.getTopDistance(el) - container.offsetTop
    const timeout = setTimeout(() => {
      scrollerRef.scrollTo({ top: top - offsetVal, behavior: 'smooth' })
      clearTimeout(timeout)
    }, 0)
  }

  // 可选，编辑器销毁时调用
  destory() {
    //
  }
}

export const animeUtilsProvider: ClassProvider = {
  provide: AnimeUtilsProvider,
  useClass: AnimeUtilsProvider
}


  // scrollController(target: HTMLElement) {
  //   if (!this.scrollerRef) return
  //   const top = this.getTopDistance(target) - this.container.offsetTop
  //   const scroller = this.scrollerRef
  //   // 由于在滚动过程中，编辑器中的一些操作会与滚动产生冲突导致滚动停止，所以将滚动事务放到异步队列中进行
  //   const timeout = setTimeout(() => {
  //     scroller.scrollTo({ top, behavior: 'smooth' })
  //     clearTimeout(timeout)
  //   }, 0)
  // }
  // /**
  //  * 动画播放函数
  //  * @param el 元素对象
  //  * @param container 容器层
  //  * @param scroller 滚动层
  //  */
  // applyPlay(el: HTMLElement, container: HTMLElement, scroller: HTMLElement) {
  //   this.applyAnime(el.dataset.effect!, el)
  //   const timer = setTimeout(() => {
  //     this.applyScroll({
  //       el: el,
  //       scroller: scroller,
  //       container: container,
  //       commonRollSpeed: 1,
  //       commonReserved: 300,
  //       overflowTopRollSpeed: 1,
  //       overflowTopReserved: 100,
  //       overflowBottomRollSpeed: 1,
  //       overflowBottomReserved: 100
  //     })
  //     clearTimeout(timer)
  //   }, 0)
  //   // this.applyNativeScroll(el, container, scroller)
  // }

  // /** 应用动画播放控制 */
  // private applyAnime(effectValue: string, el: HTMLElement) {
  //   const display = el.style.display
  //   el.style.display = 'block'
  //   const anime = this.anime.getAnime(effectValue)
  //   if (anime) {
  //     anime.applyEffect(el).finished.then(() => {
  //       el.style.display = display
  //     })
  //   } else {
  //     el.style.display = display
  //   }
  // }

  // /** 应用页面滚动 */
  // private applyScroll(args: {
  //   /** 播放中的动画元素 */
  //   el: HTMLElement
  //   /** 滚动层 */
  //   scroller: HTMLElement
  //   /** 容器层 */
  //   container: HTMLElement
  //   /** 一般滚动速率 默认 1 */
  //   commonRollSpeed: number
  //   /** 一般预留区 默认 300  */
  //   commonReserved: number
  //   /** 溢出滚动速率 默认 1 */
  //   overflowTopRollSpeed: number
  //   /** 溢出预留区 默认 100 */
  //   overflowTopReserved: number
  //   /** 溢出滚动速率 默认 1 */
  //   overflowBottomRollSpeed: number
  //   /** 溢出预留区 默认 100 */
  //   overflowBottomReserved: number
  // }) {
  //   const {
  //     el,
  //     scroller,
  //     container,
  //     commonRollSpeed,
  //     commonReserved,
  //     overflowTopRollSpeed,
  //     overflowTopReserved,
  //     overflowBottomRollSpeed,
  //     overflowBottomReserved
  //   } = args
  //   const Horizon = scroller.clientHeight // 可视窗口的高度
  //   const Scrolled = scroller.scrollTop // 已滚动高度
  //   const Node2Top = this.getTopDistance(el) - container.offsetTop // 节点距离文档顶部（指节点的上边界至文档顶部）
  //   const NodeHeight = el.clientHeight // 元素自身的高度
  //   const Node2HorizonBottom = Horizon + Scrolled - Node2Top - NodeHeight //节点距离可视区间底部
  //   // await new Promise((resolve, reject) => {
  //   if (Node2Top < Scrolled) {
  //     // 节点距离可视区间顶部小于滚动距离（溢出可视区间上边界），执行回滚动作
  //     let Node2HorizonTop = Scrolled - Node2Top // 溢出上边界的高度 = 已滚距离 - 节点至文档顶部距离
  //     const rollSpeed = Math.round(Node2HorizonTop / (30 * overflowTopRollSpeed)) // 基于溢出上边界的高度来计算滚动速率
  //     const scrollTimer = setInterval(() => {
  //       scroller.scrollTop -= rollSpeed
  //       Node2HorizonTop -= rollSpeed
  //       if (Node2HorizonTop <= -overflowTopReserved) {
  //         clearInterval(scrollTimer)
  //         // resolve
  //         return
  //       }
  //     }, 10)
  //   } else if (Node2HorizonBottom < 0) {
  //     // TODO 可能有 bug
  //     //节点距离可视区间底部小于0（溢出可视区间下边界），执行滚动动作
  //     // let Node2HorizonBottomAbs = Math.abs(Node2HorizonBottom) // 计算溢出的距离（取绝对值）
  //     // const rollSpeed = Math.round(Node2HorizonBottomAbs / (30 * overflowBottomRollSpeed)) // 基于溢出的距离计算滚动速率
  //     // const scrollTimer = setInterval(() => {
  //     //   scroller.scrollTop += rollSpeed
  //     //   Node2HorizonBottomAbs -= rollSpeed
  //     //   // 默认滚动后，给底部预留 100 px 的距离
  //     //   if (Node2HorizonBottomAbs < -overflowBottomReserved) {
  //     //     clearInterval(scrollTimer)
  //     //     // resolve
  //     //     return
  //     //   }
  //     // }, 10)
  //     // 保留策略：溢出可以考虑采用原生滚动
  //     this.applyNativeScroll(el, container, scroller)
  //   } else if (Node2HorizonBottom < 200 && Node2HorizonBottom > 0) {
  //     //设置当节点距离可视区间底部小于200时，执行动作
  //     let sum = 0 // 滚动累计量
  //     const scrollTimer = setInterval(() => {
  //       scroller.scrollTop += 10 * commonRollSpeed
  //       sum += 10 * commonRollSpeed
  //       // 默认滚动后，给底部预留 300 px 的空间
  //       if (sum > commonReserved) {
  //         clearInterval(scrollTimer)
  //         // resolve
  //         return
  //       }
  //     }, 20)
  //   } else {
  //     //排除上述三种情况以后，执行动作
  //     // resolve
  //     return
  //   }
  // }