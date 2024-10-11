import { ref } from "vue"
import { Bridge } from "../../bridge"
import { fromEvent } from "@tanbo/stream"
import { AnimeProvider } from "@/editor"

export function useSpeech(bridge: Bridge) {
  let animeMap: HTMLElement[] = []
  let animeSequence: string[] = []
  function start(callback: () => void) {
    const elements = bridge.editorRef?.querySelectorAll<HTMLElement>(`[data-id]:not([data-id=""])`)
    if (!elements) return
    animeMap = Array.from(elements)

    const editorEl = bridge.editorRef
    if (!editorEl) return
    
    // 监听点击事件, 从目标动画块开始录制
    const startEvent = fromEvent<PointerEvent>(editorEl, 'click').subscribe(e => {
      const target = e.target as HTMLElement
      const animeElement = AnimeProvider.toAnimeElement(target)
      if (!animeElement) return
      let startpoint = false
      animeMap.forEach(element => {
        if(element === animeElement) {
          startpoint = true
          return
        }
        if(!startpoint) return
        element.style.visibility = 'hidden'
      })
      callback()
      startEvent.unsubscribe()
    })
  }
 
  return {
    startSpeech: start
  }
}