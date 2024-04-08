
import { Commander, QueryState, FormatValue, Query, QueryStateType, Injector, Registry, Selection, fromEvent, ContentType, take, delay, Slot } from '@textbus/core'
import { ButtonTool, ButtonToolConfig } from '../../toolkit'
import { VIEW_DOCUMENT } from '@textbus/platform-browser'
import { I18n, blockComponent, headingComponent, linkFormatter, listComponent, paragraphComponent, todolistComponent } from '@textbus/editor'

/** 格式刷 */
export function formatPainterToolConfigFactory(injector: Injector): ButtonToolConfig {
  const selection = injector.get(Selection)
  const commander = injector.get(Commander)
  const doc = injector.get(VIEW_DOCUMENT)
  const i18n = injector.get(I18n)
  const registry = injector.get(Registry)
  let isActive = false
  return {
    iconClasses: ['textbus-icon-brush'],
    tooltip: i18n.get('plugins.toolbar.formatPainterTool.tooltip'),
    queryState(): QueryState<FormatValue> {
      if (isActive) {
        return {
          state: QueryStateType.Enabled,
          value: null
        }
      }
      return {
        state: selection.isSelected ? QueryStateType.Normal : QueryStateType.Disabled,
        value: null
      }
    },
    onClick() {
      if (!selection.isSelected) {
        return
      }
      isActive = true
      const startSlot = selection.startSlot!
      const formats = startSlot.extractFormatsByIndex(selection.startOffset!)
      const parentComponent = startSlot.parent!
      const multipleComponent = [
        listComponent,
        todolistComponent
      ]
      const canTransformComponentNames = [
        paragraphComponent,
        blockComponent,
        listComponent,
        todolistComponent,
        headingComponent
      ].map(i => i.name)
      let componentName = paragraphComponent.name
      let state: any = null
      if (canTransformComponentNames.includes(parentComponent.name)) {
        componentName = parentComponent.name
        state = typeof parentComponent.state === 'object' && parentComponent.state !== null ?
          JSON.parse(JSON.stringify(parentComponent.state)) :
          parentComponent.state
      }

      // startSlot.changeMarker.forceMarkChanged()
      const { Text, InlineComponent, BlockComponent } = ContentType
      fromEvent(doc, 'mouseup').pipe(take(1), delay(10)).subscribe(() => {
        isActive = false
        commander.cleanFormats([linkFormatter])
        formats.forEach(i => {
          commander.applyFormat(i[0], i[1])
        })
        commander.transform({
          multipleSlot: multipleComponent.map(i => i.name).includes(componentName),
          target: registry.getComponent(componentName)!,
          slotFactory() {
            return new Slot(componentName === blockComponent.name ? [
              Text,
              InlineComponent,
              BlockComponent
            ] : [
              Text,
              InlineComponent
            ], startSlot.state)
          },
          stateFactory() {
            return state
          }
        })
      })
    }
  }
}

export function formatPainterTool() {
  return new ButtonTool(formatPainterToolConfigFactory)
}
