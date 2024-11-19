/** 导出编辑器配置 */
import {
  OutlineService,
  colorFormatter,
  textBackgroundColorFormatLoader,
  colorFormatLoader,
  textBackgroundColorFormatter,
  DialogProvider,
  rootComponent,
  rootComponentLoader,
  imageU2BComponent,
  imageU2BComponentLoader,
  Img2base64Service,
  RootEventService,
  animeFormatter,
  animeFormatLoader,
  animeIgnoreComponent, animeIgnoreComponentLoader, animeComponent, animeComponentLoader,
  listComponent, listComponentLoader, headingComponent, headingComponentLoader, defaultPlayerComponents, defaultPlayerComponentLoaders, blockBackgroundColorFormatter, blockBackgroundColorFormatterLoader, ImgService
} from '@/editor'
import { Injector } from '@textbus/core'
import { defaultAttributeLoaders, defaultAttributes, defaultComponentLoaders, defaultComponents, defaultFormatLoaders, defaultFormatters, EditorOptions } from '@textbus/editor'
export function getEditorConfig(content?: string) {
  const config: EditorOptions = {
    rootComponent: rootComponent,
    rootComponentLoader: rootComponentLoader,
    content: content || '',
    components: [imageU2BComponent, ...defaultPlayerComponents],
    componentLoaders: [imageU2BComponentLoader, ...defaultPlayerComponentLoaders],
    formatters: [animeFormatter, colorFormatter, textBackgroundColorFormatter, ...defaultFormatters],
    formatLoaders: [animeFormatLoader, colorFormatLoader, textBackgroundColorFormatLoader, ...defaultFormatLoaders],
    attributes: [blockBackgroundColorFormatter, ...defaultAttributes],
    attributeLoaders: [blockBackgroundColorFormatterLoader, ...defaultAttributeLoaders],
    styleSheets: [],
    providers: [
      Img2base64Service, 
      ImgService, 
      DialogProvider, 
      OutlineService, 
      RootEventService
    ],
    setup(injector: Injector) {
      //
    }
  }
  return config
}
