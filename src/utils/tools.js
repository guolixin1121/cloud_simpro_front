import dayjs from 'dayjs'
import { getType } from './validate'
/**
 * 获取 url 中的参数
 * @param { String } name url参数name
 * @param { String } href 链接
 **/
export function getQueryParmas(name = '', href = '') {
  const url = href || window.location.href
  if (name) {
    const reg = new RegExp('(^|\\?|&)' + name + '=([^&]*)(\\s|&|$)', 'i')
    if (reg.test(url)) return RegExp.$2.replace(/\+/g, ' ')
  } else {
    const _params = url.substring(url.indexOf('?') + 1)
    const _arrs = _params.split('&')
    const _result = {}
    for (let i = 0; i < _arrs.length; i++) {
      const pos = _arrs[i].indexOf('=')
      if (pos === -1) {
        continue
      }
      const name = _arrs[i].substring(0, pos)
      const value = decodeURIComponent(_arrs[i].substring(pos + 1))
      _result[name] = value
    }
    return _result
  }
}

/**
 * 判断数据是否为空
 * @param { any } val 需要判断的数据
 * @returns { Boolean } 是否为空
 */
export function isEmpty(val) {
  const valType = getType(val)
  if (['null', 'undefined'].includes(valType)) {
    return true
  }
  if (['number', 'boolean'].includes(valType)) {
    return false
  }
  if (valType === 'string') {
    return val === ''
  }
  if (valType === 'array') {
    return !val.length
  }
  if (valType === 'object') {
    return !Object.keys(val).length
  }
  if (['map', 'set'].includes(valType)) {
    return !val.size
  }
  return false
}

// 防抖(立即执行)
export function debounce(fn, wait = 500) {
  let timerId = null
  let flag = true
  return function () {
    const args = arguments
    clearTimeout(timerId)
    if (flag) {
      fn.apply(this, args)
      flag = false
    }
    timerId = setTimeout(() => {
      flag = true
    }, wait)
  }
}

export function formatDate(date) {
  if(!date) return ''
  return dayjs(date).format('YYYY-MM-DD HH:MM:ss')
}
