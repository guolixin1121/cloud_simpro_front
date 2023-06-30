<template>
  <a-spin :spinning="loading">
    <Table
      ref="tableRef" 
      :api="getScenes"
      :columns="columns"
      :scroll="{ y: 'auto' }">
      <template #bodyCell="{column, record}">
        <template v-if="column.dataIndex == 'actions'">
          <a class="text-blue mr-2"
            v-if="record.b_file && record.baidu_id" 
            @click="replay(record)">回放</a>
          <a class="text-blue"
            v-if="record.obs_report && record.baidu_id"
            :href="'/api/simpro/resource/' + record.obs_report" target="_blank" >查看报告</a>
        </template>
      </template>
    </Table>
  </a-spin>
</template>

<script setup lang="ts">
import { gotoVnc } from '@/utils/vnc';
const task = useRoute().params.id
const getScenes = () => api.result.getScenes({ task })

const columns = [
  { dataIndex: 'scene_id', title: '场景ID', width: 150},
  { dataIndex: 'adsName', title: '场景名称'},
  { dataIndex: 'labels_detail', title: '场景标签'},
  { dataIndex: 'batch', title: '仿真轮次', width: 100},
  {
    dataIndex: 'actions', title: '操作', fixed: 'right', width: 150
  }
]

const loading = ref(false)
const uuid = useRoute().query.u
const replay = (record: any) => {
  gotoVnc(
    { 
      action: 3,
      value: JSON.stringify({ uuid: uuid, baidu_id: record.baidu_id })
    }, 
    loading
  )
}

const tableRef = ref()
onMounted(() => tableRef.value.refresh())
</script>

<style lang="less">
.video-player {
  .ant-modal-body {
    padding: 0px;
    background-color: rgba(0, 0, 0, 0.5);
  }
}
</style>