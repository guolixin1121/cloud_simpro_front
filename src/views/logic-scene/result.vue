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
          {{ record.result_scene_set.name }}
        </template>
         <template v-if="column.dataIndex == 'scene_count'">
          <router-link class=" text-blue" 
            :to="`/scene/?name=${record.result_scene_set.name}&id=${record.result_scene_set.baidu_id}`">
            {{ text }}</router-link>
        </template>
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
import {getLogicSceneStatusOption} from '@/utils/dict'
/****** api */
const { id } = useRoute().params
const { name } = useRoute().query
const currentApi = api.logicScene
const listApi = () => currentApi.getResultList({ source: 0, logic_scene_id: id })

/****** 表格区域 */
const router = useRouter()
const columns = [
  { title: '逻辑场景名称', dataIndex: 'name', width: 150, ellipsis: true },
  { title: '场景集名称', dataIndex: 'result_scene_set' },
  { title: '关联场景数', dataIndex: 'scene_count', width: 150, ellipsis: true },
  { title: '开始时间', dataIndex: 'running_time' },
  { title: '状态', dataIndex: 'status' },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 100,
    actions: {
      查看: ((data: any) => router.push(`/scene/?name=${data.result_scene_set.name}&id=${data.result_scene_set.baidu_id}`))
    }
  }
]

const table = ref()
onMounted(() => table.value.refresh())
</script>
