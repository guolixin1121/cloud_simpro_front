<template>
   <div class="main">
    <span class="title">在线仿真</span>
    <a-spin :spinning="loading">
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
            <div class="item-logo"><img style="width: 150px" src="@/assets/images/logo-big.png" /></div>
            <div class="item-name">{{ item.name }}</div>
            <div class="item-button text-center" style="display: none;">
              <a-button type="primary" class="mr-2" @click="enter">进入</a-button>
              <a-button type="primary" @click="quit">释放</a-button>
            </div>
        </li>
      </ul>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
import { openLink } from '@/utils/tools';

const list = [
  { name: 'GuangQi - 1', username: '', status: 0, link: '' },
  { name: 'GuangQi - 2', username: 'test1', status: 1, link: '' },
  { name: 'GuangQi - 3', username: 'test7', status: 1, link: '' },
  { name: 'GuangQi - 4', username: '', status: 0, link: '' },
  { name: 'GuangQi - 5', username: '', status: 0, link: '' },
  { name: 'GuangQi - 6', username: 'test1', status: 1, link: '' },
  { name: 'GuangQi - 6', username: '', status: 0, link: '' },
  { name: 'GuangQi - 7', username: '', status: 0, link: '' },
  { name: 'GuangQi - 8', username: '', status: 0, link: '' },
  { name: 'GuangQi - 9', username: '', status: 0, link: '' },
  { name: 'GuangQi - 10', username: '', status: 0, link: '' },
]

const loading = ref(false)
let taskid = ''
let count = 0
const gotoVnc = async ({status} : any) => {
  if(status == 1) return 
  try {
    count = 0
    loading.value = true
    let res = await api.result.enterVnc({ action: 0 })
    taskid = res.id
    loopVnc(res.id)
  } catch {
    loading.value = false
  }
}

const loopVnc = async (id: String) => {
  if(count >= 16) {
    loading.value = false
    message.info('连接服务器失败')
    return
  }
  try {
    count++
    loading.value = true
    const res = await api.result.checkVnc(id)
    if(res.status == 1 && res.address) {
      loading.value = false
      openLink(res.address)
      // window.open(res.address, '_vnc')
    } else {
      loopVnc(id)
    }
  } catch {
    setTimeout(() => loopVnc(id), 500)
  }
}

const enter = () => {
  taskid && loopVnc(taskid)
}
const quit = async () => {
  if(taskid) {
    await api.result.quitVnc(taskid)
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
      .status--0 {
        color: #FA2F30;
        .circle {
          background-color: #FA2F30;
        }
      }
      .status--1 {
        color: #00B54E;
        .circle {
          background-color: #00B54E;
        }
      }
    }
  }
}
</style>