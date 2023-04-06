import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '../layout/index.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
    component: Layout,
    children: [
      {
        path: '/home',
        name: 'home',
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
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.VITE_BASE_STATIC_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if(to.path === '/login' || to.meta.isAuth == false) {
    next()
  } else {
    next()
  }
})

export default router
