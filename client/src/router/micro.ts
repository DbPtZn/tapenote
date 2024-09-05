import { RoutePathEnum, RouteNameEnum } from '@/enums'
import { RouteRecordRaw } from 'vue-router'

const microRoutes: Array<RouteRecordRaw> = [
  {
    path: RoutePathEnum.MICRO,
    name: RouteNameEnum.MICRO,
    component: () => import(/* webpackChunkName: "about" */ '../views/micro/Index.vue'),
    children: [
      {
        path: RoutePathEnum.RECENT,
        name: RouteNameEnum.RECENT,
        component: () => import(/* webpackChunkName: "about" */ '../views/micro/home/Home.vue'),
      },
      {
        path: `${RoutePathEnum.FOLDER}/:id`,
        name: RouteNameEnum.FOLDER,
        component: () => import(/* webpackChunkName: "about" */ '../views/micro/folder/Folder.vue')
      },
      {
        path: RoutePathEnum.SHARE,
        name: RouteNameEnum.SHARE,
        component: () => import(/* webpackChunkName: "about" */ '../views/micro/share/Share.vue'),
      },
      {
        path: RoutePathEnum.ADMIN,
        name: RouteNameEnum.ADMIN,
        component: () => import(/* webpackChunkName: "about" */ '../views/micro/admin/Admin.vue'),
      },
      {
        path: `${RoutePathEnum.PROJECT}`,
        name: RouteNameEnum.PROJECT,
        component: () => import(/* webpackChunkName: "about" */ '../views/micro/project/Project.vue'),
      }
    ]
  },
]

export default microRoutes
