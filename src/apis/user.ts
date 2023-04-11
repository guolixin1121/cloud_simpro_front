import { defineApi } from '../hooks/api'

export const useUserApi = defineApi({
  login: { url: '/api/auth/login/', method: 'post' },
  getLoginUser: '/api/auth/user_info/',
  getPermissions: '/api/menus/',
  getTopMenu: '/api/menus/top/'
})
