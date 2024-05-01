import { RoutePathEnum, RouteNameEnum } from '@/enums'
import { RouteRecordRaw } from 'vue-router'

const errorRoutes: Array<RouteRecordRaw> = [
  {
    path: RoutePathEnum._400,
    name: RouteNameEnum._400,
    component: () => import(/* webpackChunkName: "about" */ '../pages/modules/http-status-code/400.vue'),
  },
  {
    path: RoutePathEnum._403,
    name: RouteNameEnum._403,
    component: () => import(/* webpackChunkName: "about" */ '../pages/modules/http-status-code/403.vue'),
  },
  {
    path: RoutePathEnum._404,
    name: RouteNameEnum._404,
    component: () => import(/* webpackChunkName: "about" */ '../pages/modules/http-status-code/404.vue'),
  },
]

export default errorRoutes
