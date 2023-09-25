<template>
  <a-spin :spinning="loading" >
    <div class="item-list">
      <div class="item">
        <div class="flex justify-between">
          <p>仿真任务总数</p>
          <img src="@/assets/images/icon_taskdo.png">
        </div>
        <div>
          <span class="mt-4"><span class="value">{{ valueFormater(tasks.total) }}</span>个</span>
        </div>
      </div>
      <div class="item">
        <div class="flex justify-between">
          <p>仿真运行次数</p>
          <img src="@/assets/images/icon_running.png">
        </div>
        <div>
          <span class="mt-4"><span class="value">{{ valueFormater(executions.total) }}</span>次</span>
        </div>
      </div>
      <div class="item">
        <div class="flex justify-between">
          <p>仿真报告</p>
          <img src="@/assets/images/icon_sotifpercent.png">
        </div>
        <div>
          <span class="mt-4"><span class="value">{{ valueFormater(reports.total) }}</span>个</span>
        </div>
      </div>
    <!-- </div>
    <div class="item-list mt-4"> -->
      <div class="item">
        <div class="flex justify-between">
          <p>仿真总时长</p>
          <img src="@/assets/images/icon_sotiftime.png">
        </div>
        <div>
          <span class="mt-4"><span class="value">{{ valueFormater(hours.total) }}</span>小时</span>
        </div>
      </div>
      <div class="item">
        <div class="flex justify-between">
          <p>仿真总里程</p>
          <img src="@/assets/images/icon_all.png">
        </div>
        <div>
          <span class="mt-4"><span class="value">{{ valueFormater(miles.total) }}</span>米</span>
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
const hours = reactive({
  total: 0,
  monthGrowth: 0
})
const miles = reactive({
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
    hours.total = res.time.total
    miles.total = res.miles.total
  } finally {
    loading.value = false
  }
}

const valueFormater = (value: number) => {
  const valueStr = value.toString().split('.')
  const dot = valueStr.length > 1 ? ('.' + valueStr[1]) : ''
  const integer = valueStr[0].split('').reverse().join('')

  // 整数部分加逗号
  const length = Math.floor(integer.length / 4)
  let integerStr = ''
  for(let i = length; i >= 0; i--) {
    integerStr = integer.substring(i * 4, i * 4 + 4 ) + (integerStr.length ? (',' + integerStr) : integerStr)
  }
  integerStr = integerStr.split('').reverse().join('')

  return integerStr + dot
}

fetchData()
</script>

<style lang="less" scoped>
.item-list {
  display: flex;
  // justify-content: space-between;
  .item {
    width: 20%;
    height: 128px;
    border-radius: 4px;
    margin-right: 16px;
    // display: flex;
    background-color: #fff;
    // justify-content: space-between;
    padding: 24px;
    padding-right: 16px;

    p {
      color: #60656E;
      font-weight: 600;
    }

    img {
      width: 48px;
      position: relative;
      top: -10px;
    }

    &:last-child {
      margin-right: 0px;
    }

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
      font-size: 26px;
      font-weight: 600;
      color: #1F1F1F;
      margin-right: 4px;
    }

    span {
      color: #999CA3;
    }
  }
}
</style>