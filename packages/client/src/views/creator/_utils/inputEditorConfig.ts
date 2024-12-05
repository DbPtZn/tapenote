import { Injector, Subscription, debounceTime } from '@textbus/core'
import { useUploadImg } from '../_hooks/useUploadImg'
import {
  defaultComponentLoaders,
  defaultComponents,
  defaultFormatLoaders,
  defaultFormatters,
  rootComponent,
  rootComponentLoader,
} from '@textbus/editor'
import {
  ImgToUrlService,
  imageB2UComponent,
  imageB2UComponentLoader,
  colorFormatLoader,
  colorFormatter,
  textBackgroundColorFormatLoader,
  textBackgroundColorFormatter,
  preComponent,
  preComponentLoader,
  animeFormatter,
  animeFormatLoader,
  animeIgnoreComponent,
  animeIgnoreComponentLoader,
  animeComponent,
  animeComponentLoader,
  ImgService
} from '@/editor'

export function getInputEditorConfig(account: string, hostname: string) {
  const config = {
    rootComponent: rootComponent,
    rootComponentLoader: rootComponentLoader,
    content: '',
    components: [imageB2UComponent, animeComponent, animeIgnoreComponent, preComponent, ...defaultComponents],
    componentLoaders: [imageB2UComponentLoader, animeComponentLoader, animeIgnoreComponentLoader, preComponentLoader, ...defaultComponentLoaders],
    formatters: [animeFormatter, colorFormatter, textBackgroundColorFormatter, ...defaultFormatters],
    formatLoaders: [animeFormatLoader, colorFormatLoader, textBackgroundColorFormatLoader, ...defaultFormatLoaders],
    plugins: [],
    providers: [ImgToUrlService, ImgService],
    setup(injector: Injector) {
      const imgToUrlService = injector.get(ImgToUrlService)
      const { uploadImgBase64 } = useUploadImg(account, hostname)
      imgToUrlService.setup(uploadImgBase64)
    }
  }
  return config
}

