
import { createSignal, onMounted, createDynamicRef } from '@viewfly/core'
import { createApp } from '@viewfly/platform-browser'
import { withScopedCSS } from '@viewfly/scoped-css'

import { ThemeProvider, AnimeProvider } from '../providers/_api'
import { Editor, defaultComponentLoaders, defaultComponents } from '../editor'
import { AnimeComponentSupportPlugin, LeftToolbarPlugin, ToolbarPlugin } from '../plugins/_api'

import css from './index.scoped.scss'
import { AnimeService } from '../services/anime.service'
import { AnimeComponent, animeComponentLoader } from '../textbus/components/_api'
import { fromEvent } from '@textbus/core'
import { DomAdapter, VIEW_CONTAINER } from '@textbus/platform-browser'

const content = '<div dir="auto" data-component="RootComponent" class="xnote-root"><div data-color="#000000" data-placeholder="" class="xnote-content"><div data-component="ParagraphComponent" class="xnote-paragraph"><div><br></div></div><div data-component="ParagraphComponent" class="xnote-paragraph"><div>啊伟大伟大</div></div><div data-component="TableComponent" data-layout-width="100,100,100,100,100" class="xnote-table"><div class="xnote-table-inner"><div class="xnote-table-container"><table class="xnote-table-content"><colgroup><col style="width:100px;min-width:100px"></col><col style="width:100px;min-width:100px"></col><col style="width:100px;min-width:100px"></col><col style="width:100px;min-width:100px"></col><col style="width:100px;min-width:100px"></col></colgroup><tbody><tr><td><div data-component="ParagraphComponent" class="xnote-paragraph"><div><br></div></div></td><td><div data-component="ParagraphComponent" class="xnote-paragraph"><div><br></div></div></td><td><div data-component="ParagraphComponent" class="xnote-paragraph"><div><br></div></div></td><td><div data-component="ParagraphComponent" class="xnote-paragraph"><div><br></div></div></td><td><div data-component="ParagraphComponent" class="xnote-paragraph"><div><br></div></div></td></tr><tr><td><div data-component="ParagraphComponent" class="xnote-paragraph"><div><br></div></div></td><td><div data-component="ParagraphComponent" class="xnote-paragraph"><div><br></div></div></td><td><div data-component="ParagraphComponent" class="xnote-paragraph"><div><br></div></div></td><td><div data-component="ParagraphComponent" class="xnote-paragraph"><div><br></div></div></td><td><div data-component="ParagraphComponent" class="xnote-paragraph"><div><br></div></div></td></tr><tr><td><div data-component="ParagraphComponent" class="xnote-paragraph"><div><br></div></div></td><td><div data-component="ParagraphComponent" class="xnote-paragraph"><div><br></div></div></td><td><div data-component="ParagraphComponent" class="xnote-paragraph"><div><br></div></div></td><td><div data-component="ParagraphComponent" class="xnote-paragraph"><div><br></div></div></td><td><div data-component="ParagraphComponent" class="xnote-paragraph"><div><br></div></div></td></tr></tbody></table></div></div></div><ol data-component="ListComponent" data-reorder="true" style="margin-left:0px" class="xnote-list"><li><div class="xnote-list-type"><span class="xnote-order-btn">1.</span></div><div class="xnote-list-content">大大挖的</div></li></ol><ol data-component="ListComponent" data-reorder="false" style="margin-left:0px" class="xnote-list"><li><div class="xnote-list-type"><span class="xnote-order-btn">2.</span></div><div class="xnote-list-content">瓦达伟大</div></li></ol><ol data-component="ListComponent" data-reorder="false" style="margin-left:0px" class="xnote-list"><li><div class="xnote-list-type"><span class="xnote-order-btn">3.</span></div><div class="xnote-list-content">啊吴大维</div></li></ol><div data-component="ParagraphComponent" class="xnote-paragraph"><div><br></div></div></div></div>'
const editor = new Editor()
// const editor = new Editor({
//   readonly: false,
//   // additionalAdapters: [

//   // ],
//   content: content,
//   // components: [
//   //   AnimeComponent,
//   //   ...defaultComponents
//   // ],
//   // viewOptions: {
//   //   // componentLoaders: [
//   //   //   animeComponentLoader,
//   //   //   ...defaultComponentLoaders
//   //   // ],
//   //   minHeight: '500px',
//   // },
//   plugins: [
//     new AnimeComponentSupportPlugin(),
//     new LeftToolbarPlugin(),
//     new ToolbarPlugin(),
//   ],
//   providers: [
//     ThemeProvider,
//     AnimeProvider,
//     AnimeService
//   ],
//   beforeEach(textbus) {
//     console.log('beforeEach')
//   },
//   setup(textbus) {
//     const themeProvider = textbus.get(ThemeProvider)
//     themeProvider.setup(textbus)

//     const animeProvider = textbus.get(AnimeProvider)
//     animeProvider.setup(textbus)
//   },
// })

function App() {
  const theme = createSignal<'dark' | 'light'>('light')
  function handleThemeUpdate() {
    theme.set(theme() === 'light' ? 'dark' : 'light')
    const themeProvider = editor.get(ThemeProvider)
    themeProvider.updateTheme(theme())
  }
  const editorRef = createDynamicRef<HTMLElement>((node) => {
    editor.mount(node).then(() => {
      editor.onChange.subscribe(() => {
        // console.log(editor.getHTML())
      })
      // const viewContainer = editor.get(VIEW_CONTAINER)
      // const adapter = editor.get(DomAdapter)
      // const animeProvider = editor.get(AnimeProvider)
      // fromEvent<PointerEvent>(viewContainer, 'click').subscribe(ev => {
      //   // console.log(ev)
      //   // let id = ''
      //   // let serial = ''A
      //   const target = ev.target as HTMLElement
      //   const serial = animeProvider.setAllActiveById(target.dataset.id!)
      //   console.log(serial)
      //   // if (target.tagName.toLocaleLowerCase() === 'anime') {
      //   //   // console.log('anime click')
      //   //     ev.preventDefault() // 阻止默认事件
      //   //     ev.stopPropagation() // 阻止事件冒泡
      //   //     // console.log('anime')
      //   //     if (target.dataset.id && target.dataset.serial) {
      //   //       id = target.dataset.id
      //   //       serial = target.dataset.serial
      //   //     }
      //   // } else if (target.classList.contains('anime-component-tab')) {
      //   //   console.log('anime-component-tab')
      //   //   const node = target.parentElement
      //   //   if(node?.tagName.toLocaleLowerCase() === 'anime-component' || node?.dataset.anime === 'true') {
      //   //     ev.preventDefault() // 阻止默认事件
      //   //     ev.stopPropagation() // 阻止事件冒泡
      //   //     // console.log(node)
      //   //     const component = adapter.getComponentByNativeNode(node)
      //   //     if(component) {
      //   //       // console.log(component.state)
      //   //       const state = component.state
      //   //       console.log(state)
      //   //       if (state && state.dataId && state.dataSerial) {
      //   //         id = state.dataId
      //   //         serial = state.dataSerial
      //   //       }
      //   //     }
      //   //   }
      //   // } else {
      //   //   return
      //   // }
      //   // animeProvider.setActive(id)
      // })
    })
  })
  
  onMounted(() => {
    // 组件挂载后调用
    return () => {
      // 组件销毁时调用
    }
  })
  
  return withScopedCSS(css, () => {
    return <div data-theme={theme()} class="container">
            <button onClick={handleThemeUpdate}>{theme()}</button>
            <div ref={editorRef} class="editor"></div>
          </div>
  })
}

createApp(<App/>).mount(document.getElementById('app')!)