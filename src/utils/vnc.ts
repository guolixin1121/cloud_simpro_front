
let count = 0
export const gotoVnc = async (data: any, loading: any) => {
  try {
    count = 0
    loading.value = true
    const res = await api.vnc.enterVnc(data)
    loopVnc(res.id, loading)
  } catch {
    loading.value = false
  }
}
const loopVnc = async (id: String, loading: any) => {
  if(count >= 8) {
    loading.value = false
    message.info('连接服务器失败')
    return
  }
  try {
    count++
    loading.value = true
    const res = await api.vnc.checkVnc(id)
    if(res.status == 1 && res.address) {
      loading.value = false
      window.open(res.address, 'vnc')
    } else {
      setTimeout(() => loopVnc(id, loading), 1000)
    }
  } catch {
    loading.value = false
  }
}
