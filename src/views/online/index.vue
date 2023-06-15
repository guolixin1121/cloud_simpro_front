<template>
   <div class="main">
    <span class="title">在线仿真</span>
    <ul class="list">
      <li v-for="item in list" :key="item.name" class="item">
        <div class="item-header">{{ item.name }}</div>
        <div class="item-title">
          <span style="font-weight: 600;">{{ item.username }}</span>
          <span :class="'status status--' + item.status">
            <i class="circle"></i>
            {{ item.status == 0 ? '空闲' : '使用中' }}</span>
        </div>
        <div class="item-name">{{ item.name }}</div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
const list = [
  { name: 'SimPro - 1', username: 'test1', status: 0 },
  { name: 'SimPro - 2', username: 'test2', status: 1 },
  { name: 'SimPro - 3', username: 'test3', status: 1 },
  { name: 'SimPro - 4', username: 'test4', status: 0 },
  { name: 'SimPro - 5', username: 'test5', status: 0 },
]
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