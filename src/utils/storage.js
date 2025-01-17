const TOKEN_KEY = 'token'
export const getToken = () => {
  return localStorage?.getItem(TOKEN_KEY) || ''
}

export const setToken = token => {
  return localStorage?.setItem(TOKEN_KEY, token)
}

export const removeToken = () => {
  return localStorage?.removeItem(TOKEN_KEY)
}

const StorageType = {
  l: 'localStorage',
  s: 'sessionStorage'
}

// 自定义 storage
class MyStorage {
  constructor(type) {
    this.storage = type === StorageType.l ? window.localStorage : window.sessionStorage
  }

  set(key, value) {
    const data = typeof value === 'string' ? value : JSON.stringify(value)
    this.storage.setItem(key, data)
  }

  get(key) {
    const value = this.storage.getItem(key)
    
    if (value) {
      return value.indexOf('{') > -1 ? JSON.parse(value) : value
    }
    return null
  }

  getWithPrefix(prefix) {
    const keys = Object.keys(sessionStorage)
    return keys.filter(key => key.startsWith(prefix))
  }

  remove(key) {
    this.storage.removeItem(key)
  }

  clear() {
    this.storage.clear()
  }
}

const LStorage = new MyStorage(StorageType.l)
const SStorage = new MyStorage(StorageType.s)
export { LStorage, SStorage }
