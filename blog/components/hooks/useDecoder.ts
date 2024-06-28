/** 导出编辑器配置 */
import { colorFormatter, textBackgroundColorFormatLoader, colorFormatLoader, textBackgroundColorFormatter, animeIgnoreComponentLoader, animePlayerComponent, animeIgnoreComponent, animePlayerComponentLoader, imageB2UComponent, imageB2UComponentLoader, animePlayerFormatter, animePlayerFormatLoader, ImgToUrlService } from './editor'
import { Injector } from '@textbus/core'
import {
  defaultComponentLoaders,
  defaultComponents,
  defaultFormatLoaders,
  defaultFormatters,
  rootComponent,
  rootComponentLoader,
  type EditorOptions,
} from '@textbus/editor'
function getEditorConfig(content: string, hostname: string, accessToken: string, uploadImgUrl: string) {
  const config: EditorOptions = {
    rootComponent: rootComponent,
    rootComponentLoader: rootComponentLoader,
    content: content || '',
    components: [imageB2UComponent, animePlayerComponent, animeIgnoreComponent, ...defaultComponents],
    componentLoaders: [imageB2UComponentLoader, animePlayerComponentLoader, animeIgnoreComponentLoader, ...defaultComponentLoaders],
    formatters: [animePlayerFormatter, colorFormatter, textBackgroundColorFormatter, ...defaultFormatters],
    formatLoaders: [animePlayerFormatLoader, colorFormatLoader, textBackgroundColorFormatLoader, ...defaultFormatLoaders],
    plugins: [],
    providers: [
      ImgToUrlService
    ],
    setup(injector: Injector) {
      const imgToUrlService = injector.get(ImgToUrlService)
      imgToUrlService.setup({
        hostname: hostname,
        accessToken: accessToken || '',
        uploadImgUrl: '/upload/img'
      }) 
    }
  }
  return config
}
