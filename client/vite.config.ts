/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import eslintPlugin from 'vite-plugin-eslint'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // const env = loadEnv(mode, process.cwd(), '')
  // console.log(env.NODE_ENV)
  return {
    plugins: [
      vue(),
      eslintPlugin({
        include: ['src/**/*.js', 'src/**/*.vue', 'src/**/*.ts'],
        exclude: ['./node_modules/**'],
        cache: false
      }),
      Components({
        extensions: ['vue'],
        resolvers: [NaiveUiResolver()],
        // 可以指定放置类型声明文件的位置和名称
        dts: 'src/types/components.d.ts'
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src') // 路径别名
      }
    },
    // css: {
    //   preprocessorOptions: {
    //     scss: {
    //       additionalData: `@import "@/editor/styles/skins/_index.scss";`,
    //     }
    //   }
    // },
    test: {
      globals: true
    },
    // server: {
    //   host: '0.0.0.0',
    //   // port: '3000'
    // }
  }
})