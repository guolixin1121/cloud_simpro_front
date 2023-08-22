// import { useLocalStorage } from '@vueuse/core'
import { LStorage } from '@/utils/storage'
import router from '../router'
import { getQueryParmas } from '@/utils/tools'
import { Operations } from '@/utils/dict'

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
    setTimeout(() => {
      location.href = import.meta.env.VITE_LOGIN_URL
      // test site
      if(location.hostname.indexOf('pre-') > -1) {
        location.href = import.meta.env.VITE_LOGIN_Test_URL
      }
    }, 1000)
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
   * @param action 要验证的操作：'编辑' | '新增'等
   * @param currentRoute（可选） 要验证的页面路由path
   * @returns boolean  是否有权限
   */
  const hasPermission = (action: DataAction, currentRoute: string = router.currentRoute.value.path): boolean => {
    const curRoute = (router.currentRoute.value?.query?.preRoute || currentRoute) as string

    // 获取action对应的英文
    const actionValue = Operations[action as keyof typeof Operations] || action
    const operationValues = Object.values(Operations)
    if (!operationValues.includes(actionValue)) return true

    const index = getPermissionIndex(actionValue as DataAction, curRoute, user.value?.permissions)
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
