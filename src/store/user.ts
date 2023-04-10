import { defineStore } from "pinia"
import { useLocalStorage } from "@vueuse/core"
import { useUserApi } from '../apis/user'
import router from '../router'

export const useUserStore = defineStore('use', () => {
   const defaultUser = { token: '', name: '', username: '', permissions: [] }
   const user = useLocalStorage('user', defaultUser)
   
   /**
    * 退出当前登录
    */
   const logout = () => {
      user.value = null
      router.push('/login')
   }

   /**
    * 登录，并获取权限
    */
   const login = async () => { 
      const userApi = useUserApi()
      const data = await userApi.getLoginUser()
      user.value = data

      const permissions = await userApi.getPermissions()
      user.value.permissions = permissions
    }

    /**
     * 当前用户是否有某个操作权限
     * @param action 要验证的操作：'add' | 'edit' | 'delete'
     * @param currentRoute（可选） 要验证的页面路由path
     * @returns boolean  是否有权限
     */
    const hasPermission = (action: DataAction, currentRoute: string = router.currentRoute.value.path): boolean => {
       const index = getPermissionIndex(action, currentRoute, user.value.permissions )
       return index > -1
    }

    // 获取指定action在权限中的索引，>-1则表示有权限
    const getPermissionIndex = (action: DataAction, currentRoute: string, menuList: Array<any> = [] ): number => {
      for(let i = 0; i < menuList.length; i++) {
         const menu = menuList[i]
         if(menu.path === currentRoute) {
            return menu.actions?.indexOf(action)
         } else {
            const isValid = getPermissionIndex(action, currentRoute, menu.children)
            if(isValid != -1){
               return isValid
            }
         }
      }
      return -1
    }

   return { user, login, logout, hasPermission }
})
