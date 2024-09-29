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
  imageB2UComponent,
  imageB2UComponentLoader,
  colorFormatLoader,
  colorFormatter,
  textBackgroundColorFormatLoader,
  textBackgroundColorFormatter,
  preComponent,
  preComponentLoader,
  animeFormatter,
  animeFormatLoader
} from '@/editor'
import {   
  animeIgnoreComponent,
  animeIgnoreComponentLoader,
  animeComponent,
  animeComponentLoader
} from '@/editor/anime'
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
    providers: [ImgToUrlService],
    setup(injector: Injector) {
      const imgToUrlService = injector.get(ImgToUrlService)
      const { uploadImgFunction } = useUploadImg('/upload/img', account, hostname)
      imgToUrlService.setup(uploadImgFunction)
    }
  }
  return config
}

