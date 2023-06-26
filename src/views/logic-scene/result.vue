<template>
   <div class="breadcrumb">
    <router-link to="/logic-scene/">逻辑场景管理</router-link>
    <span class="breadcrumb--current">泛化任务</span>
  </div>
  <div class="min-main">
    <div class="flex justify-between items-center">
      <span class="title">逻辑场景泛化结果</span>
    </div>

    <Table ref="table" :api="listApi" :columns="columns">
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
          <a class="text-blue inline-block w-full" @click="() => gotoScene(record)">{{ text }}</a>
        </template> 
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
import {getLogicSceneStatusOption} from '@/utils/dict'
import { SStorage } from '@/utils/storage';
/****** api */
const route = useRoute()
const { id } = route.params
const { name } = route.query
const currentApi = api.logicScene
const listApi = () => currentApi.getResultList({ source: 0, logic_scene_id: id })

/****** 表格区域 */
const columns = [
  { title: '逻辑场景名称', dataIndex: 'name', width: 200, ellipsis: true },
  { title: '场景集名称', dataIndex: 'result_scene_set' },
  { title: '关联场景数', dataIndex: 'scene_count', width: 150, ellipsis: true },
  { title: '开始时间', dataIndex: 'running_time' },
  { title: '结束时间', dataIndex: 'finish_time' },
  { title: '状态', dataIndex: 'status' },
]

const table = ref()
let interval = null as any
onMounted(() => {
  interval = setInterval(() => table.value.refresh({slient: true}), 5000)
  table.value.refresh()
})
onUnmounted(() => clearInterval(interval))

const router = useRouter()
const gotoScene = (record: RObject) => {
  SStorage.set('logic-sceneset', record.result_scene_set)
  router.push('/scene')
}
</script>
