// import { useLocalStorage } from '@vueuse/core'
import { getToken, removeToken, setToken, LStorage } from '@/utils/storage'
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
  const logout = async () => {
    user.value = null
    token.value = null
    await api.auth.logout()
    // await api.user.logout()
    removeToken()
    LStorage.remove('auth')
    setTimeout(() => {
      gotoLogin()
    }, 1000)
  }

  const gotoLogin = () => {
    const loginurl = import.meta.env.VITE_LOGIN_URL
    if(loginurl.indexOf('/login') > -1) {
      router.push(loginurl)
    } else {
      location.href = import.meta.env.VITE_LOGIN_URL
    }
  }

  const hasToken = () => {
    if (token.value) return true
    const code = getQueryParmas('code')
    if (!code) {
      const value = getQueryParmas('token') || getToken() // localStorage.getItem('token')
      token.value = value
      setToken(value)
      return token.value
    }
  }

  /**
   * 获取当前登录用户信息及权限
   */
  const getUserInfo = async () => {
    if (user.value) return

    const localUser = await userApi.getLoginUser() // 本系统用户信息
    const authUser = {} // await api.auth.getIdentities() // 权限系统的用户信息
    user.value = { ...localUser, ...authUser }
    LStorage.set('user', user.value.username)

    const permissions = await userApi.getPermissions()
    user.value.permissions = permissions
  }

  // 新版本检查权限方法，直接查询acl数组
  // action： acl返回的键
  const hasAcl = (acl: string) => {
    const acls = user.value?.acls
    return !!acls?.find((item: {acl: string}) => item.acl == acl)
  }

  /**
   * 旧版检查权限方式，在menus接口返回值中，根据当前路由的actions匹配查找
   * 当前用户是否有指定的权限
   * 表格操作列的操作action值支持用中文检索
   * @param action 要验证的操作，支持中文：'编辑' | '新增'，英文：‘add’ ｜ ‘edit’ 等
   * @param currentRoute（可选） 要验证的页面路由path
   * @returns boolean  是否有权限
   */
  const hasPermission = (action: string, currentRoute: string = router.currentRoute.value.path): boolean => {
    const curRoute = (router.currentRoute.value?.query?.preRoute || currentRoute) as string

    // 非一级页面的，依据一级页面
    // const routePaths = curRoute.split('/')
    // if(routePaths.length > 3) {
    //   curRoute = routePaths[1]
    // }

    // 获取action对应的英文
    const actionValue = Operations[action as keyof typeof Operations] || action
    // const operationValues = Object.values(Operations)
    // if (!operationValues.includes(actionValue)) return true

    const index = getPermissionIndex(actionValue, curRoute, user.value?.permissions)
    return index > -1
  }

  // 获取指定action(增删改查等)在权限中的索引，>-1则表示有权限
  const getPermissionIndex = (action: string, currentRoute: string, menuList: Array<any> = []): number => {
    for (let i = 0; i < menuList.length; i++) {
      const menu = menuList[i]
      // 避免有多余的'/'造成的不匹配
      if (menu.path.split('/').join('') === currentRoute.split('/').join('')) {
        return !menu.actions.length ? 0 : menu.actions?.indexOf(action)
      } else {
        const isValid = getPermissionIndex(action, currentRoute, menu.children)
        if (isValid != -1) {
          return isValid
        }
      }
    }
    return -1
  }

  const isAdminProject = () => user.value?.enterpriseAccount == 'CloudproManage'  // 是否是管理端
  const isRegisterUser = () => user.value?.type == '0'  // 是否是注册用户

  return { user, token, hasToken, gotoLogin, logout, hasPermission, hasAcl, getUserInfo, isRegisterUser, isAdminProject }
})
