import {
  ComponentInitData, ComponentInstance,
  ContentType,
  defineComponent, Injector, onContextMenu,
  onDestroy,
  Slot, useContext,
  useSlots,
  useState,
  VElement
} from '@textbus/core'
import { I18n } from '@textbus/editor'
import { ComponentLoader, SlotParser } from '@textbus/platform-browser'
export interface AlertComponentState {
  type: string
  fill: boolean

  dataAnime: boolean
  dataId: string
  dataEffect: string
  dataSerial: string
  dataActive: boolean
  dataTitle: string
  dataRange: boolean
}

export const alertComponent = defineComponent({
  type: ContentType.BlockComponent,
  name: 'AlertComponent',
  setup(initData?: ComponentInitData<AlertComponentState>) {
    const slots = useSlots(initData?.slots || [])
    let state = initData?.state || {
      type: 'primary',
      fill: false,
      dataAnime: false,
      dataId: '',
      dataEffect: '',
      dataSerial: '',
      dataActive: false,
      dataTitle: '',
      dataRange: false
    }
    const stateController = useState(state)
    const injector = useContext()
    const i18n = injector.get(I18n)

    const sub = stateController.onChange.subscribe(newState => {
      state = newState
    })
    onDestroy(() => {
      sub.unsubscribe()
    })
    if (slots.length === 0) {
      slots.push(new Slot([
        ContentType.InlineComponent,
        ContentType.Text
      ]))
    }

    const childI18n = i18n.getContext('components.alertComponent.contextMenu')

    onContextMenu(ev => {
      ev.useMenus([{
        label: state.fill ? childI18n.get('noFill') : childI18n.get('fill'),
        onClick() {
          stateController.update(draft => {
            draft.fill = !state.fill
          })
        }
      }, {
        label: childI18n.get('type'),
        submenu: 'default,primary,info,success,warning,danger,dark,gray'.split(',').map(i => {
          return {
            label: i,
            onClick() {
              stateController.update(draft => {
                draft.type = i
              })
            }
          }
        })
      }])
    })

    return {
      render(slotRender): VElement {
        const { dataAnime, dataId, dataEffect, dataSerial, dataActive, dataTitle, dataRange } = state
        const classes = ['tb-alert']
        if (state.fill) {
          classes.push('tb-alert-fill')
        }
        if (state.type) {
          classes.push('tb-alert-' + state.type)
        }
        return (
          <tb-alert 
            data-type={state.type} 
            class={classes.join(' ')}
            data-anime={`${dataAnime}` || 'false'}
            data-id={dataId || ''}
            data-effect={dataEffect || ''}
            data-serial={dataSerial || ''}
            data-active={`${dataActive}` || 'false'}
            data-title={dataTitle || ''}
            data-range={`${dataRange}` || 'false'}
          >
            {
              slotRender(slots.get(0)!, children => {
                return <div>{children}</div>
              })
            }
            <span class='anime-component-tab' data-serial={dataSerial} title={dataTitle} />
          </tb-alert>
        )
      }
    }
  }
})

export const alertComponentLoader: ComponentLoader = {
  match(element: HTMLElement): boolean {
    return element.tagName.toLowerCase() === 'tb-alert'
  },
  read(element: HTMLElement, context: Injector, slotParser: SlotParser): ComponentInstance {
    return alertComponent.createInstance(context, {
      state: {
        fill: element.classList.contains('tb-alert-fill'),
        type: element.dataset.type || '',
        dataAnime: element.dataset.anime === 'true',
        dataId: element.dataset.id || '',
        dataEffect: element.dataset.effect || '',
        dataSerial: element.dataset.serial || '',
        dataActive: element.dataset.active === 'true',
        dataTitle: element.dataset.title || '',
        dataRange: element.dataset.range === 'true'
      },
      slots: [
        slotParser(new Slot([
          ContentType.InlineComponent,
          ContentType.Text
        ]), element.children[0] as HTMLElement || document.createElement('div'))
      ]
    })
  }
}
