/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import eslintPlugin from 'vite-plugin-eslint'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import dts from "vite-plugin-dts"

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
      dts({
        insertTypesEntry: true,
        copyDtsFiles: false,
      })
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
    buildContainer: {
      // root: './src', // 设置根目录为 src 文件夹
      outDir: 'fractal-container', //输出文件名称
      lib: {
        entry: 'src/renderer/main.ts', //指定组件编译入口文件
        name: '@dbptzn/fractal-container',
        fileName: 'fractal-container'
      }, //库编译模式配置
      rollupOptions: {
        // 确保外部化处理那些你不想打包进库的依赖
        external: [
          "@tanbo/bezier",
          // "@tanbo/stream",
          "@textbus/core",
          "@textbus/editor",
          "@textbus/platform-browser",
          "@vueuse/core",
          "animate.css",
          "animejs",
          "axios",
          "classnames",
          "dayjs",
          "ejs",
          // "element-resize-detector",
          // "flatted",
          "js-audio-recorder",
          "jszip",
          // "lodash",
          "material-icons",
          "naive-ui",
          "pinia",
          "pinia-plugin-persistedstate",
          "prismjs",
          "reflect-metadata",
          "tslib",
          "uuid",
          "vfonts",
          // "vue",
          "vue-router",
          "vuedraggable"
        ],
        output: {
          // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
          globals: {
            vue: 'Vue'
          }
        }
      } // rollup打包配置
    }
  }
})