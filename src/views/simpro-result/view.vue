<template>
  <div class="top bg-white h-20 flex items-center pl-6">
     <div class="item">总体评价<span class="value"></span></div>
     <div class="item">综合评分<span class="value">85.4</span></div>
     <div class="item">测试场景数量<span class="value">85.4</span></div>
     <div class="item">测试用例个数 <span class="value">85.4</span></div>
     <div class="item">测试次数 <span class="value">85.4</span></div>
  </div>
  <a-tabs v-model:activeKey="activeKey" class="tabs">
    <a-tab-pane key="1" tab="总体测试结果">
      <result v-if="activeKey == '1'"/>
    </a-tab-pane>
    <a-tab-pane key="2" tab="场景列表">
      <!-- 加v-if强制每次切换时刷新组件，重载数据 -->
      <scene v-if="activeKey == '2'"/> 
    </a-tab-pane>
  </a-tabs>
</template>

<script setup lang="ts">
import "ant-design-vue/es/tabs/style/index.css"
import Result from './components/results.vue'
import Scene from './components/scene.vue'
const activeKey = ref('1')
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
  padding: 24px;
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