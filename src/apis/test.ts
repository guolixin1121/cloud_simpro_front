import http from '@/utils/http/index'
import { TEST } from '@/utils/http/api-group'

export const getTest = (data = {}, method = 'POST') => {
  return http.request({
    url: TEST,
    method,
    data
  })
}
