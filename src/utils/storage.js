const TOKEN_KEY = 'saimo_sotif_data_token'
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
    const data = JSON.stringify(value)
    this.storage.setItem(key, data)
  }

  get(key) {
    const value = this.storage.getItem(key)
    if (value) {
      return JSON.parse(value)
    }
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
