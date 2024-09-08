/** 导出编辑器配置 */
import { OutlineService, colorFormatter, textBackgroundColorFormatLoader, colorFormatLoader, textBackgroundColorFormatter, DialogProvider, rootComponent, rootComponentLoader, imageU2BComponent, imageU2BComponentLoader, Img2base64Service, animePlayerFormatLoader, animePlayerFormatter, animePlayerComponentLoader, animePlayerComponent, animeIgnoreComponent, animeIgnoreComponentLoader, RootEventService, AnimeEventService } from '@/editor'
import { Injector } from '@textbus/core'
import {
  defaultComponentLoaders,
  defaultComponents,
  defaultFormatLoaders,
  defaultFormatters,
  EditorOptions,
} from '@textbus/editor'
export function getEditorConfig(content?: string) {
  const config: EditorOptions = {
    rootComponent: rootComponent,
    rootComponentLoader: rootComponentLoader,
    content: content || '',
    components: [imageU2BComponent, animePlayerComponent, animeIgnoreComponent, ...defaultComponents],
    componentLoaders: [animePlayerComponentLoader, animeIgnoreComponentLoader, imageU2BComponentLoader, ...defaultComponentLoaders],
    formatters: [animePlayerFormatter, colorFormatter, textBackgroundColorFormatter, ...defaultFormatters],
    formatLoaders: [animePlayerFormatLoader, colorFormatLoader, textBackgroundColorFormatLoader, ...defaultFormatLoaders],
    styleSheets: [],
    providers: [
      Img2base64Service,
      DialogProvider, OutlineService, RootEventService, AnimeEventService
    ],
    setup(injector: Injector) {
      //
    }
  }
  return config
}
