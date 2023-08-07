import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '../layout/index.vue'
import { generateRouteFromViews } from './route'
import { getQueryParmas } from '@/utils/tools'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/overview/',
    component: Layout,
    children: generateRouteFromViews()
  },
  {
    path: '/demo',
    name: 'demo',
    component: async () => await import(/* webpackChunkName: "demo" */ '@/components/index.vue')
  },
  {
    name: 'login',
    path: '/login',
    component: async () => await import(/* webpackChunkName: "login" */ '@/views/login/index.vue')
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
    if (await user.hasToken()) {
      await user.getUserInfo()
      next()
    } else {
      // message.info('无效身份，请先登录!')
      // user.logout()
      const code = getQueryParmas('code')
      // 从其他业务系统跳转
      if (code) {
        const userApi = api.user
        const res = await userApi.getToken({ code })
        localStorage.setItem('token', res.token)
        location.href = process.env.VITE_BASE_STATIC_URL || '/'
      } else {
        message.info('无效身份，请先登录!')
        user.logout()
      }
    }
  }
})

export default router
