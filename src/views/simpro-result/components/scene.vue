<template>
  <a-spin :spinning="loading">
    <Table ref="tableRef" :api="getScenes" :columns="columns" :scroll="{ y: 'auto' }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex == 'actions'">
          <a class="text-link mr-2" v-if="record.obs_report && record.b_file && record.baidu_id" @click="replay(record)">回放</a>
          <a
            class="text-link"
            v-if="record.obs_report && record.baidu_id"
            :href="'/api/simpro/resource/' + record.obs_report"
            target="_blank"
            >查看报告</a
          >
        </template>
        <template v-if="column.dataIndex == 'result'">
          {{ getSimproSceneResults(record.status) }}
        </template>
        <template v-if="column.dataIndex == 'status'">
          <div class="flex items-center">
            <span>{{ record.obs_report ? '正常' : '异常'}}</span>
            <!-- 如果没有报告就表示有异常，如果异常时没有错误信息则是仿真的bug -->
            <a-tooltip placement="topLeft" :title="record.errmsg" v-if="!record.obs_report">
              <!-- 异常时显示错误信息 -->
              <img class="ml-1 cursor-pointer" style="height: 16px;" src="../../../assets/images/tip.png" />
            </a-tooltip>
          </div>
        </template>
      </template>
    </Table>
  </a-spin>

  <VncModal ref="vncModal" title="回放"></VncModal>
</template>

<script setup lang="ts">
import { gotoVnc } from '@/utils/vnc'
import VncModal from '@/components/vnc-modal/index.vue'
import { getSimproSceneResults } from '@/utils/dict'
const vncModal = ref()
const task = useRoute().params.id
const getScenes = (args: any) => api.result.getScenes({ ...args, task })

const columns = [
  { dataIndex: 'scene_id', title: '场景ID', width: 150 },
  { dataIndex: 'adsName', title: '场景名称', ellipsis: true },
  { dataIndex: 'labels_detail', title: '场景标签', apiField: 'display_name' },
  { dataIndex: 'result', title: '结果', width: 100 },
  { dataIndex: 'status', title: '状态', width: 100 },
  {
    dataIndex: 'actions',
    title: '操作',
    fixed: 'right',
    width: 150
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
    loading,
    null,
    () => vncModal.value.show()
  )
}

const tableRef = ref()
onMounted(() => {
  tableRef.value.refresh()
  // vncModal.value.show()
})
</script>

<style lang="less">
.video-player {
  .ant-modal-body {
    padding: 0px;
    background-color: rgba(0, 0, 0, 0.5);
  }
}
</style>
