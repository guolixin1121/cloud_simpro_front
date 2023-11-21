<template>
  <div class="overview">
    <overview />

    <div class="flex justify-between" style="height: 286px; margin-top: 16px">
      <entry style="width: 432px"></entry>
      <task style="width: calc(100% - 432px); margin-left: 16px"></task>
    </div>

    <div class="flex justify-between" style="height: 309px;">
      <chart :loading="tasksLoading" class="chart white-block" title="近7日仿真任务创建情况" :option="tasksOptions"> </chart>
      <chart :loading="scenesLoading" class="chart white-block" title="近7日场景数量新增情况" :option="scenesOptions"> </chart>
    </div>

    <div class="flex justify-between" style="height: 309px;">
      <chart class="white-block" style="width: 33%" title="近7日仿真任务统计" :option="statusOptions"> </chart>
      <chart :loading="executionsLoading" class="white-block" style="width: 67%; margin-left: 16px" title="近7日仿真任务执行情况" :option="executionsOptions"> </chart>
    </div>

    <div class="flex justify-between last-row" style="height: 309px;">
      <chart :loading="runningtimeLoading" class="chart white-block" title="近7日仿真任务耗时" :option="runningtimeOptions"> </chart>
      <chart :loading="reportsLoading" class="chart white-block" title="近7日仿真报告" :option="reportsOptions"> </chart>
    </div>
  </div>
</template>

<script setup lang="ts">
import Entry from './components/entry.vue'
import Task from './components/task.vue'
import Overview from './components/overview.vue'

const getXData = (source: []) => source.map((item: any) => item.time)
const getLineYData = (source: []) => source.map((item: any) => item.value)
const getBarYData = (source: []) => source.map((item: any) => (item.value === 0 ? null : item.value))

const executionsLoading = ref(false)
const executionsOptions = ref({})
const fetchExecutions = async () => {
  executionsLoading.value = true
  const res = await api.overview.executions()
  const xData = getXData(res.failed)
  runningtimeLoading.value = false
  executionsOptions.value = {
    xAxis: {
      data: xData
    },
    series: [
      {
        data: getBarYData(res.passed),
        type: 'bar',
        name: '通过'
      },
      {
        data: getBarYData(res.failed),
        type: 'bar',
        name: '未通过'
      }
    ]
  }
}
fetchExecutions()

const runningtimeLoading = ref(false)
const runningtimeOptions = ref({})
const fetchRunningtime = async () => {
  runningtimeLoading.value = true
  const res = await api.overview.runningtime()
  const xData = getXData(res)
  runningtimeLoading.value = false
  runningtimeOptions.value = {
    xAxis: {
      data: xData
    },
    series: [
      {
        data: res.map((item: any) => item.value),
        type: 'line',
        name: '耗时（小时）'
      }
    ]
  }
}
fetchRunningtime()

const tasksLoading = ref(false)
const tasksOptions = ref({})
const fetchTasks = async () => {
  tasksLoading.value = true
  const res = await api.overview.tasks({ interval: 'day' })
  const xData = getXData(res)
  tasksLoading.value = false
  tasksOptions.value = {
    xAxis: {
      data: xData
    },
    series: [
      {
        data: getBarYData(res),
        type: 'bar',
        name: '任务数（个）'
      }
    ]
  }
}
fetchTasks()

const reportsLoading = ref(false)
const reportsOptions = ref({})
const fetchReports = async () => {
  reportsLoading.value = true
  const res = await api.overview.reports()
  const xData = getXData(res)
  reportsLoading.value = false
  reportsOptions.value = {
    xAxis: {
      data: xData
    },
    series: [
      {
        data: getBarYData(res),
        type: 'bar',
        name: '仿真报告数量（个）'
      }
    ]
  }
}
fetchReports()

const statusLoading = ref(false)
const statusOptions = ref({})
const fetchStatus = async () => {
  statusLoading.value = true
  const res = await api.overview.status()
  statusLoading.value = false
  statusOptions.value = {
    color: ['#FFC371', '#32D0BF', '#4080FF', '#FD706D', '#DADCE0'],
    xAxis: {
      show: false
    },
    series: [
      {
        name: '运行状态',
        type: 'pie',
        label: {
          formatter: (params: any) => params.value
        },
        data: res
      }
    ]
  }
}
fetchStatus()

const scenesLoading = ref(false)
const scenesOptions = ref({})
const fetchScenes = async () => {
  scenesLoading.value = true
  const res = await api.overview.scenes()
  const xData = getXData(res)
  scenesLoading.value = false
  scenesOptions.value = {
    xAxis: {
      data: xData
    },
    series: [
      {
        data: getLineYData(res),
        type: 'line',
        name: '场景数量（个）'
      }
    ]
  }
}
fetchScenes()
</script>

<style lang="less">
.overview {
  height: 100%;
  overflow: auto;
  padding: 16px;

  .chart {
    width: calc(50% - 8px);

    &:first-child {
      margin-right: 16px;
    }
  }
  .last-row {
    .white-block {
      margin-bottom: 0px;
    }
  }
}
.ant-layout-content:has(.overview) {
  padding: 0px !important;
}
</style>
