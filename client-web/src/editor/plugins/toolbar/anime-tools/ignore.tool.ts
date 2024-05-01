
import { Commander, FormatValue, Injector, Query, QueryState, QueryStateType, Selection } from '@textbus/core'
import { animeIgnoreComponent } from '../../../'
import { ButtonTool, ButtonToolConfig } from '@/editor'
import { MaterialTypeEnum } from '../toolkit/_utils/MaterialTypeEnum'
export function animeIgnoreToolConfigFactory(injector: Injector): ButtonToolConfig {
  const query = injector.get(Query)
  const commander = injector.get(Commander)
  const selection = injector.get(Selection)
  return {
    tooltip: '动画忽略',
    iconClasses: [`${MaterialTypeEnum.FILLED}select_all`],
    size: 24,
    queryState(): QueryState<FormatValue> {
      // console.log('queryState')
      const animeIgnore = query.queryComponent(animeIgnoreComponent)
      return {
        state: animeIgnore.state,
        value: animeIgnore.state === QueryStateType.Enabled ? 'ignore' : null
      }
    },
    onClick: () => {
      // 检查选中内容所在的组件的祖先节点是否包含动画忽略组件
      const component = selection.commonAncestorComponent
      let parentComponent = component?.parentComponent
      while (parentComponent) {
        if (parentComponent && parentComponent.name === 'RootComponent') break
        if (parentComponent && parentComponent.name === 'AnimeIgnoreComponent') {
          alert('动画忽略组件内部不能再嵌套动画忽略组件')
          return
        }
        parentComponent = parentComponent.parentComponent
      }
      commander.insert(animeIgnoreComponent.createInstance(injector))
    }
  }
}

export function animeIgnoreTool() {
  return new ButtonTool(animeIgnoreToolConfigFactory)
}