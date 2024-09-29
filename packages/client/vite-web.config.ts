import { defineConfig, loadEnv } from 'vite'
import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import eslintPlugin from 'vite-plugin-eslint'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import UnoCSS from 'unocss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    base: env.VITE_ASSETS_BASE ? env.VITE_ASSETS_BASE : '',
    plugins: [
      vue(),
      // UnoCSS(),
      Components({
        extensions: ['vue'],
        resolvers: [NaiveUiResolver()],
        // 可以指定放置类型声明文件的位置和名称
        dts: 'src/types/components.d.ts'
      }),
      // VitePWA({
      //   manifest: {
      //     name: '笔记映画',
      //     short_name: 'Tapenote',
      //     description: 'A cloud note app',
      //     theme_color: '#ffffff',
      //     background_color: '#ffffff',
      //     display: 'standalone',
      //     icons: [
      //       {
      //         src: 'logo192.png',
      //         sizes: '192x192',
      //         type: 'image/png',
      //       },
      //     ],
      //   },
      // }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'), // 路径别名
        '#': path.resolve(__dirname, '.')
      }
    },
    // optimizeDeps: {
    //   exclude: ["@textbus/core", "@textbus/platform-browser", "@textbus/editor", "reflect-metadata", "@tanbo/bezier", "@tanbo/stream"]
    // },
    server: {
      host: '0.0.0.0',
      port: 8080,
      open: true
    }
  }
})
