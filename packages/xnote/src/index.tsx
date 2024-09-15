import { createApp } from '@viewfly/platform-browser'
import 'reflect-metadata'
import './index.css'
import { Header } from './components/header/header'
import { MyEditor } from './components/editor/editor'
function App() {
  return () => {
    return (
      <div class="app">
        <Header/>
        <main>
          <MyEditor/>
        </main>
      </div>
    )
  }
}

createApp(<App/>).mount(document.getElementById('app')!)
