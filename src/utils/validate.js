
export function getType(obj) {
  const _toString = Object.prototype.toString
  return _toString.call(obj).slice(8, -1).toLowerCase()
}

export function isTypeOf(obj, type) {
  return getType(obj) === type
}

export const isURL = (url) => {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

export const isObject = obj => {
  const type = Object.prototype.toString.call(obj)
  return type === '[object Object]'
}

export const validatePassword = (password) => {
  const reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/
  if(!password || reg.test(password)) {
    return Promise.resolve()
  } else {
    return Promise.reject(new Error('密码长度为8-16位数，必须包含数字和大小写字母'))
  }
}

export const comparePassword = (formData) => {
  const { password, confirm_password } = formData
  if (password.trim().length > 0 && confirm_password.trim().length > 0 && password.trim() !== confirm_password.trim()) {
      return Promise.reject(new Error('新密码输入两次不一致'))
  }
  return Promise.resolve()
}