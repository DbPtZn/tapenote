import { ListComponentExtends, listComponent, listComponentLoader, paragraphComponent } from '../../../../components'
import {
  Commander,
  ComponentInstance,
  ContentType,
  QueryState,
  QueryStateType,
  Selection,
  Slot,
  Injector,
} from '@textbus/core'

export function listToolCreator(injector: Injector, type: 'ul' | 'ol') {
  const selection = injector.get(Selection)
  const commander = injector.get(Commander)
  const instance = {
    queryState(): QueryState<ComponentInstance<ListComponentExtends>> {
      const component = selection.commonAncestorComponent
      if (component?.name === listComponent.name && (component?.extends as ListComponentExtends).type === type) {
        return {
          state: QueryStateType.Enabled,
          value: component as ComponentInstance<ListComponentExtends>
        }
      }

      return {
        state: QueryStateType.Normal,
        value: null
      }
    },
    onClick() {
      const queryState = instance.queryState()
      if (queryState.state === QueryStateType.Normal) {
        instance.toList()
      } else {
        instance.toParagraph()
      }
    },
    toParagraph() {
      commander.transform({
        target: paragraphComponent,
        multipleSlot: false,
        slotFactory(): Slot {
          return new Slot([
            ContentType.Text,
            ContentType.InlineComponent
          ])
        }
      })
    },
    toList() {
      commander.transform({
        target: listComponent,
        multipleSlot: true,
        slotFactory(): Slot {
          return new Slot([
            ContentType.Text,
            ContentType.InlineComponent
          ])
        },
        stateFactory() {
          return {
            type,
            dataAnime: false,
            dataId: '',
            dataEffect: '',
            dataSerial: '',
            dataActive: false,
            dataTitle: '',
            dataRange: false
          }
        }
      })
    }
  }
  return instance
}
