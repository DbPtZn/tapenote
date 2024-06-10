import { Commander, ComponentInstance, ContentType, Injectable, Injector, Renderer, RootComponentRef, Selection, Slot } from '@textbus/core'
import { AnimeProvider, AnimeUtilsProvider, Structurer } from '.'
import { ANIME_COMPONENT_NAME, AddAnimeService, animeComponent, animeFormatter } from '..'

@Injectable()
export class AnimeAutoProvider {
  private commander!: Commander
  private selection!: Selection
  private renderer!: Renderer
  private rootComponent!: RootComponentRef
  private anime!: AnimeProvider
  private addAnimeService!: AddAnimeService
  private animeUtilsProvider!: AnimeUtilsProvider
  private structurer!: Structurer
  private injector!: Injector

  constructor() {}
  setup(injector: Injector) {
    this.injector = injector
    this.commander = injector.get(Commander)
    this.selection = injector.get(Selection)
    this.renderer = injector.get(Renderer)
    this.rootComponent = injector.get(RootComponentRef)
    this.anime = injector.get(AnimeProvider)
    this.addAnimeService = injector.get(AddAnimeService)
    this.animeUtilsProvider = injector.get(AnimeUtilsProvider)
    this.structurer = injector.get(Structurer)
  }

  autoAdd() {
    // console.log('add anime auto')
    const slots = this.rootComponent.component.slots.toArray()
    const group = slots.map(slot => slot.sliceContent())
    for(let i = 0; i < group.length; i++) {
      const components = group[i]
      outerLoop: for(let k = 0; k < components.length; k++) {
        const component = components[k]
        if (typeof component !== 'string') {
          // 排除列表，不设置动画
          if (['RootComponent', 'AnimeIgnoreComponent', ANIME_COMPONENT_NAME].includes(component.name)) continue
          // console.log('a')

          // 要采用 formatter 设置动画的组件
          if (['ParagraphComponent'].includes(component.name)) {
            console.log('formatter anime')
            component.slots.toArray().forEach(slot => {
              setTimeout(() => {
                this.addFormatterAnime(slot)
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
                this.addFormatterAnime(slot)
              }, 0)
            })
            continue
          }

          // console.log('c')
          // 将函数的执行推迟到当前执行栈清空之后, 确保DOM更新完成 (会先完成循环，在执行内部函数)
          setTimeout(() => {
            this.addComponentAnime(component)
          }, 0)

          // 要同时采用 component 和 formatter 设置动画的组件
          if (['ListComponent'].includes(component.name)) {
            component.slots.toArray().forEach(slot => {
              setTimeout(() => {
                this.addFormatterAnime(slot)
              }, 0)
            })
          }
        }
      }
    }
    // this.rootComponent.component.slots.toArray().forEach(slot => {
    //   slot.sliceContent().forEach(component => {
    //   })
    // })
  }

  /** 添加动画 */
  addComponentAnime(componentInstance: ComponentInstance | null) {
    if (!componentInstance) return
    const id = this.animeUtilsProvider.generateAnimeId()
    // console.log('id:' + id)
    const serial = this.animeUtilsProvider.generateAnimeSerial().toString()
    // console.log('serial' + serial)
    try {
      const animeOption = this.anime.getRandomAnime()
      const slot = new Slot([ContentType.BlockComponent])
      const anime = animeComponent.createInstance(this.injector, {
        slots: [slot],
        state: {
          dataId: id,
          dataEffect: animeOption.key,
          dataSerial: serial.toString(),
          dataState: '',
          dataTitle: animeOption.value.name
        }
      })
      this.commander.replaceComponent(componentInstance, anime)
      // 可以在插入组件后再把内容插入插槽
      slot.insert(componentInstance)
    } catch (error) {
      console.log(error)
    }
  }

  addFormatterAnime(slot: Slot) {
    if(slot.sliceContent()[0] !== '\n') {
      const id = this.animeUtilsProvider.generateAnimeId()
      const serial = this.animeUtilsProvider.generateAnimeSerial().toString()
      const animeOption = this.anime.getRandomAnime()
      slot.applyFormat(animeFormatter, {
        startIndex: 0,
        endIndex: slot.length,
        value: {
          dataId: id,
          dataSerial: serial,
          dataEffect: animeOption.key,
          dataState: '',
          dataTitle: animeOption.value.name
        }
      })
    }
  }

  destory() {}
}
