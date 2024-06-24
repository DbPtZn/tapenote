// uno.config.ts
import { defineConfig, presetAttributify, presetUno, presetWind, presetIcons } from 'unocss'
export default defineConfig({
  presets: [
    // presetAttributify({ /* preset 选项 */}),
    // presetUno(),
    // presetWind(),
    presetIcons()
  ],
  // rules: [
  //   ['m-1', { margin: '1px' }],
  // ],
})