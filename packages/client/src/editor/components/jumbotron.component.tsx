import {
  ComponentInitData,
  ComponentInstance,
  ContentType,
  defineComponent,
  onDestroy,
  Slot, useContext,
  useSlots,
  useState,
  VElement,
  RenderMode,
  Injector
} from '@textbus/core'
import { Dialog, FileUploader, Form, FormTextField, I18n } from '@textbus/editor'
import { ComponentLoader, SlotParser } from '@textbus/platform-browser'
import { headingComponent } from './heading.component'
import { paragraphComponent } from './paragraph.component'

export interface JumbotronComponentState {
  minHeight: string
  backgroundImage: string
  backgroundSize: string
  backgroundPosition: string
  
  dataAnime: boolean
  dataId: string
  dataEffect: string
  dataSerial: string
  dataActive: boolean
  dataTitle: string
  dataRange: boolean
}

export function createJumbotronSlot(injector: Injector) {
  const slot = new Slot([
    ContentType.Text,
    ContentType.InlineComponent,
    ContentType.BlockComponent
  ])
  const h1 = headingComponent.createInstance(injector)
  h1.slots.first!.insert('你好，我的朋友!')
  const p1 = paragraphComponent.createInstance(injector)
  p1.slots.first!.insert('欢迎使用笔记映画。')
  const p2 = paragraphComponent.createInstance(injector)
  p2.slots.first!.insert('祝您生活愉快！')

  slot.insert(h1)
  slot.insert(p1)
  slot.insert(p2)
  return slot
}

export const jumbotronComponent = defineComponent({
  type: ContentType.BlockComponent,
  name: 'JumbotronComponent',
  setup(initData?: ComponentInitData<JumbotronComponentState>) {
    const slots = useSlots(initData?.slots || [])
    const injector = useContext()
    const dialog = injector.get(Dialog)
    const i18n = injector.get(I18n)
    const fileUploader = injector.get(FileUploader)
    if (slots.length === 0) {
      slots.push(createJumbotronSlot(injector))
    }
    let state = initData?.state || {
      minHeight: '200px',
      backgroundImage: '',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      
      dataAnime: false,
      dataId: '',
      dataEffect: '',
      dataSerial: '',
      dataActive: false,
      dataTitle: '',
      dataRange: false
    }
    const stateController = useState(state)
    const sub = stateController.onChange.subscribe(newState => {
      state = newState
    })
    onDestroy(() => {
      sub.unsubscribe()
    })
    const componentI18n = i18n.getContext('components.jumbotronComponent')
    const childI18n = componentI18n.getContext('setting.form')

    function setting() {
      const form = new Form({
        title: childI18n.get('title'),
        confirmBtnText: childI18n.get('confirmBtnText'),
        cancelBtnText: childI18n.get('cancelBtnText'),
        items: [
          new FormTextField({
            name: 'minHeight',
            value: '200px',
            placeholder: childI18n.get('minHeightInputPlaceholder'),
            label: childI18n.get('minHeightLabel')
          }),
          new FormTextField({
            label: childI18n.get('backgroundImageLabel'),
            name: 'backgroundImage',
            value: state.backgroundImage,
            placeholder: childI18n.get('backgroundImageInputPlaceholder'),
            canUpload: true,
            uploadType: 'image',
            fileUploader,
            uploadBtnText: childI18n.get('uploadBtnText'),
            validateFn(value: string): string | false {
              if (!value) {
                return childI18n.get('validateErrorMessage')
              }
              return false
            }
          }),
          
        ]
      })
      dialog.show(form.elementRef)
      const sub1 = form.onComplete.subscribe(data => {
        stateController.update(draft => {
          Object.assign(draft, data)
        })
        dialog.hide()
        sub1.unsubscribe()
        sub2.unsubscribe()
      })
      const sub2 = form.onCancel.subscribe(() => {
        dialog.hide()
        sub1.unsubscribe()
        sub2.unsubscribe()
      })
    }

    return {
      render(slotRender, renderMode): VElement {
        const { dataAnime, dataId, dataEffect, dataSerial, dataActive, dataTitle, dataRange } = state
        return (
          <tb-jumbotron
            style={{
              backgroundImage: state.backgroundImage ? `url("${state.backgroundImage}")` : null,
              backgroundSize: state.backgroundSize || 'cover',
              backgroundPosition: state.backgroundPosition || 'center',
              minHeight: state.minHeight,
            }}
            data-anime={`${dataAnime}` || 'false'}
            data-id={dataId || ''}
            data-effect={dataEffect || ''}
            data-serial={dataSerial || ''}
            data-active={`${dataActive}` || 'false'}
            data-title={dataTitle || ''}
            data-range={`${dataRange}` || 'false'}
          >
            {
              renderMode === RenderMode.Editing &&
              <button type="button" class="tb-jumbotron-setting" onClick={setting}><span
                class="textbus-icon-setting"></span></button>
            }
            {
              slotRender(slots.get(0)!, children => {
                return <div>{children}</div>
              })
            }
            <span class='anime-component-tab' data-serial={state.dataSerial} title={state.dataTitle} />
          </tb-jumbotron>
        )
      }
    }
  }
})

export const jumbotronComponentLoader: ComponentLoader = {
  match(element: HTMLElement): boolean {
    return element.nodeName.toLowerCase() === 'tb-jumbotron'
  },
  read(element: HTMLElement, context: Injector, slotParser: SlotParser): ComponentInstance {
    const style = element.style
    return jumbotronComponent.createInstance(context, {
      state: {
        backgroundImage: (style.backgroundImage || '').replace(/^url\(['"]?|['"]?\)$/g, ''),
        backgroundSize: style.backgroundSize,
        backgroundPosition: style.backgroundPosition,
        minHeight: style.minHeight,
        
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
          ContentType.BlockComponent,
          ContentType.InlineComponent,
          ContentType.Text
        ]), element.children[0] as HTMLElement || document.createElement('div'))
      ]
    })
  }
}
