import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '../layout/index.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/scene/',
    component: Layout,
    children: [
      {
        path: '/scene/',
        name: 'scene',
        component: async () => await import(/* webpackChunkName: "default" */ '@/views/scene/index.vue'),
      },
      {
        path: '/scene/edit/:id',
        name: 'scene/edit',   
        component: async () => await import(/* webpackChunkName: "default" */ '@/views/scene/edit.vue'),
      },
      {
        path: '/mapversion',
        name: 'mapversion',
        component: async () => await import(/* webpackChunkName: "default" */ '@/views/scene/index.vue'),
      },
      {
        path: '/demo/list',
        name: 'list',
        component: async () => await import(/* webpackChunkName: "default" */ '@/components/list/demo.vue'),
      },
      {
        path: '/demo/table',
        name: 'table',
        component: async () => await import(/* webpackChunkName: "default" */ '@/components/table/demo.vue'),
      },
      {
        path: '/demo/icon/',
        name: 'icon',
        component: async () => await import(/* webpackChunkName: "default" */ '@/components/svg-icon/demo.vue'),
      },
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
    const user = store.user
    if(user.token) {
      if(!user.user) {
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
