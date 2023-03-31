import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'test',
    component: async () => await import(/* webpackChunkName: "home" */ '@/views/test/index.vue'),
    meta: {
      title: '设置菜单'
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
