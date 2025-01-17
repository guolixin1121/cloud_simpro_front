<template>
   <div class="breadcrumb">
    <router-link to="/logic-scene/">逻辑场景管理</router-link>
    <span class="breadcrumb--current">泛化任务</span>
  </div>
  <div class="min-main">
    <div class="flex justify-between items-center">
      <span class="title">逻辑场景泛化结果</span>
    </div>

    <a-tabs v-model:activeKey="activeKey" class="tabs">
      <a-tab-pane key="1" tab="场景泛化">
      </a-tab-pane>
      <a-tab-pane key="2" tab="SOTIF泛化">
      </a-tab-pane>
    </a-tabs> 
    <Table ref="table" style="margin-top: 0px;"
      :api="listApi" 
      :scroll="{x: 100, y: 'auto'}"
      :columns="activeKey =='1' ? columns : sotifColumns" >
      <template #bodyCell="{column, record, text}">
        <template v-if="column.dataIndex == 'name'">
          {{ name }}
        </template>
        <template v-if="column.dataIndex == 'status'">
          {{ getLogicSceneStatusOption(record.status) }}
        </template>
        <template v-if="column.dataIndex == 'result_scene_set'">
          {{ record.result_scene_set?.name }}
        </template>
        <template v-if="column.dataIndex == 'scene_count'">
          <a class="text-link inline-block w-full" @click="() => gotoScene(record)">{{ text }}</a>
        </template> 
      </template>
    </Table>
  </div>
  <a-modal v-model:visible="showModal" title="泛化结果分布" :footer="null" width="50%"
    :destroyOnClose="true">
    <div class="modal-content">
      <chart style="height: 500px" :option="chartOptions"> </chart>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import {getLogicSceneStatusOption} from '@/utils/dict'
import { SStorage } from '@/utils/storage';

/****** api */
const route = useRoute()
const activeKey = ref('1')
const { id } = route.params
const { name } = route.query
const currentApi = api.logicScene
const listApi = (args:any) => currentApi.getResultList({ ...args, source: activeKey.value === '1' ? 0 : 1, logic_scene_id: id })

const showModal = ref(false)
const chartOptions = ref({})

/****** 表格区域 */
const columns = [
  { title: '逻辑场景名称', dataIndex: 'name', width: 200, ellipsis: true },
  { title: '场景集名称', dataIndex: 'result_scene_set', width: 150  },
  { title: '关联场景数', dataIndex: 'scene_count', width: 100 },
  { title: '开始时间', dataIndex: 'running_time', width: 150, },
  { title: '结束时间', dataIndex: 'finish_time', width: 150, },
  { title: '状态', dataIndex: 'status', width: 100, },
  { title: '操作', dataIndex: 'actions',
    fixed: 'right',
    width: 120,
    actions: {
      '泛化结果分布': (record:any) => {
        showModal.value = true
        chartOptions.value = []
        const distribution = record.result_params_distribution?.[0]
        if(!distribution) return

        const schema = distribution.header
        const data = distribution.data

        // 只有一个维度的数据时，平行坐标系无法展示数据，该用线性图展示单个点
        if(schema.length == 1) {
          chartOptions.value = {
            legend: {
              show: false
            },
            grid: {
              left: '15%',
              top: 10
            },
            tooltip: {
              show: false,
            },
            xAxis: {
              type: 'category',
              data: [...schema, ''], // 多加一个空的维度，确保实际数据在y轴上显示
              boundaryGap: false,
              axisLine: {
                show: false
              },
              axisLabel: {
                margin: 16,
                width: 150,
                overflow: 'break'
              }
            },
            yAxis: {
              type: 'value',
              splitNumber: 3,
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#DADCE0'
                }
              },
              axisTick: {
                show: true,
                inside: true
              },
              splitLine: {
                show: false,
              },
              axisLabel: {
                inside: true,
                color: '#1e2229'
              }
            },
            series: [
              {
                type: 'line',
                symbol: 'emptyCircle',
                symbolSize: 6,
                name: schema[0],
                data: data[0],
              }
            ]
          }
        } else {
          chartOptions.value = {
            xAxis: { show: false },
            parallelAxis: schema.map(((item: any, index: number) => ({
              dim: index,
              name: item
            }))),
            parallel: {
                bottom: 50,
                top: 10,
                axisExpandable: false,
                axisExpandCenter: 5,
                axisExpandCount: 10,
                axisExpandWidth: 80,
                parallelAxisDefault: {
                  type: 'value',
                  nameLocation: 'start',
                  nameTextStyle: {
                    color: '#1e2229',
                    fontSize: 12
                  },
                  axisLine: {
                    lineStyle: {
                      color: '#DADCE0'
                    }
                  },
                  axisTick: {
                    lineStyle: {
                      color: '#DADCE0'
                    }
                  },
                  splitLine: {
                    show: false
                  },
                  axisLabel: {
                    color: '#1e2229'
                  }
                }
            },
            series: [
              {
                type: 'parallel',
                data,
                lineStyle: { opacity: 0.7 }
              }
            ]
          }
      }
      }
    }
  }
]
const sotifColumns = [
  { title: '场景集名称', dataIndex: 'result_scene_set', width: 250 },
  { title: '关联场景数', dataIndex: 'scene_count', width: 150 },
  { title: '开始时间', dataIndex: 'running_time' },
  { title: '结束时间', dataIndex: 'finish_time' }
]

const refreshTable = (option?: Object) => {
  interval = setInterval(() => table.value?.refresh({slient: true}), 5000)
  table.value.refresh(option)
}

const table = ref()
let interval = null as any
onMounted(refreshTable)
onUnmounted(() => clearInterval(interval))

watch(activeKey, () => {
  // 从第一页加载数据
  refreshTable({page: 1})
  clearInterval(interval)
})

const router = useRouter()
const gotoScene = (record: RObject) => {
  SStorage.clear()
  SStorage.set('logic-sceneset', record.result_scene_set)
  router.push('/scene')
}
</script>

<style lang="less" scoped>
.tabs {
  margin-top: 16px;
}
</style>
