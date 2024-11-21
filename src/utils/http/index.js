import axios from 'axios'
import { message } from 'ant-design-vue'
import 'ant-design-vue/es/message/style/css' // 必须引用
import { getToken, LStorage } from '@/utils/storage'
import AxiosCanceler from './cancelCancel'
// import router from '@/router'
// 处理错误信息
// const errorInfo = status => {
//   const errorMap = new Map([
//     [400, '错误请求'],
//     [401, '未授权，请重新登录'],
//     [403, '拒绝访问'],
//     [404, '请求错误，未找到该资源'],
//     [405, '请求方法未允许'],
//     [408, '请求超时'],
//     [500, '服务器端出错'],
//     [501, '网络未实现'],
//     [502, '网络错误'],
//     [503, '服务不可用'],
//     [504, '网络超时'],
//     [505, 'http版本不支持该请求']
//   ])
//   return errorMap.get(status) || `连接错误${status}`
// }

class AxiosRequest {
  // axios 实例
  instance = ''
  singleton = ''

  constructor() {
    this.instance = axios.create({
      baseURL: '/api/',
      timeout: 60 * 1000
    })
  }
  // 单例创建 AxiosRequest
  static getSingleton() {
    if (!this.singleton) {
      this.singleton = new AxiosRequest()
      this.singleton.getInterceptors()
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
    // this.instance.interceptors.response.use(
    //   res => {
    //     AxiosCanceler.removePending(res.config)
    //     if ([200, 201].includes(res.status)) {
    //       return res
    //     }
    //   },
    //   error => {
    //     const response = error?.response
    //     if (response?.status) {
    //       error.message = errorInfo(response?.status)
    //     }
    //     if (error.message.includes('timeout')) {
    //       error.message = '请求超时，请刷新网页重试'
    //     }
    //     return Promise.reject(error.message || '服务器错误，请稍后重试！')
    //   }
    // )
  }
  // post 请求
  request(params) {
    return new Promise((resolve, reject) => {
      const { url, data = {}, method = 'POST', headers = {} } = params || {}
      const type = headers['content-type']
      Object.assign(headers, {
        Authorization: url.indexOf('/cloud-pro/') > -1 ? getToken() : `JWT ${getToken()}`,
        'content-type': type || 'application/json',
        'X-Project-Id': store.user?.user?.project_id || LStorage.get('X-Project-Id')  || ''
      })
      if(typeof data == 'object') {
        Object.keys(data).forEach(key => {
          if(typeof data[key] == 'string') {
            data[key] = data[key]?.trim()
          }
        })
      }

      let postData = data
      if(type === 'multipart/form-data') {
        const formData = new FormData()
        for(let prop in data) {
          const value = data[prop]
          if(Array.isArray(value)) {
            value.forEach(v => formData.append(prop, v))
          } else {
            formData.append(prop, data[prop])
          }
        }
        postData = formData
      }

      this.instance
        .request({
          ...params,
          url,
          method,
          headers,
          data: ['POST', 'PUT', 'DELETE'].includes(method.toUpperCase()) ? postData : null,
          params: method.toUpperCase() === 'GET' && typeof data == 'object' ? data : null,
        })
        .then(res => {
          if(res.headers['content-type'] !== 'application/json') {
            // 返回的是文件
            resolve({ success: true, file: res.data })
            return
          }
          const { code, data = {}, msg, err } = res.data

          if(res.data instanceof Blob) {
            // 下载文件出错
            const reader = new FileReader()
            reader.addEventListener('loadend', function (e) {
              // 输出字符串 {hello: world}
              console.log(e.target.result, 'blob')
              const err = JSON.parse(e.target.result).err || ''
              message.error(err)
              resolve({success: false})
            })
            reader.readAsText(res.data)
          } else if (code == 0 || code == 200) {
            resolve(data)
          } else if (code == 100) {
            store.user.gotoLogin()
          } else {
            message.error((typeof msg === 'string' ? msg : err) || '服务器发生错误')
            reject(typeof msg === 'string' ? msg : err)
          }
        })
        .catch(error => {
          if(axios.isCancel(error)) return
          if (error.response?.status == 401) {
            store.user.gotoLogin()
          } else {
            message.error(error.message || '请求错误，请稍后重试')
            reject(error)
          }
        })
    })
  }
}
export default AxiosRequest.getSingleton()
