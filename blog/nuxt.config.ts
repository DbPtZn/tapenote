import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
// i18n
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'url'
import VueI18nVitePlugin from '@intlify/unplugin-vue-i18n/vite'
// import path from 'node:path'

export default defineNuxtConfig({
  compatibilityDate: '2024-07-21',
  devtools: { enabled: true },
  modules: [
    'nuxtjs-naive-ui',
    'nuxt-mongoose',
    '@nuxt/icon',
    '@pinia/nuxt'
  ],
  // app: {
  //   // 配置页面切换过渡效果
  //   // pageTransition: { name: 'page', mode: 'out-in' }
  // },
  css: ['~/assets/styles/main.scss'],
  build: {
    transpile: ['/vue-i18n/', '@tanbo/bezier'],
  },
  vite: {
    resolve: {
      alias: {
        'vue-i18n': 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js',
      }
    },
    plugins: [
      AutoImport({
        imports: [
          {
            'naive-ui': ['useThemeVars', 'useDialog', 'useMessage', 'useNotification', 'useLoadingBar']
          }
        ]
      }),
      Components({
        resolvers: [NaiveUiResolver()]
      }),
      // 针对 i18n 插件的性能优化 https://vue-i18n.intlify.dev/guide/integrations/nuxt3.html
      VueI18nVitePlugin({
        include: [resolve(dirname(fileURLToPath(import.meta.url)), './locales/*.json')]
      })
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: "@import '~/assets/styles/var.scss';"
        }
      }
    },
    // ssr: {
    //   noExternal: ["naive-ui", "vueuc", "date-fns"],
    // },
    build: {
      minify: 'esbuild',
      chunkSizeWarningLimit: 500,
      cssCodeSplit: true, // 如果设置为false，整个项目中的所有 CSS 将被提取到一个 CSS 文件中
    },
    esbuild: {
      // 排除有问题的模块
      // exclude: ['@tanbo/bezier', '@iconify', 'immer']
      // 将console.log和debugger丢弃
      // drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    },
    optimizeDeps: {
      exclude: ['@tanbo/bezier']
    }
  },
  mongoose: {
    uri: process.env.MONGODB_URI,
    options: {
      //
    },
    modelsDir: '~/server/models',
    devtools: true
  },
  icon: {
    customCollections: [
      {
        prefix: 'custiom-icon',
        dir: './assets/icons'
      }
    ]
  },
  nitro: {
    routeRules: {
      '/api/receiver/**': {
        cors: true, // 允许跨域
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type, Auth-Code'
        },
      }
    }
  },
  $development: {
    //
  },
  $production: {
    //
  },
  /**
   * runtimeConfig：需要在构建后使用环境变量指定的私有或公共令牌
   * 环境变量 √
   * 响应式 √
   * 类型支持 √
   * 每个请求的配置 ×
   * 热模块替换 ×
   * 非原始js类型 ×
   */
  runtimeConfig: {
    jwtSecret: 'DbPtZn',
    // 只在服务器端可用的私有键
    apiSecret: 'DbPtZn',
    // public中的键也可以在客户端使用
    public: {
      apiBase: '/api'
    }
  }
})