import { Commander, FormatValue, Injector, Query, QueryState, Selection } from '@textbus/core'
import { Layout } from '@textbus/editor'
import { AnimeProvider, animeFormatter } from '../../../'
// import { AnimeUtilsProvider } from '../../../providers/anime-utils.provider'
import { AnimeSegmentPopoverTool, AnimeSegmentPopoverToolConfig } from './toolkit/segment-popover'
export function animeToolConfigFactory(injector: Injector): AnimeSegmentPopoverToolConfig {
  const query = injector.get(Query)
  // const commander = injector.get(Commander)
  // const layout = injector.get(Layout)
  const selection = injector.get(Selection)
  const animeProvider = injector.get(AnimeProvider)

  return {
    // options: [],
    keymap: {
      ctrlKey: true,
      key: '`'
    },
    queryState(): QueryState<FormatValue> {
      return query.queryFormat(animeFormatter)
    },

    useValue(state: { value: string, label: string }) {

      // 检查选中内容所在的组件的祖先节点是否包含动画忽略组件
      const component = selection.commonAncestorComponent
      let parentComponent = component?.parentComponent
      while (parentComponent) {
        if (parentComponent && parentComponent.name === 'RootComponent') break
        if (parentComponent && parentComponent.name === 'AnimeIgnoreComponent') {
          alert('无法在该组件内设置动画元素')
          return
        }
        parentComponent = parentComponent.parentComponent
      }

      // 检查选中内容所囊括的组件是否包含动画忽略组件
      const blocks = selection.getGreedyRanges()
      const isIgnore = blocks.some(block => {
        return block.slot.parent?.name === 'AnimeIgnoreComponent'
      })
      if (isIgnore) {
        alert('无法在该组件内设置动画元素')
        return
      }
      animeProvider.applyFormat(state.value, state.label)
      // const dataSerial = animeProvider.generateAnimeSerial().toString()
      // const dataId = animeProvider.generateAnimeId()
      // commander.applyFormat(animeFormatter, {
      //   dataId,
      //   dataSerial,
      //   dataEffect: state.value,
      //   dataActive: false,
      //   dataTitle: state.label,
      //   dataRange: false
      // })
    }
  }
}

export function animeTool() {
  return new AnimeSegmentPopoverTool(animeToolConfigFactory)
}