import {
  ComponentInitData,
  ComponentInstance,
  ContentType,
  defineComponent,
  VElement,
  useRef,
  useState, onContextMenu, useContext, Injector, Subscription, onSelected, useSelf,
} from '@textbus/core'
import { ComponentLoader, createElement, createTextNode } from '@textbus/platform-browser'
import { AttrState, Dialog, FileUploader, Form, FormItem, FormSelect, FormRadio, FormTextField, I18n} from '@textbus/editor'
import { ImgService, ImgToUrlService } from '..'
import { useDragResize } from './hooks/drag-resize'
// import { Form, FormTextField, FormRadio, AttrState, FormItem } from '../uikit/_api'
// import { FileUploader } from '../file-uploader'
// import { I18n } from '../i18n'
// import { Dialog } from '../dialog'

export interface ImageComponentLiteral {
  src: string
  maxWidth?: string;
  maxHeight?: string;
  width?: string
  height?: string
  margin?: string
  float?: string
  border?: string | 'none' | 'dashed' | 'dotted' | 'solid' | 'double' | 'groove' | 'inset' | 'outset' | 'ridge'
}

class MarginSetter implements FormItem<string> {
  name = 'margin'
  elementRef: HTMLElement

  private inputs: HTMLInputElement[] = []

  constructor(label: string) {
    this.elementRef = createElement('div', {
      classes: ['textbus-form-group'],
      children: [
        createElement('label', {
          classes: ['textbus-control-label'],
          children: [
            createTextNode(label)
          ]
        }),
        createElement('div', {
          classes: ['textbus-control-static'],
          children: [
            createElement('div', {
              classes: ['textbus-toolbar-image-margin-setter'],
              children: Array.from({ length: 4 }).fill(null).map(() => createElement('input', {
                attrs: {
                  type: 'text',
                  value: '0'
                },
                classes: ['textbus-form-control']
              }))
            })
          ]
        })
      ]
    })
    this.inputs = Array.from(this.elementRef.querySelectorAll('input'))
  }

  reset() {
    this.inputs.forEach(input => input.value = '')
  }

  update(value?: any): void {
    this.reset()
    if (value) {
      const vars = (value + '').split(/\s+/g)
      vars.forEach((v, index) => {
        this.inputs[index].value = v
      })
    }
  }

  getAttr(): AttrState<string> {
    return {
      name: this.name,
      value: this.inputs.map(input => {
        if (Number(input.value)) {
          return input.value + 'px'
        }
        return input.value || '0'
      }).join(' ')
    }
  }

  validate() {
    return true
  }
}

interface Size {
  width?: string;
  height?: string;
}

class SizeSetter implements FormItem {
  elementRef: HTMLElement

  private inputs: HTMLInputElement[] = []

  constructor(public name: string,
              private i18n: I18n) {
    this.elementRef = createElement('div', {
      classes: ['textbus-form-group'],
      children: [
        createElement('label', {
          classes: ['textbus-control-label'],
          children: [
            createTextNode(i18n.get('label'))
          ]
        }),
        createElement('div', {
          classes: ['textbus-control-value'],
          children: [
            createElement('div', {
              classes: ['textbus-toolbar-image-size-setter'],
              children: [
                createElement('input', {
                  attrs: { type: 'text', placeholder: i18n.get('widthPlaceholder') },
                  classes: ['textbus-form-control']
                }),
                createTextNode(' * '),
                createElement('input', {
                  attrs: { type: 'text', placeholder: i18n.get('heightPlaceholder') },
                  classes: ['textbus-form-control']
                })
              ]
            })
          ]
        })
      ]
    })
    this.inputs = Array.from(this.elementRef.querySelectorAll('input'))
  }

  reset() {
    this.inputs.forEach(input => input.value = '')
  }

  update(value?: Size) {
    this.inputs[0].value = value?.width || ''
    this.inputs[1].value = value?.height || ''
  }

  getAttr(): AttrState<Size> {
    return {
      name: this.name,
      value: {
        width: this.inputs[0].value,
        height: this.inputs[1].value
      }
    }
  }

  validate(): boolean {
    return true
  }
}

/**
 * 图片组件的功能规划：
 * 1. 将外源图片替换成内源图片（外源图片上传到服务端，返回图片的地址）
 * 2. 更新图片地址（内源图片，根据文件名、服务器、token等信息，查询内源图片地址，返回图片的地址）
 */

export const imageB2UComponent = defineComponent({
  type: ContentType.InlineComponent,
  name: 'ImageB2UComponent',
  setup(data?: ComponentInitData<ImageComponentLiteral>) {
    const injector = useContext()
    const img2Url = injector.get(ImgToUrlService) 
    const imgService = injector.get(ImgService)
    // console.log('img component init')
    // 若图片为 base64
    if (data && data.state && ImgToUrlService.isBase64(data.state.src)) {
      img2Url.addUploadProcess(
        data.state.src, 
        (url) => {
          // console.log(url)
          stateController.update((draft) => {
            draft.src = url
          })
        },
        (err) => {
          // console.log('图片上传失败')
          stateController.update((draft) => {
            draft.src = ''
          })
          console.log(err)
        }
      )
    }

    let state = data?.state || {
      src: ''
    }
    const stateController = useState(state)

    stateController.onChange.subscribe(v => {
      state = v
    })

    const ref = useRef<HTMLImageElement>()

    useDragResize(ref, rect => {
      stateController.update(draft => {
        Object.assign(draft, rect)
      })
    })

    // const injector = useContext()

    const fileUploader = injector.get(FileUploader)
    const i18n = injector.get(I18n)
    const dialog = injector.get(Dialog)

    const self = useSelf()
    onSelected(() => {
      imgService.updateActiveComponent(self)
    })

    const childI18n = i18n.getContext('components.imageComponent.contextMenu')
    onContextMenu(event => {
      event.useMenus([{
        label: childI18n.get('title'),
        iconClasses: ['textbus-icon-image'],
        onClick() {
          const form = new Form({
            title: childI18n.get('title'),
            cancelBtnText: childI18n.get('cancelBtnText'),
            confirmBtnText: childI18n.get('confirmBtnText'),
            items: [
              new FormTextField({
                label: childI18n.get('linkLabel'),
                name: 'src',
                placeholder: childI18n.get('linkInputPlaceholder'),
                canUpload: true,
                uploadType: 'image',
                uploadBtnText: childI18n.get('uploadBtnText'),
                fileUploader,
                validateFn(value: string) {
                  if (!value) {
                    return childI18n.get('validateErrorMessage')
                  }
                  return false
                }
              }),
              new SizeSetter('size', childI18n.getContext('sizeSetter')),
              new SizeSetter('maxSize', childI18n.getContext('maxSizeSetter')),
              new FormRadio({
                label: childI18n.get('float.label'),
                name: 'float',
                values: [{
                  label: childI18n.get('float.noFloatLabel'),
                  value: 'none',
                  default: true
                }, {
                  label: childI18n.get('float.floatToLeftLabel'),
                  value: 'left'
                }, {
                  label: childI18n.get('float.floatToRightLabel'),
                  value: 'right'
                }]
              }),
              new MarginSetter(childI18n.get('marginLabel')),
              new FormSelect({
                label: '边框',
                name: 'border',
                options: [
                  {
                    label: '无', 
                    value: 'none',
                    selected: !state.border || state.border === 'none',
                  },
                  {
                    label: '实线', 
                    value: 'solid',
                    selected: state.border === 'solid',
                  },
                  {
                    label: '虚线', 
                    value: 'dashed',
                    selected: state.border === 'dashed',
                  },
                  {
                    label: '点线', 
                    value: 'dotted',
                    selected: state.border === 'dotted',
                  }
                ],
              })
            ]
          })
          form.update({
            src: state.src,
            margin: state.margin,
            float: state.float,
            size: {
              width: state.width,
              height: state.height
            },
            maxSize: {
              width: state.maxWidth,
              height: state.maxHeight
            },
          })
          dialog.show(form.elementRef)

          const sub = new Subscription()
          sub.add(form.onComplete.subscribe(value => {
            console.log(value)
            const config = {
              src: value.src,
              margin: value.margin,
              float: value.float,
              maxWidth: value.maxSize.width,
              maxHeight: value.maxSize.height,
              width: value.size.width,
              height: value.size.height,
              border: value.border,
            }
            stateController.update(draft => {
              Object.assign(draft, config)
            })
            dialog.hide()
            sub.unsubscribe()
          }))
          sub.add(form.onCancel.subscribe(() => {
            dialog.hide()
            sub.unsubscribe()
          }))
        }
      }])
    })

    return {
      render(): VElement {
        return VElement.createElement('img', {
          src: state.src,
          class: `${'tb-img'}`,
          border: state.border,
          ref: ref,
          style: {
            width: state.width,
            height: state.height,
            maxWidth: state.maxWidth,
            maxHeight: state.maxHeight,
            margin: state.margin,
            float: state.float
          }
        })
      }
    }
  }
})

export const imageB2UComponentLoader: ComponentLoader = {
  match(element: HTMLElement): boolean {
    return element.tagName === 'IMG'
  },
  read(element: HTMLElement, injector: Injector): ComponentInstance {
    const style = element.style
    return imageB2UComponent.createInstance(injector, {
      state: {
        src: element.getAttribute('src') || '',
        width: style.width,
        height: style.height,
        margin: style.margin,
        float: style.float,
        maxWidth: style.maxWidth,
        maxHeight: style.maxHeight,
        border: element.getAttribute('border') || 'none'
      }
    })
  },
}
