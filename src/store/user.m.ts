import { useSessionStorage } from "@vueuse/core"
import router from '../router'

export const useUserStore = defineStore('use', () => {
   // const defaultUser = { username: '', nickName: '', userId: 0, permissions: [] }
   // const user = useLocalStorage('user', defaultUser)
   const user = ref()
   const token = useSessionStorage('token', null)
   
   /**
    * 退出当前登录
    */
   const logout = () => {
      token.value = null
      user.value = null
      router.push('/login')
   }

   /**
    * 登录
    */
   const login = async (auth: Record<string, any>) => { 
      const authData = await apis.user.login(auth)

      token.value = authData.token
      // SStorage.storage.token = authData.token
   }

   /**
    * 获取当前登录用户信息
    */
   const getUserInfo = async () => {
      user.value = await apis.user.getLoginUser()
      
      const permissions = await apis.user.getPermissions()
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
         '编辑': 'edit',
         '删除': 'delete'
       }

       const newAction = ActionMap[action as keyof typeof ActionMap] || action
       
       if(!['add', 'edit', 'delete'].includes(newAction)) return true

       const index = getPermissionIndex(newAction as DataAction, currentRoute, user.value?.permissions )
       return index > -1
    }

    // 获取指定action(增删改查等)在权限中的索引，>-1则表示有权限
    const getPermissionIndex = (action: DataAction, currentRoute: string, menuList: Array<any> = [] ): number => {
      for(let i = 0; i < menuList.length; i++) {
         const menu = menuList[i]
         // 避免有多余的'/'造成的不匹配
         if(menu.path.split('/').join('') === currentRoute.split('/').join('')) {
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

   return { user, token, login, logout, hasPermission, getUserInfo }
})

export default defineStore('use', () => {
   // const defaultUser = { username: '', nickName: '', userId: 0, permissions: [] }
   // const user = useLocalStorage('user', defaultUser)
   const user = ref()
   const token = useSessionStorage('token', null)
   
   /**
    * 退出当前登录
    */
   const logout = () => {
      token.value = null
      user.value = null
      router.push('/login')
   }

   /**
    * 登录
    */
   const login = async (auth: Record<string, any>) => { 
      const authData = await apis.user.login(auth)

      token.value = authData.token
      // SStorage.storage.token = authData.token
   }

   /**
    * 获取当前登录用户信息
    */
   const getUserInfo = async () => {
      user.value = await apis.user.getLoginUser()
      
      const permissions = await apis.user.getPermissions()
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
         '编辑': 'edit',
         '删除': 'delete'
       }

       const newAction = ActionMap[action as keyof typeof ActionMap] || action
       
       if(!['add', 'edit', 'delete'].includes(newAction)) return true

       const index = getPermissionIndex(newAction as DataAction, currentRoute, user.value?.permissions )
       return index > -1
    }

    // 获取指定action(增删改查等)在权限中的索引，>-1则表示有权限
    const getPermissionIndex = (action: DataAction, currentRoute: string, menuList: Array<any> = [] ): number => {
      for(let i = 0; i < menuList.length; i++) {
         const menu = menuList[i]
         // 避免有多余的'/'造成的不匹配
         if(menu.path.split('/').join('') === currentRoute.split('/').join('')) {
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

   return { user, token, login, logout, hasPermission, getUserInfo }
})