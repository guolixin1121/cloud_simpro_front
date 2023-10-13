<template>
   <div class="main">
    <span class="title">在线仿真</span>
    <a-spin :spinning="loading" style="min-height: 100px;">
      <ul class="list">
        <li v-for="item in list" class="item" 
          :key="item.name" 
          :style="item.status ? 'cursor: default' : 'cursor: pointer'">
            <div @click="() => enterVnc(item)">
              <div class="item-header">{{ item.name }}</div>
              <div class="item-title">
                <span style="font-weight: 600;">{{ item.username }}</span>
                <span :class="'status status--' + item.status">
                  <i class="circle"></i>
                  {{ item.status == 0 ? '空闲' : '使用中' }}</span>
              </div>
              <div class="item-logo"><img src="@/assets/images/logo-big.png" /></div>
              <div class="item-name">{{ item.name }}</div>
            </div>
            <div class="item-button text-center mt-2" v-if="user.username === item.username">
              <a-button class="mr-2"  @click="quitVnc(item)">释放</a-button>
              <a-button type="primary" @click="enterVnc(item)">进入</a-button>
            </div>
        </li>
      </ul>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
import { gotoVnc } from '@/utils/vnc'

const user = store.user.user
const list = ref(
//   [
//   { name: 'GuangQi - 1', username: '', status: 0 },
//   { name: 'GuangQi - 2', username: 'test1', status: 1 },
//   { name: 'GuangQi - 3', username: 'test7', status: 1 },
//   { name: 'GuangQi - 4', username: '', status: 0 },
//   { name: 'GuangQi - 5', username: '', status: 0 },
//   { name: 'GuangQi - 6', username: 'test1', status: 1 }
// ]
)

const loading = ref(false)
const loadList = async () => {
  try {
    loading.value = true
    const res = await api.vnc.getList()
    loading.value = false
    list.value = res.map((item: any, index: number) => ({
      ...item,
      name: 'SAIMO - ' + (index + 1),
      status: item.status == 'free' ? 0 : 1
    }))
  } catch {
    loading.value = false
  }
}
loadList()

// let newWindow: any
const enterVnc = ({status, address, username} : any) => {
  const hasCurrentUserEntered = list.value.findIndex((item: any) => item.username === user.username) > -1
  if(hasCurrentUserEntered) {
    if(user.username == username) {
      gotoVnc({ action: 0, address }, loading, loadList)
    }
  } else if(status == 0 ) { 
    gotoVnc({ action: 0, address }, loading, loadList)
  }
}

const quitVnc = async ({address} : any) => {
  try {
    loading.value = true
    const res = await api.vnc.exitVnc({address})
    loopVncStatus(res.id)
  } catch {
    loading.value = false
  }
}

const loopVncStatus = async (id: String) => {
  try {
    const res = await api.vnc.checkVnc(id)
    if(res.status == 2) {
      loadList()
    } else {
      setTimeout(() => loopVncStatus(id), 1000)
    }
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
    border-radius: 4px;
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
      margin-top: 30px;
      margin-bottom: 30px;
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