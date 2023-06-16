<template>
  <a-spin :spinning="loading" >
    <div class="item-list">
      <div class="item">
        <div class="flex flex-col">
          <p>仿真任务总数</p>
          <p class="mt-4"><span class="value">{{ tasks.total }}</span>个</p>
        </div>
        <div class="flex flex-col items-center justify-center">
          <!-- <span class="text-gray flex items-center mb-2">月环比 
            <i class="icon-rise" v-if="tasks.monthGrowth > 0"></i>
            <i class="icon-down" v-if="tasks.monthGrowth < 0"></i>
            {{ tasks.monthGrowth }}%
          </span> -->
          <img src="@/assets/images/icon_taskcreate.png">
        </div>
      </div>
      <div class="item">
        <div class="flex flex-col">
          <span>仿真运行次数</span>
          <span class="mt-4"><span class="value">{{executions.total}}</span>次</span>
        </div>
        <div class="flex flex-col items-center justify-center">
          <!-- <span class="text-gray flex items-center mb-2">月环比 
            <i class="icon-rise" v-if="executions.monthGrowth > 0"></i>
            <i class="icon-down" v-if="executions.monthGrowth < 0"></i>
            {{ executions.monthGrowth }}%
          </span> -->
          <img src="@/assets/images/icon_taskdo.png">
        </div>
      </div>
      <div class="item">
        <div class="flex flex-col">
          <span>仿真报告</span>
          <span class="mt-4"><span class="value">{{reports.total}}</span>个</span>
        </div>
        <div class="flex flex-col items-center justify-center">
          <!-- <span class="text-gray flex items-center  mb-2">月环比 
            <i class="icon-rise" v-if="reports.monthGrowth > 0"></i>
            <i class="icon-down" v-if="reports.monthGrowth < 0"></i>
            {{ reports.monthGrowth }}%
          </span> -->
          <img src="@/assets/images/icon_todaytaskdo.png">
        </div>
      </div>
    </div>
  </a-spin>
</template>

<script setup lang="ts">
const tasks = reactive({
  total: 0,
  monthGrowth: 0
})
const executions = reactive({
  total: 0,
  monthGrowth: 0
})
const reports = reactive({
  total: 0,
  monthGrowth: 0
})

const loading = ref(false)
const fetchData = async () => {
  try {
    loading.value = true
    const res = await api.overview.summary()
    tasks.total = res.tasks.total
    tasks.monthGrowth = res.tasks.monthGrowth
    executions.total = res.executions.total
    executions.monthGrowth = res.executions.monthGrowth
    reports.total = res.reports.total
    reports.monthGrowth = res.reports.monthGrowth
  } finally {
    loading.value = false
  }
}

fetchData()
</script>

<style lang="less" scoped>
.item-list {
  display: flex;
  justify-content: space-between;
  .item {
    width: 32.5%;
    height: 128px;
    display: flex;
    background-color: #fff;
    justify-content: space-between;
    padding: 24px;

    .icon-rise {
      display: inline-block;
      width: 16px;
      height: 17px;
      background-image: url(../../../assets/images/icon_rise.png);
    }
    .icon-down {
      display: inline-block;
      width: 16px;
      height: 17px;
      background-image: url(../../../assets/images/icon_down.png);
    }

    .value {
      // @apply flex bg-white p-6
      font-size: 32px;
      font-weight: 600;
      color: #1F1F1F;
      margin-right: 4px;
    }
  }
}
</style>