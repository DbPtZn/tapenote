
import { createSignal, onMounted, createDynamicRef } from '@viewfly/core'
import { createApp } from '@viewfly/platform-browser'
import { withScopedCSS } from '@viewfly/scoped-css'

import { ThemeProvider } from '../providers/theme.provider'
import { Editor } from '../editor'

import css from './index.scoped.scss'

const editor = new Editor({
  readonly: false,
  content: document.getElementById('article')!.innerHTML,
  viewOptions: {
    minHeight: '500px',
  },
  providers: [
    ThemeProvider,
  ],
  beforeEach(textbus) {
    console.log('beforeEach')
  },
  setup(textbus) {
    const themeProvider = textbus.get(ThemeProvider)
    themeProvider.setup(textbus)
  },
})


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
        // console.log(result.innerHTML = editor.getHTML())
      })
    })
  })
  
  onMounted(() => {
    // 组件挂载后调用
    return () => {
      // 组件销毁时调用
    }
  })
  
  return withScopedCSS(css, () => {
    return <div class="container">
            <button onClick={handleThemeUpdate}>{theme()}</button>
            <div ref={editorRef} class="editor"></div>
          </div>
  })
}

const app = createApp(<App/>).mount(document.getElementById('app')!)
console.log('app create')