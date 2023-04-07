// 全局配置类接口
import { defineApi } from '../hooks/api'

export const useConfigApi = defineApi({
  getTopMenu: '/api/config/topmenu'
})
