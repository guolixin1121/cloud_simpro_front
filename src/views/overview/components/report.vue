<template>
  <div class="white-block">
    <div class="flex justify-between">
      <div>
        <p class="title--noborder">TFS车辆运行报告</p>
        <p class="text-gray">生成时间：<span>2023年12月2日</span></p>
      </div>
      <div class=" text-right text-gray">
        <p>逻辑场景：<span>2023年12月2日</span></p>
        <p>最终泛化场景：<span>2023年12月2日</span></p>
      </div>
    </div>
    <div class="flex justify-between">
      <chart class="item" :option="option"></chart>
      <table class="item table">
        <thead>
          <tr>
            <td>属性</td>
            <td>仿真结果</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>CDD覆盖率</td>
            <td class="pass">通过</td>
          </tr>
          <tr>
            <td>CDD覆盖率</td>
            <td class="unpass">不通过</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps(['option'])
</script>

<style lang="less" scoped>
.item {
  width: 49%;
}
</style>