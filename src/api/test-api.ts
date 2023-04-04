import { defineApi } from '../hooks/api'
import http from '../utils/http/index'

// 支持三种方式
export const useTestApi = defineApi({
  get: 'http://127.0.0.1:8000/items', // 无参数的简单get
  post: { url: 'http://127.0.0.1:8000/items', method: 'POST' }, // 跟axios配置相同
  put: (data) =>   // 自定义请求
    http.request({
      url: 'http://127.0.0.1:8000/items',
      method: 'POST',
      data
    })
})
