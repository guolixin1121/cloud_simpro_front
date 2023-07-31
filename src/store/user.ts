// import { useLocalStorage } from '@vueuse/core'
import { LStorage } from '@/utils/storage'
import router from '../router'
import { getQueryParmas } from '@/utils/tools'

export const useUserStore = defineStore('user', () => {
  const user = ref()
  const token = ref()
  const userApi = api.user
  /**
   * 退出当前登录
   */
  const logout = () => {
    user.value = null
    token.value = null
    LStorage.remove('token')
    location.href = import.meta.env.VITE_LOGIN_URL
    // const host = location.hostname
    // if(host.indexOf('.com')) {
    //   if(host.indexOf('pre-')) {
    //     location.href = 'http://pre-ad-data.gacicv.com/auth/realms/gacicv/protocol/openid-connect/auth?redirect_url=http://pre-ad-sim-safety.gacicv.com/&client_id=safety-simulation&response_type=code'
    //   } else {
    //     location.href = 'http://ad-data.gacicv.com/auth/realms/gacicv/protocol/openid-connect/auth?redirect_uri=http://ad-sim-safety.gacicv.com/&client_id=safety-simulation&response_type=code'
    //   }
    // } else {
    //   location.href = '#/login'
    // }
  }

  const hasToken = () => {
    if (token.value) return true
    const code = getQueryParmas('code')
    if (!code) {
      const value = getQueryParmas('token') || localStorage.getItem('token')
      token.value = value
      LStorage.set('token', value)
      return token.value
    }
  }

  /**
   * 获取当前登录用户信息及权限
   */
  const getUserInfo = async () => {
    if (user.value) return

    user.value = await userApi.getLoginUser()
    const permissions = await userApi.getPermissions()

    user.value.permissions = permissions
  }

  /**
   * 当前用户是否有增删改的权限，其他操作不做限制
   * @param action 要验证的操作：'add' | 'edit' | 'delete'
   * @param currentRoute（可选） 要验证的页面路由path
   * @returns boolean  是否有权限
   */
  const hasPermission = (action: DataAction, currentRoute: string = router.currentRoute.value.path): boolean => {
    const ActionMap = {
      编辑: 'edit',
      删除: 'delete'
    }
    const curRoute = (router.currentRoute.value?.query?.preRoute || currentRoute) as string
    const newAction = ActionMap[action as keyof typeof ActionMap] || action
    if (!['add', 'edit', 'delete'].includes(newAction)) return true

    const index = getPermissionIndex(newAction as DataAction, curRoute, user.value?.permissions)
    return index > -1
  }

  // 获取指定action(增删改查等)在权限中的索引，>-1则表示有权限
  const getPermissionIndex = (action: DataAction, currentRoute: string, menuList: Array<any> = []): number => {
    for (let i = 0; i < menuList.length; i++) {
      const menu = menuList[i]
      // 避免有多余的'/'造成的不匹配
      if (menu.path.split('/').join('') === currentRoute.split('/').join('')) {
        return menu.actions?.indexOf(action)
      } else {
        const isValid = getPermissionIndex(action, currentRoute, menu.children)
        if (isValid != -1) {
          return isValid
        }
      }
    }
    return -1
  }

  return { user, token, hasToken, logout, hasPermission, getUserInfo }
})
