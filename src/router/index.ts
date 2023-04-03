import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'test',
    component: async () => await import(/* webpackChunkName: "home" */ '@/views/test/index.vue'),
    meta: {
      title: '设置菜单'
    }
  },
  {
    path: '/test2',
    name: 'test2',
    component: async () => await import(/* webpackChunkName: "home" */ '@/views/test2/index.vue'),
    meta: {
      title: 'test2'
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.VITE_BASE_STATIC_URL),
  routes
})

export default router
