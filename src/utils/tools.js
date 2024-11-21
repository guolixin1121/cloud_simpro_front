import dayjs from 'dayjs'
import router from '@/router'
import { getType } from './validate'
import { SStorage } from './storage'
import { useUserStore } from '@/store/user'

/**
 * 获取 url 中的参数
 * @param { String } name url参数name
 * @param { String } href 链接
 **/
export function getQueryParmas(name = '', href = '') {
  const url = href || window.location.search
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
    return val.trim() === ''
  }
  if (valType === 'array') {
    return !val.join('').length
  }
  if (valType === 'object') {
    return !Object.keys(val).length
  }
  if (['map', 'set'].includes(valType)) {
    return !val.size
  }
  return false
}

// 是否为日期类属性
export function isDateProp(prop) {
  if (!prop) return false
  const propLowercase = prop.toLocaleLowerCase()
  return propLowercase.indexOf('date') > -1 || propLowercase.indexOf('time') > -1
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

export function deepClone(source) {
  if (typeof source !== 'object') return source

  const result = Array.isArray(source) ? [] : []
  for (let prop in source) {
    result[prop] = deepClone(source[prop])
  }
  return result
}

export function formatDate(date, formatter) {
  if (!date) return ''
  return dayjs(date).format(formatter || 'YYYY-MM-DD HH:mm:ss')
}

// 判断字符串中中文个数
export function getWordLength(str) {
  // eslint-disable-next-line no-control-regex
  return str.replace(/[^\x00-\xff]/g,"**").length
}

export const checkEmpty = (value) => {
  if (value && value.trim().length == 0) {
    return Promise.reject(`必填项不能为空`)
  }
  return Promise.resolve() 
}

export const checkChName = (str, maxLength = 32, minLength = 2) => {
  if (!str) return Promise.resolve()

  const length = getWordLength(str)
  if(str.trim().length == 0) {
    return Promise.reject(`名称不能为空`)
  }

  if (length < minLength || length > maxLength) {
    return Promise.reject(`名称长度为${minLength}到${maxLength}位`)
  }
  return Promise.resolve()
}

export const openLink = url => {
  let tempALink = document.createElement('a')
  tempALink.setAttribute('target', '_blank')
  tempALink.setAttribute('href', url)
  document.body.appendChild(tempALink)
  tempALink.click()
  document.body.removeChild(tempALink)
}

// 自定义节流操作
export const preventReClick = {
  mounted(el, binding) {
    el.addEventListener('click', () => {
      if (!el.disabled) {
        el.disabled = true
        setTimeout(() => {
          el.disabled = false
        }, binding.value || 2000)
      }
    })
  }
}

/*
* 跳转到指定页面,跳转前清除目标页面的缓存
* path：目的路径，如果是到子页面，只需指定相对路径
* isChild：boolean path是否为当前页面的子页面
*/
export const gotoSubPage = (targetPath, isChild = true) => {
  let currentpath = router.currentRoute.value.path
  currentpath = currentpath.endsWith('/') ? currentpath.substring(0, currentpath.length - 1) : currentpath
 
  const targetFullPath = isChild ?  (currentpath + targetPath) : targetPath
  const targetKeys = SStorage.getWithPrefix(targetFullPath.split('?')[0])
  targetKeys.forEach((key) => SStorage.remove(key))

  // open subpage
  // path = path.startsWith('/') ? path.substring(1) : path
  router.push(targetFullPath)
}

export const goback = (step = -1) => router.go(step)

export const download = (fileContent, filename) => {
  let blob = new Blob([fileContent], { type: 'application/zip'}) 
  let tempALink = document.createElement('a')
  tempALink.href = URL.createObjectURL(blob)
  tempALink.download = decodeURIComponent(filename)
  document.body.appendChild(tempALink)
  tempALink.click()
  document.body.removeChild(tempALink)
}

// 根据操作的个数计算需要的总宽度
export const getActionColumnWidth = (actions) => {
   let width = 32 + 28 // 查看按钮及列的padding
   const user = useUserStore()
   actions.forEach(action => {
    user.hasPermission(action) && (width += action.length * 14 + 8)
    // 每个字14px宽，8为margin距离
   })
   return width
}