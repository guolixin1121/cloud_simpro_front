<template>
  <div class="item-list mt-4">
    <div class="item">
      <div class="flex flex-col">
        <p>创建任务总数</p>
        <p><span class="value">4566</span>个</p>
      </div>
      <img src="@/assets/images/icon_todaytaskdo.png">
    </div>
    <div class="item">
      <div class="flex flex-col">
        <span>创建任务总数</span>
        <span><span class="value">4566</span>个</span>
      </div>
      <img src="@/assets/images/icon_todaytaskdo.png">
    </div>
    <div class="item">
      <div class="flex flex-col">
        <span>创建任务总数</span>
        <span><span class="value">4566</span>个</span>
      </div>
      <img src="@/assets/images/icon_todaytaskdo.png">
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="less" scoped>
.item-list {
  display: flex;
  justify-content: space-between;
  .item {
    width: 32.5%;
    height: 120px;
    display: flex;
    background-color: #fff;
    justify-content: space-between;
    padding: 24px;

    .value {
      // @apply flex bg-white p-6
      padding-top: 8px;
      font-size: 32px;
      font-weight: 600;
      color: #1F1F1F;
      margin-right: 4px;
    }
  }
}
</style>