import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '../layout/index.vue'
import { generateRouteFromViews } from './route'

const routeFromViews = generateRouteFromViews()
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/scene/',
    component: Layout,
    children: [
      ...routeFromViews,
      {
        path: '/demo',
        name: 'demo',
        component: async () => await import(/* webpackChunkName: "default" */ '@/components/index.vue')
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
