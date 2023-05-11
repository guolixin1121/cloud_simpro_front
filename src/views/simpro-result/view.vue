<template>
  <!-- <div class="top bg-white h-20 flex items-center pl-6">
     <div class="item">总体评价<span class="value"></span></div>
     <div class="item">综合评分<span class="value">85.4</span></div>
     <div class="item">测试场景数量<span class="value">85.4</span></div>
     <div class="item">测试用例个数 <span class="value">85.4</span></div>
     <div class="item">测试次数 <span class="value">85.4</span></div>
  </div> -->
  <!-- <a-tabs v-model:activeKey="activeKey" class="tabs" style="height: calc(100% - 86px)">
    <a-tab-pane key="1" tab="总体测试结果">
      <result v-if="activeKey == '1'"/>
    </a-tab-pane>
    <a-tab-pane key="2" tab="场景列表">
      <scene v-if="activeKey == '2'"/> 
    </a-tab-pane>
  </a-tabs> -->
  <div class="breadcrumb">
    <router-link to="/simpro-result/">仿真结果</router-link>
    <span class="breadcrumb--current">仿真结果详情</span>
  </div>
  <div class="main">
    <div class="flex justify-between items-center">
      <span class="title">场景结果</span>
    </div>
    <scene />
  </div>
</template>

<script setup lang="ts">
// import "ant-design-vue/es/tabs/style/index.css"
// import Result from './components/results.vue'
import Scene from './components/scene.vue'
// const activeKey = ref('1')
</script>

<style lang="less" scoped>
.top {
  font-size: 16px;
  border-radius: 4px;

  .item {
    margin-right: 48px;
  }

  .value {
    color: #1E2229;
    margin-left: 6px;
  }
}
.tabs {
  margin-top: 16px;
  padding: 0 24px;
  background-color: #fff;
  border-radius: 4px;
}
.unpass {
  color: #FA2F30;
}
.pass {
  color: #00B54E;
}
</style>