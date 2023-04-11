import axios from 'axios'
import { message } from 'ant-design-vue'
import 'ant-design-vue/es/message/style/css' // 必须引用
import { SStorage } from '@/utils/storage'

import AxiosCanceler from './cancelCancel'

// 处理错误信息

const errorInfo = status => {
  const errorMap = new Map([
    [400, '错误请求'],
    [401, '未授权，请重新登录'],
    [403, '拒绝访问'],
    [404, '请求错误，未找到该资源'],
    [405, '请求方法未允许'],
    [408, '请求超时'],
    [500, '服务器端出错'],
    [501, '网络未实现'],
    [502, '网络错误'],
    [503, '服务不可用'],
    [504, '网络超时'],
    [505, 'http版本不支持该请求']
  ])
  return errorMap.get(status) || `连接错误${status}`
}

class AxiosRequest {
  // axios 实例
  instance = ''
  singleton = ''

  constructor() {
    this.instance = axios.create({
      baseURL: '',
      timeout: 60 * 1000
    })
  }
  // 单例创建 AxiosRequest
  static getSingleton() {
    if (!this.singleton) {
      this.singleton = new AxiosRequest()
    }
    return this.singleton
  }

  // axios 拦截器
  getInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      config => {
        AxiosCanceler.removePending(config)
        AxiosCanceler.addPending(config)
        return config
      },
      error => {
        return Promise.reject(error)
      }
    )
    // 返回拦截器
    this.instance.interceptors.response.use(
      res => {
        AxiosCanceler.removePending(res.config)
        if ([200, 201].includes(res.status)) {
          return res.data
        }
      },
      error => {
        const response = error?.response
        if (response?.status) {
          error.message = errorInfo(response?.status)
        }
        if (error.message.includes('timeout')) {
          error.message = '请求超时，请刷新网页重试'
        }
        return Promise.reject(error.message || '服务器错误，请稍后重试！')
      }
    )
  }
  // post 请求
  request(params) {
    return new Promise((resolve, reject) => {
      const { url, data = {}, method = 'POST', headers = {} } = params || {}
      Object.assign(headers, {
        Authorization: `JWT ${SStorage.storage.token}`,
        'content-type': params.type ? params.type : 'application/json'
      })
      this.instance
        .request({
          url,
          method,
          headers,
          data: ['POST', 'PUT', 'DELETE'].includes(method.toUpperCase()) ? data : null,
          params: method === 'GET' ? data : null
        })
        .then(res => {
          const { code, data = {}, msg, err } = res.data
          debugger
          if (code === 0) {
            resolve(data)
          } else if (code === 100) {
            // token过期跳到登录页
            message.error(typeof msg === 'string' ? msg : err)
            window.location.href = `${import.meta.env.VITE_LOGIN_URL}/`
          } else {
            message.error(typeof msg === 'string' ? msg : err)
            reject(typeof msg === 'string' ? msg : err)
          }
        })
        .catch(error => {
          message.error(error.config.message || '请求错误，请稍后重试')
          reject(error)
        })
    })
  }
}
export default AxiosRequest.getSingleton()
