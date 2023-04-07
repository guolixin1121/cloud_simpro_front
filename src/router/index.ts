import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '../layout/index.vue'
import pinia from '../store/pinia' // router中使用pinia需要引入pinia实例
import { useUserStore } from '../store/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
    component: Layout,
    children: [
      {
        path: '/home',
        name: 'home',
        component: async () => await import(/* webpackChunkName: "default" */ '@/views/test/index.vue'),
        meta: {
          title: '设置菜单'
        }
      },
      {
        path: '/test2',
        name: 'test2',
        component: async () => await import(/* webpackChunkName: "default" */ '@/views/test2/index.vue'),
        meta: {
          title: 'test2'
        }
      }
    ]
  },
  {
    name: 'login',
    path: '/login',
    component: async () => await import(/* webpackChunkName: "default" */ '@/views/login/index.vue'),
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
    const store = useUserStore(pinia)
    if(store.user.token) {
      next()
    } else {
      router.push('/login')
    }
  }
})

export default router
