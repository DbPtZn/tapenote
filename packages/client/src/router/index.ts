import { RouteNameEnum, RoutePathEnum } from '@/enums'
import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router'
import microRoutes from './micro'
import errorRoutes from './error'
import useStore from '@/store'
const routes: Array<RouteRecordRaw> = [
  /** 主页 */
  {
    path: RoutePathEnum.HOME,
    name: RouteNameEnum.HOME,
    component: () => import(/* webpackChunkName: "about" */ '../pages/modules/CreatorPage.vue'),
    beforeEnter(to, from, next) {
      const { microStore } = useStore()
      microStore.isMobile ? router.push({ name: RouteNameEnum.RECENT }) : next()
    }
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

import.meta.env.MODE === 'development' && routes.push(
  {
    path: '/editor',
    name: 'editor',
    component: () => import(/* webpackChunkName: "about" */ '../pages/modules/EditorPage.vue'),
  },
  {
    path: '/xnote',
    name: 'xnote',
    component: () => import(/* webpackChunkName: "about" */ '../views/creator/project/editor/Xnote.vue'),
  }
)

const router = createRouter({
  // history: createWebHashHistory(),
  history: createWebHistory(),
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
