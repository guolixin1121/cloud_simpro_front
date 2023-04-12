import { defineApi } from '../hooks/api'

export const useUserApi = defineApi({
  login: { url: '/auth/login/', method: 'post' },
  getLoginUser: '/auth/user_info/',
  getPermissions: '/menus/',
  getTopMenu: 'menus/top/'
})
