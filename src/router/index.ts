import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '../layout/index.vue'
import { generateRouteFromViews } from './route'
import { getQueryParmas } from '@/utils/tools'

const routeFromViews = generateRouteFromViews()
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/scene/',
    component: Layout,
    children: [
      ...routeFromViews,
      {
        path: '/mapset/edit/:id/:name',
        name: '/mapset/edit/',
        component: async () => await import(/* webpackChunkName: "default" */ '@/views/mapset/edit.vue')
      },
      {
        path: '/mapset/view/:id/:name',
        name: '/mapset/view/',
        component: async () => await import(/* webpackChunkName: "default" */ '@/views/mapset/view.vue')
      },
      {
        path: '/demo',
        name: 'demo',
        component: async () => await import(/* webpackChunkName: "default" */ '@/components/demo.vue')
      }
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
  if (to.path === '/login') {
    next()
  } else {
    const user = store.user
    if (user.hasToken()) {
      await user.getUserInfo()
      next()
    } else {
      const code = getQueryParmas('code')
      // 从其他业务系统跳转
      if (code) {
        const userApi = api.user
        const res = await userApi.getToken({ code })
        localStorage.setItem('token', res.token)
        location.href = '/'
      } else {
        message.info('无效身份，请先登录!')
        user.logout()
      }
    }
  }
})

export default router
