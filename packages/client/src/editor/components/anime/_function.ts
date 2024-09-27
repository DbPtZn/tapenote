import { AnimeUtilsProvider } from "@/editor"
import { ComponentInstance, Injector } from "@textbus/core"

/** 添加动画 */
export function addAnime(componentInstance: ComponentInstance | null, injector: Injector, effect: string, title: string ) {
  if (!componentInstance) return
  const animeUtilsProvider = injector.get(AnimeUtilsProvider)
  const id = animeUtilsProvider.generateAnimeId()
  const serial = animeUtilsProvider.generateAnimeSerial().toString()
  componentInstance.updateState(draft => {
    draft.dataAnime = true
    draft.dataId = id
    draft.dataSerial = serial
    draft.dataActive = false
    draft.dataEffect = effect
    draft.dataTitle = title
    draft.range = false
  })
}