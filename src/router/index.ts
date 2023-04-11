import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '../layout/index.vue'
import pinia from '../store/pinia' // router中使用pinia需要引入pinia实例
import { useUserStore } from '../store/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/scene/scene/',
    component: Layout,
    children: [
      {
        path: '/scene/scene/',
        name: 'scene',
        component: async () => await import(/* webpackChunkName: "default" */ '@/views/scene/index.vue'),
      },
      {
        path: '/map/second/',
        name: 'map/second',   
        component: async () => await import(/* webpackChunkName: "default" */ '@/views/demo/icon/index.vue'),
      },
      {
        path: '/mapversion',
        name: 'mapversion',
        component: async () => await import(/* webpackChunkName: "default" */ '@/views/demo/table/index.vue'),
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

router.beforeEach(async (to, from, next) => {
  if(to.path === '/login' || to.meta.isAuth == false) {
    next()
  } else {
    const store = useUserStore(pinia)
    if(store.token) {
      if(!store.user) {
        await store.getUserInfo()
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
