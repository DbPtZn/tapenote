import { withScopedCSS } from '@viewfly/scoped-css'
import 'katex/dist/katex.min.css'
import { Editor } from '@textbus/xnote'
import css from './editor.scoped.scss'
import '@textbus/xnote/bundles/index.css'
import { onMounted } from '@viewfly/core'


export function MyEditor() {
  onMounted(() => {
    const editor = new Editor()
    editor.mount(document.getElementById('editor')!).then(() => {
      console.log('编辑器准备完成。')
    })
  })
  return withScopedCSS(css, () => {
    return (
      <div class="wrapper">
        <div>editor</div>
        <div id="editor" class="editor"></div>
      </div>
    )
  })
}
