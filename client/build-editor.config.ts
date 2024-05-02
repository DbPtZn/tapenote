// / <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dts from "vite-plugin-dts"
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      vue(),
      // dts()
      dts({
        entryRoot: resolve(__dirname, 'src', 'editor'),
        include: ["src/editor/**/*.ts", "src/editor/**/*.d.ts", "src/editor/**/*.vue"],
      })
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src') // 路径别名
      }
    },
    build: {
      // sourcemap: true,
      // target: 'esnext',
      minify: false,
      outDir: 'editor-dist', //输出文件名称
      lib: {
        entry: resolve(__dirname, 'src', 'editor', 'index.ts'), //指定组件编译入口文件
        name: 'tapenote-editor',
        fileName: 'index',
        formats: ['es']
      }, //库编译模式配置
      copyPublicDir: false, // 禁止将 publicDir 目录中的所有文件复制到 outDir 目录中
      rollupOptions: {
        // input: 'src/renderer/main.ts',
        // treeshake: true, // 剔除未使用的代码
        // 确保外部化处理那些你不想打包进库的依赖
        external: [
          "@tanbo/bezier",
          "@tanbo/stream",
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
          "flatted",
          "js-audio-recorder",
          "jszip",
          "lodash",
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
            vue: 'Vue',
          },
          format: 'es'
        }
      } // rollup打包配置
    }
  }
})
