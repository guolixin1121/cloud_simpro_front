import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '../layout/index.vue'
import { generateRouteFromViews } from './route'
import { getQueryParmas } from '@/utils/tools'
import { setToken } from '@/utils/storage'
import { showLoading, hideLoading } from '@/utils/loading'

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
    component: async () => await import(/* webpackChunkName: "demo" */ '@/components/index.vue'),
    meta: {
      auth: false
    }
  },
  {
    name: 'login',
    path: '/login',
    component: async () => await import(/* webpackChunkName: "default" */ '@/views/login/index.vue'),
    meta: {
      auth: false
    }
  },
  {
    path: '/404',
    component: async () => await import(/* webpackChunkName: "default" */ '@/views/404/index.vue'),
    meta: {
      auth: false
    }
  },
  {
    path: '/:pathMatch(.*)',
    redirect: '/404'
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.VITE_BASE_STATIC_URL),
  routes
})

  // 检测项目空间初始化是否完成
const interval = setInterval(checkProjectStatus, 5000)
// checkProjectStatus()
async function checkProjectStatus() {
  const project = await api.user.project()
  if(project?.data_config_status == '2') {
    clearInterval(interval)
    hideLoading()
  } else {
    showLoading('正在为您初始化数据， 请您耐心等待~~')
  }
}

router.beforeEach(async (to, from, next) => {
  if (to.meta.auth == false) {
    next()
  } else {
    const user = store.user
    if (await user.hasToken()) {
      await user.getUserInfo()
      next()
    } else {
      const code = getQueryParmas('code')
      // 从其他业务系统跳转
      if (code) {
        const userApi = api.user
        const res = await userApi.getToken({ code })
        setToken(res.token)
        location.href = process.env.VITE_BASE_STATIC_URL || '/'
      } else {
        user.gotoLogin()
      }
    }
  }
})

export default router
