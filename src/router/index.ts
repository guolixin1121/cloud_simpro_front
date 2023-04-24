import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '../layout/index.vue'
import { generateRouteFromViews } from './route'

const routeFromViews = generateRouteFromViews()
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/scene',
    component: Layout,
    children: [
      ...routeFromViews,
      // {
      //   path: '/scene',
      //   name: 'scene',
      //   component: async () =>
      //     await import(/* webpackChunkName: "default" */ '@/views/scene/index.vue')
      // },
      // {
      //   path: '/scene/edit/:id',
      //   name: 'scene/edit',
      //   component: async () =>
      //     await import(/* webpackChunkName: "default" */ '@/views/scene/edit.vue')
      // },
      // {
      //   path: '/scene/view/:id',
      //   name: 'scene/view',
      //   component: async () =>
      //     await import(/* webpackChunkName: "default" */ '@/views/scene/view.vue')
      // },
      {
        path: '/mapversion',
        name: 'mapversion',
        component: async () => await import(/* webpackChunkName: "default" */ '@/views/scene/index.vue')
      },
      {
        path: '/demo/table',
        name: 'table',
        component: async () => await import(/* webpackChunkName: "default" */ '@/components/table/demo.vue')
      },
      {
        path: '/demo/icon/',
        name: 'icon',
        component: async () => await import(/* webpackChunkName: "default" */ '@/components/svg-icon/demo.vue')
      }
      // {
      //   path: '/map/manage',
      //   name: 'map-manage',
      //   component: async () => await import(/* webpackChunkName: "default" */ '@/views/map-manage/index.vue')
      // },
      // {
      //   path: '/map/version/:id',
      //   name: 'map-version',
      //   component: async () => await import(/* webpackChunkName: "default" */ '@/views/map-manage/map-version.vue')
      // },
      // {
      //   path: '/map/m-version/edit/:id',
      //   name: 'm-version-edit',
      //   component: async () => await import(/* webpackChunkName: "default" */ '@/views/map-manage/m-version-edit.vue')
      // },
      // {
      //   path: '/map/edit/:id',
      //   name: 'map-edit',
      //   component: async () => await import(/* webpackChunkName: "default" */ '@/views/map-manage/edit.vue')
      // },
      // {
      //   path: '/algorithm',
      //   name: 'algorithm',
      //   component: async () => await import(/* webpackChunkName: "default" */ '@/views/algorithm/index.vue')
      // },
      // {
      //   path: '/tags',
      //   name: 'tags',
      //   component: async () => await import(/* webpackChunkName: "default" */ '@/views/tags/index.vue')
      // },
      // {
      //   path: '/tags/edit/:id',
      //   name: 'tags-edit',
      //   component: async () => await import(/* webpackChunkName: "default" */ '@/views/tags/edit.vue')
      // }
    ]
  },
  {
    name: 'login',
    path: '/login',
    component: async () => await import(/* webpackChunkName: "default" */ '@/views/login/index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.VITE_BASE_STATIC_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  if (to.path === '/login' || to.meta.isAuth == false) {
    next()
  } else {
    const user = store.user
    if (user.token) {
      if (!user.user) {
        await user.getUserInfo()
        next()
      } else {
        next()
      }
    } else {
      router.push('/login')
    }
  }
})

export default router
