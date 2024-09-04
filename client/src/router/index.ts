import { RouteNameEnum, RoutePathEnum } from '@/enums'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import microRoutes from './micro'
import errorRoutes from './error'
const routes: Array<RouteRecordRaw> = [
  /** 主页 */
  {
    path: RoutePathEnum.HOME,
    name: RouteNameEnum.HOME,
    component: () => import(/* webpackChunkName: "about" */ '../pages/modules/CreatorPage.vue'),
    // beforeEnter() {
    //   useRendererStore().set(mainShell)
    // }
  },
  {
    path: '/home',
    redirect: RouteNameEnum.HOME
  },
  {
    path: RoutePathEnum.MANAGER,
    name: RouteNameEnum.MANAGER,
    component: () => import(/* webpackChunkName: "about" */ '../pages/modules/ManagePage .vue'),
  },
  {
    path: RoutePathEnum.DEFAULT,
    name: RouteNameEnum.DEFAULT,
    component: () => import(/* webpackChunkName: "about" */ '../pages/modules/DefaultPage.vue'),
  },
  {
    path: RoutePathEnum.DEFAULT,
    name: RouteNameEnum.DEFAULT,
    component: () => import(/* webpackChunkName: "about" */ '../pages/modules/DefaultPage.vue'),
  },
  {
    path: RoutePathEnum.LOGIN,
    name: RouteNameEnum.LOGIN,
    component: () => import(/* webpackChunkName: "about" */ '../pages/modules/LoginPage.vue'),
    // 访问该路由之前执行：
    // beforeEnter(to, from, next) {
    //   const token = sessionStorage.getItem('accessToken')
    //   token ? next(RoutePathEnum.HOME) : next()
    // }
  },
  {
    path: RoutePathEnum.REGISTER,
    name: RouteNameEnum.REGISTER,
    component: () => import(/* webpackChunkName: "about" */ '../pages/modules/RegisterPage.vue')
  },
  ...microRoutes,
  ...errorRoutes
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 登录状态导航守卫：
// router.beforeEach((to, from, next) => {
//   // to 跳转的路由
//   // from 从哪个路由来
//   // next() 继续执行
//   // 验证 token ，仅在 token 存在的时候，可以跳转到其它页面。（如果是前往登录页面或注册页面则不做限制）
//   const accesstoken = sessionStorage.getItem('accessToken')
//   // console.log(token)
//   // const { userStore } = useStore()
//   if (accesstoken || to.name === RouteNameEnum.LOGIN || to.name === RouteNameEnum.REGISTER) {
//     // to.name === RouteNameEnum.LOGIN || to.name === RouteNameEnum.REGISTER ? '' : userStore.getInfo()
//     next()
//   } else {
//     next(RouteNameEnum.LOGIN)
//   }
// })

export default router
