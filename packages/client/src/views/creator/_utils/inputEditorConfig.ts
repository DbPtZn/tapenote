import { Injector, Subscription, debounceTime } from '@textbus/core'
import { useUploadImg } from './useUploadImg'
import {
  defaultComponentLoaders,
  defaultComponents,
  defaultFormatLoaders,
  defaultFormatters,
  rootComponent,
  rootComponentLoader,
  type Editor,
  createEditor,
  Layout
} from '@textbus/editor'
import {
  ImgToUrlService,
  animeIgnoreComponent,
  animeIgnoreComponentLoader,
  animePlayerComponent,
  animePlayerComponentLoader,
  animePlayerFormatLoader,
  animePlayerFormatter,
  imageB2UComponent,
  imageB2UComponentLoader,
  colorFormatLoader,
  colorFormatter,
  textBackgroundColorFormatLoader,
  textBackgroundColorFormatter,
  preComponent,
  preComponentLoader
} from '@/editor'

export function getInputEditorConfig(account: string, hostname: string) {
  const config = {
    rootComponent: rootComponent,
    rootComponentLoader: rootComponentLoader,
    content: '',
    components: [imageB2UComponent, animePlayerComponent, animeIgnoreComponent, preComponent, ...defaultComponents],
    componentLoaders: [imageB2UComponentLoader, animePlayerComponentLoader, animeIgnoreComponentLoader, preComponentLoader, ...defaultComponentLoaders],
    formatters: [animePlayerFormatter, colorFormatter, textBackgroundColorFormatter, ...defaultFormatters],
    formatLoaders: [animePlayerFormatLoader, colorFormatLoader, textBackgroundColorFormatLoader, ...defaultFormatLoaders],
    plugins: [],
    providers: [ImgToUrlService],
    setup(injector: Injector) {
      const imgToUrlService = injector.get(ImgToUrlService)
      const { uploadImgFunction } = useUploadImg('/upload/img', account, hostname)
      imgToUrlService.setup(uploadImgFunction)
    }
  }
  return config
}

