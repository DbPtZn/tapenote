import {
  Commander,
  ComponentInitData,
  ComponentInstance,
  ContentType,
  defineComponent,
  onDestroy,
  onBreak,
  Selection,
  Slot,
  useContext,
  useSelf,
  useSlots,
  useState,
  VElement,
  Injector
} from '@textbus/core'
import { ComponentLoader, SlotParser } from '@textbus/platform-browser'
// import { Injector } from '@tanbo/di'
import { Dialog, FileUploader, Form, FormTextField, I18n, paragraphComponent } from '@textbus/editor'

export interface ImageCardComponentState {
  src: string
  height: string

  dataAnime: boolean
  dataId: string
  dataEffect: string
  dataSerial: string
  dataActive: boolean
  dataTitle: string
  dataRange: boolean
}

// eslint-disable-next-line max-len
const svg = '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><g><rect fill="#555" height="100%" width="100%"/></g><g><text font-family="Helvetica, Arial, sans-serif" font-size="24" y="50%" x="50%" text-anchor="middle" dominant-baseline="middle" stroke-width="0" stroke="#000" fill="#000000">Image</text></g></svg>'
const defaultImageSrc = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg)
export const imageCardComponent = defineComponent({
  type: ContentType.BlockComponent,
  separable: false,
  name: 'ImageCardComponent',
  setup(initData?: ComponentInitData<ImageCardComponentState>) {
    let state = initData?.state || {
      src: defaultImageSrc,
      height: '200px',

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
    const dialog = injector.get(Dialog)
    const commander = injector.get(Commander)
    const selection = injector.get(Selection)
    const i18n = injector.get(I18n)
    const fileUploader = injector.get(FileUploader)
    const slots = useSlots(initData?.slots || [])

    if (slots.length === 0) {
      const slot = new Slot([
        ContentType.Text
      ])
      slot.insert('图片名称')
      slots.push(slot)
    }

    stateController.onChange.subscribe(newState => {
      state = newState
    })

    const self = useSelf()
    onBreak(ev => {
      const slot = ev.target.cutTo(new Slot([
        ContentType.InlineComponent,
        ContentType.Text
      ]), ev.data.index)
      const component = paragraphComponent.createInstance(injector, {
        slots: [slot]
      })
      commander.insertAfter(component, self)
      ev.preventDefault()
      selection.selectFirstPosition(component)
    })

    const childI18n = i18n.getContext('components.imageCardComponent.setting')

    function showForm() {
      const form = new Form({
        title: childI18n.get('title'),
        confirmBtnText: childI18n.get('confirmBtnText'),
        cancelBtnText: childI18n.get('cancelBtnText'),
        items: [
          new FormTextField({
            label: childI18n.get('srcLabel'),
            uploadType: 'image',
            canUpload: true,
            value: state.src,
            name: 'src',
            placeholder: childI18n.get('srcPlaceholder'),
            fileUploader
          }),
          new FormTextField({
            label: childI18n.get('heightLabel'),
            name: 'height',
            value: state.height,
            placeholder: childI18n.get('heightPlaceholder')
          })
        ]
      })
      dialog.show(form.elementRef)

      form.onComplete.subscribe((values) => {
        stateController.update(draft => {
          Object.assign(draft, values)
        })
        dialog.hide()
      })
      form.onCancel.subscribe(() => {
        dialog.hide()
      })
    }

    return {
      render(slotRender): VElement {
        const { dataAnime, dataId, dataEffect, dataSerial, dataActive, dataTitle, dataRange } = state
        return (
          <tb-image-card 
            data-src={state.src} 
            data-height={state.height}
            data-anime={`${dataAnime}` || 'false'}
            data-id={dataId || ''}
            data-effect={dataEffect || ''}
            data-serial={dataSerial || ''}
            data-active={`${dataActive}` || 'false'}
            data-title={dataTitle || ''}
            data-range={`${dataRange}` || 'false'}
          >
            <div onClick={showForm}>
              <img src={state.src} style={{
                height: state.height
              }}/>
            </div>
            {
              slotRender(slots.get(0)!, children => {
                return <p>{children}</p>
              })
            }
            <span class='anime-component-tab' data-serial={state.dataSerial} title={state.dataTitle} />
          </tb-image-card>
        )
      }
    }
  }
})

export const imageCardComponentLoader: ComponentLoader = {
  match(element: HTMLElement): boolean {
    return element.nodeName.toLowerCase() === 'tb-image-card'
  },
  read(element: HTMLElement, context: Injector, slotParser: SlotParser): ComponentInstance {
    const p = element.querySelector('p')
    const slot = new Slot([ContentType.Text])
    return imageCardComponent.createInstance(context, {
      state: {
        height: element.dataset.height!,
        src: element.dataset.src!,
        
        dataAnime: element.dataset.anime === 'true',
        dataId: element.dataset.id || '',
        dataEffect: element.dataset.effect || '',
        dataSerial: element.dataset.serial || '',
        dataActive: element.dataset.active === 'true',
        dataTitle: element.dataset.title || '',
        dataRange: element.dataset.range === 'true'
      },
      slots: [
        p ? slotParser(slot, p) : slot
      ]
    })
  }
}
