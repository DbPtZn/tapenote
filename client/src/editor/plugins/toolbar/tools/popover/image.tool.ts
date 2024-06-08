// import { boldFormatter, colorFormatter } from '../../../../formatters/_api'
import { Commander, QueryState, FormatValue, Query, QueryStateType, Injector } from '@textbus/core'
import { ButtonTool, ButtonToolConfig, PopoverTool, PopoverToolConfig } from '../../toolkit'
// import { MaterialTypeEnum } from '../../../../enum'
// import { zh_CN } from '../../../../i18n/_api'
// import { I18n, imageComponent } from '@/editor'
import { h } from 'vue'
// import { ImageForm } from './_utils/_api'
import ImageForm from './_utils/ImageForm.vue'
import { I18n, imageComponent } from '@textbus/editor'

export function imageToolConfigFactory(injector: Injector): PopoverToolConfig {
  const i18n = injector.get(I18n)
  const commander = injector.get(Commander)
  // const fileUploader = injector.get(FileUploader)
  // const childI18n = i18n.getContext('plugins.toolbar.imageTool.view')
  // const form = new Form({
  //   mini: true,
  //   confirmBtnText: childI18n.get('confirmBtnText'),
  //   items: [
  //     new FormTextField({
  //       label: childI18n.get('linkLabel'),
  //       name: 'src',
  //       placeholder: childI18n.get('linkInputPlaceholder')
  //     }),
  //     new FormButton({
  //       name: '',
  //       value: '',
  //       label: childI18n.get('uploadLabel'),
  //       btnText: childI18n.get('uploadBtnText'),
  //       iconClasses: ['textbus-icon-upload'],
  //       onClick() {
  //         fileUploader.upload({
  //           multiple: true,
  //           uploadType: 'image',
  //           currentValue: ''
  //         }).subscribe(value => {
  //           if (typeof value === 'string') {
  //             value = [value]
  //           }
  //           value.forEach(i => {
  //             commander.insert(imageComponent.createInstance(injector, {
  //               state: {
  //                 src: i
  //               }
  //             }))
  //           })
  //         })
  //       }
  //     })
  //   ]
  // })
  return {
    iconClasses: ['textbus-icon-image'],
    tooltip: i18n.get('plugins.toolbar.imageTool.tooltip'),
    queryState(): QueryState<any> {
      return {
        state: QueryStateType.Normal,
        value: null
      }
    },
    view: h(ImageForm, {
      onConfirm: res => {
        if (!res.src) {
          return
        }
        commander.insert(
          imageComponent.createInstance(injector, {
            state: {
              src: res.src
            }
          })
        )
      }
    }),
    useValue(value: any) {
      // if (!value) {
      //   return
      // }
      // commander.insert(
      //   imageComponent.createInstance(injector, {
      //     state: {
      //       src: value.src
      //     }
      //   })
      // )
    }
  }
}

export function imageTool() {
  return new PopoverTool(imageToolConfigFactory)
}
