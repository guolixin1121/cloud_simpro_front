<template>
  <div class="overview">
    <div class="flex justify-between" style="height: 286px">
      <entry style="width: 432px;"></entry>
      <task style="width: calc(100% - 432px); margin-left: 16px;"></task>
    </div>

    <section>
      <span class="title-primary">任务统计</span>
      <overview />
      <div class="flex justify-between">
        <chart class="chart white-block" title="今日仿真任务执行情况" :option="barOptions"></chart>
        <chart class="chart white-block" title="仿真任务耗时" :option="lineOptions"></chart>
      </div>
    </section>

    <section>
      <span class="title-primary">场景概况</span>
      <overview />
      <chart class=" white-block" title="场景数量新增情况" :option="barOptions"></chart>
    </section>

    <section>
      <span class="title-primary mb-4">SOTIF</span>
      <div class="flex justify-between">
        <report class="chart" :option="radarOptions"></report> 
        <report class="chart" :option="radarOptions"></report>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import Entry from './components/entry.vue'
import Task from './components/task.vue'
import Overview from './components/overview.vue'
import Report from './components/report.vue'

const barOptions =  {
  xAxis: {
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  series: [
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'bar',
       name: '昨日',
    },
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'bar',
       name: '今日',
    }
  ]
}
const lineOptions = {
  xAxis: {
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  series: [
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
      name: '今日',
    }
  ]
}
const radarOptions =  {
  series: [{
    type: 'radar',
    data: [
      { name: '2020', value: [ 90, 25, 0.5, 200, 2] }
    ]
  }],
  radar: {
    indicator: [
      { name: '指标1', max: 100, unit: '个'},
      { name: '指标2', max: 50, unit: '米'},
      { name: '指标3', max: 1, unit: '元'},
      { name: '指标4', max: 200, unit: '个'},
      { name: '指标5', max: 10, unit: '个'},
    ]
  }
}
</script>

<style lang="less">
.overview {
  height: 100%;
  overflow: auto;

  .chart {
    width: 49.3%;
    margin-right: 16px;
  }
}
</style>