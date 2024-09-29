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
  animeFormatLoader
} from '@/editor'
import { 
  animeIgnoreComponent, animeIgnoreComponentLoader, animeComponent, animeComponentLoader,
  listComponent, listComponentLoader, headingComponent, headingComponentLoader
 } from '@/editor/anime'
import { Injector } from '@textbus/core'
import { defaultComponentLoaders, defaultComponents, defaultFormatLoaders, defaultFormatters, EditorOptions } from '@textbus/editor'
export function getEditorConfig(content?: string) {
  const config: EditorOptions = {
    rootComponent: rootComponent,
    rootComponentLoader: rootComponentLoader,
    content: content || '',
    components: [imageU2BComponent, animeComponent, animeIgnoreComponent, ...defaultComponents],
    componentLoaders: [imageU2BComponentLoader, animeComponentLoader, animeIgnoreComponentLoader, ...defaultComponentLoaders],
    formatters: [animeFormatter, colorFormatter, textBackgroundColorFormatter, ...defaultFormatters],
    formatLoaders: [animeFormatLoader, colorFormatLoader, textBackgroundColorFormatLoader, ...defaultFormatLoaders],
    styleSheets: [],
    providers: [Img2base64Service, DialogProvider, OutlineService, RootEventService],
    setup(injector: Injector) {
      //
    }
  }
  return config
}
