import { ComponentInitData, ContentType, defineComponent, Injector, Observable, onDestroy, onViewChecked, Subject, Subscription, useContext, useState, VElement } from '@textbus/core'
import { ComponentLoader } from '@textbus/platform-browser'
import { Img2base64Service } from '../services'

/** 组件 */
export const imageU2BComponent = defineComponent({
  name: 'ImageU2BComponent',
  type: ContentType.InlineComponent,
  setup(data: ComponentInitData<any, unknown>) {
    const injector = useContext()
    const img2base64 = injector.get(Img2base64Service)
    let sub: Subscription
    let state = {
      src: data.state.src
    }
    /** 通过正则判断img图片是否为URL */
    const reg = /^https?/gi
    if (reg.test(data.state.src)) {
      /** 使用状态管理 */
      const stateController = useState(state)
      /** 状态更新 */
      sub = stateController.onChange.subscribe(newState => {
        state = newState
      })
      /** 图片转换进程 */
      img2base64.addProcess(data.state.src, result => {
        stateController.update(draft => {
          draft.src = result
        })
      })

      /** 视图更新完成后检查进程 */
      onViewChecked(() => {
        console.log('check')
        img2base64.checkProcess()
      })
      
      onDestroy(() => {
        sub.unsubscribe()
      })
    }
    return {
      render(): VElement {
        return VElement.createElement('img', {
          src: state.src,
          class: 'tb-img',
          style: {
            width: data.state.width,
            height: data.state.height,
            maxWidth: data.state.maxWidth,
            maxHeight: data.state.maxHeight,
            margin: data.state.margin,
            float: data.state.float
          }
        })
      }
    }
  }

  
})

/** 组件加载器 */
export const imageU2BComponentLoader: ComponentLoader = {
  match(element: HTMLElement): boolean {
    return element.tagName === 'IMG'
  },
  read(element: HTMLImageElement, injector: Injector) {
    const style = element.style
    return imageU2BComponent.createInstance(injector, {
      state: {
        src: element.getAttribute('src') || '',
        width: style.width,
        height: style.height,
        margin: style.margin,
        float: style.float,
        maxWidth: style.maxWidth,
        maxHeight: style.maxHeight
      }
    })
  }
}

//传入图片路径，返回base64
// function get_base64(imgUrl: string) {
//   return new Promise((resolve, reject) => {
//     let img = new Image()
//     img.src = imgUrl
//     img.setAttribute('crossOrigin', 'anonymous')

//     img.onload = function () {
//       const canvas = document.createElement('canvas')
//       canvas.width = img.width
//       canvas.height = img.height
//       let ctx = canvas.getContext('2d')
//       ctx && ctx.drawImage(img, 0, 0)
//       let dataURL = canvas.toDataURL('image/png')
//       resolve(dataURL.replace(`/^data:image/(png|jpg);base64`, `/`, ''))
//     }
//     img.onerror = function () {
//       reject('The image could not be loaded.')
//     }
//   })
// }

// const base64ImgtoFile = (baseUrl: any, filename = 'file') => {
//   const arr = baseUrl.split(',')
//   const mime = arr[0].match(/:(.*?);/)[1]
//   const suffix = mime.split('/')[1]
//   const bstr = window.atob(arr[1])
//   // const bstr = Buffer.from(arr[1], 'base64').toString('base64')
//   let n = bstr.length
//   const u8arr = new Uint8Array(n)
//   while (n--) {
//     u8arr[n] = bstr.charCodeAt(n)
//   }
//   return new File([u8arr], `${filename}.${suffix}`, {
//     type: mime
//   })
// }
