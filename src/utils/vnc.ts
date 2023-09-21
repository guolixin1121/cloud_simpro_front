
let count = 0
export const gotoVnc = async (data: any, loading: any, cb?: Function | null, errorCb?: Function) => {
  try {
    count = 0
    loading.value = true
    const res = await api.vnc.enterVnc(data)
    if(res.status == 3) {
      // 资源已满
      loading.value = false
      errorCb && errorCb()
    } else {
      loopVnc(res.id, loading, cb, errorCb)
    }
  } catch {
    loading.value = false
  }
}
const loopVnc = async (id: String, loading: any, cb?: Function | null, errorCb?: Function) => {
  if(count >= 8) {
    loading.value = false
    message.error('连接服务器失败')
    return
  }
  try {
    count++
    loading.value = true
    const res = await api.vnc.checkVnc(id)
    if(res.status == 3) {
      // 资源已满
      loading.value = false
      errorCb && errorCb()
    } else if(res.status == 1 && res.address) {
      // 服务器连接成功
      loading.value = false
      window.open(res.address, 'vnc')
      cb && cb()
    } else {
      setTimeout(() => loopVnc(id, loading, cb, errorCb), 1000)
    }
  } catch {
    loading.value = false
  }
}
