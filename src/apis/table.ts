import { defineApi } from '../hooks/api'
// import http from '../utils/http/index'

// 支持三种方式
export const useTableApi = defineApi({
  getList: '/scene/scene/'
})
