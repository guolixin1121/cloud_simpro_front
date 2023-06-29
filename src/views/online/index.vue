<template>
   <div class="main">
    <span class="title">在线仿真</span>
    <a-spin :spinning="loading" style="min-height: 100px;">
      <ul class="list">
        <li v-for="item in list" class="item" 
          :key="item.name" 
          :style="item.status ? 'cursor: default' : 'cursor: pointer'"
          @click="() => gotoVnc(item)">
            <div class="item-header">{{ item.name }}</div>
            <div class="item-title">
              <span style="font-weight: 600;">{{ item.username }}</span>
              <span :class="'status status--' + item.status">
                <i class="circle"></i>
                {{ item.status == 0 ? '空闲' : '使用中' }}</span>
            </div>
            <div class="item-logo"><img style="width: 140px" src="@/assets/images/logo-big.png" /></div>
            <div class="item-name">{{ item.name }}</div>
            <div class="item-button text-right mt-2 mr-4" v-if="user.username === item.username">
              <a-button class="mr-2"  @click="quitVnc">释放</a-button>
              <a-button type="primary" @click="enterVnc">进入</a-button>
            </div>
        </li>
      </ul>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
const user = store.user.user
const list = ref(
  // [
  // { name: 'GuangQi - 1', username: '', status: 0 },
  // { name: 'GuangQi - 2', username: 'test1', status: 1 },
  // { name: 'GuangQi - 3', username: 'test7', status: 1 },
  // { name: 'GuangQi - 4', username: '', status: 0 },
  // { name: 'GuangQi - 5', username: '', status: 0 },
  // { name: 'GuangQi - 6', username: 'test1', status: 1 },
  // { name: 'GuangQi - 6', username: '', status: 0 },
  // { name: 'GuangQi - 7', username: '', status: 0 },
  // { name: 'GuangQi - 8', username: '', status: 0 },
  // { name: 'GuangQi - 9', username: '', status: 0 },
  // { name: 'GuangQi - 10', username: '', status: 0 },
// ]
)

const loading = ref(false)
const loadList = async () => {
  try {
    loading.value = true
    const res = await api.vnc.getList()
    loading.value = false
    list.value = res.map((item: any, index: number) => ({
      name: 'GuangQi - ' + (index + 1),
      username: item.username,
      status: item.status == 'free' ? 0 : 1
    }))
  } finally {
    loading.value = false
  }
}
loadList()

// let newWindow: any
const gotoVnc = ({status} : any) => {
  if(status == 1) return 
  enterVnc()
}

let count = 0 // 当前连接次数，>8次时断开连接
const enterVnc = async () => {
  try {
    count = 0
    loading.value = true
    let res = await api.vnc.enterVnc({ action: 0 })
    loopVnc(res.id)
  } catch {
    loading.value = false
  }
}

const loopVnc = async (id: String) => {
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
      // newWindow = window.open(res.address, 'vnc')
      loadList()
    } else {
      setTimeout(() => loopVnc(id), 1000)
    }
  } catch {
    loading.value = false
  }
}

const quitVnc = async () => {
  try {
    loading.value = true
    await api.vnc.exitVnc()
    setTimeout(loadList, 1000)
  } catch {
    loading.value = false
  }
}
</script>

<style lang="less" scoped>
.list {
  display: flex;
  flex-wrap: wrap;

  .item {
    width: 344px;
    height: 308px;
    margin-right: 28px;
    margin-top: 18px;
    border: 1px solid #E8EAEC;
    &-header {
      height: 30px;
      line-height: 30px;
      background: #E6E7EB;
      text-align: center;
      color: #60656E
    }
    &-logo {
      text-align: center;
      margin-top: 20px;
      margin-bottom: 20px;
    }
    &-name {
      font-size: 22px;
      font-weight: 600;
      text-align: center;
    }
    &-title {
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      padding: 16px 24px;
      .title {
        font-weight: 600;
        color: #1E2229;
      }
      .circle {
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 3px;
      }
      .status--1 {
        color: #FA2F30;
        .circle {
          background-color: #FA2F30;
        }
      }
      .status--0 {
        color: #00B54E;
        .circle {
          background-color: #00B54E;
        }
      }
    }
  }
}
</style>