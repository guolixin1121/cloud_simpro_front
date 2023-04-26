<template>
  <div class="mt-4 h-80">
    <div class="name mb-3">{{ title }}</div>
    <div
      :style="title ? 'height:90%' : 'height:100%'"
      style="width: 100%;"
      ref="chartElement"
    ></div>
  </div>
</template>
<script lang="ts" setup>
import * as echarts from 'echarts'
import factory from './factory'

const props = defineProps(['option', 'title'])
const chartElement = ref()
let chartInstance: echarts.ECharts | null = null

onMounted(render)

watch(() => props.option, render)

function render () {
  chartInstance?.clear()
  chartInstance = echarts.init(chartElement.value)
  const option = produceOption(props.option)
  chartInstance.setOption(option, true)
  window.addEventListener('resize', () => chartInstance?.resize)
}

const produceOption = (option: any) => {
  if(typeof option !== 'object') return 

  // 判断chart类型去加载相应的默认配置，判断顺序为：
  // 1. 判断是否为radar
  // 2. 判断series的第一组数据的type
  // 3. 显示指定
  // 4. 默认配置
  const type = option.radar ? 'radar' : (option.series?.[0].type || option.type || 'option')
  const fact = (factory as Record<string, any>)[type] || factory['option']
  return fact(option)
}

onUnmounted(() => window.removeEventListener('resize', () => chartInstance?.resize))
</script>