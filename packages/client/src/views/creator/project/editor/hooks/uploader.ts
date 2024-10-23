import { useUploadImg } from '../../../_utils'
import { UploadConfig } from '@textbus/editor'

export function uploader(config: UploadConfig, account: string, hostname: string) {
  return new Promise<string>((resolve, reject) => {
    if (config.uploadType === 'image') {
      var fileInput = document.createElement('input')
      fileInput.setAttribute('type', 'file')
      fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon')
      fileInput.multiple = config.multiple
      fileInput.style.cssText = 'position: absolute; left: -9999px; top:-9999px; opacity: 0'

      fileInput.addEventListener('change', function (event) {
        const target = event.target as HTMLInputElement
        const files = target.files
        if (files && files.length > 0) {
          const { uploadImgFile } = useUploadImg('/upload/img', account, hostname)
          uploadImgFile(files[0])
            .then(url => {
              resolve(url)
            })
            .catch(err => reject(err))
          document.body.removeChild(fileInput)
        }
      })
      document.body.appendChild(fileInput)
      fileInput.click()
    }
  })
}
