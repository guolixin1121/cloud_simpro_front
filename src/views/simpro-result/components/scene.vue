<template>
  <Table
    :loading="loading"
    ref="tableRef" 
    :api="getScenes"
    :columns="columns"
    :scroll="{ y: 'auto' }">
    <template #bodyCell="{column, record}">
        <template v-if="column.dataIndex == 'labels_detail'">
          <a-tooltip :title="record.labels_detail.map((d: any) => d.display_name).join('  ')">
            <span v-for="label in record.labels_detail" :key="label.id" class="text-blue mr-2">
              {{ label.display_name }}
            </span>
          </a-tooltip>
        </template>
        <template v-if="column.dataIndex == 'actions'">
          <a class="text-blue mr-2"
            v-if="record.b_file" 
            @click="replay(record)">回放</a>
          <a class=" text-blue" 
            v-if="record.obs_report"
            :href="'/api/simpro/resource/' + record.obs_report" target="_blank" >查看报告</a>
        </template>
    </template>
  </Table>
</template>

<script setup lang="ts">
// import { openLink } from '@/utils/tools'

const task = useRoute().params.id
const getScenes = () => api.result.getScenes({ task })

const columns = [
  { dataIndex: 'id', title: '场景ID', width: 100},
  { dataIndex: 'adsName', title: '场景名称'},
  { dataIndex: 'labels_detail', title: '场景标签'},
  { dataIndex: 'batch', title: '仿真轮次', width: 100},
  {
    dataIndex: 'actions', title: '操作', fixed: 'right', width: 150
  }
]

const { u } = useRoute().query
const loading = ref(false)
let count = 0
let interval: any
const replay = async (record: RObject) => {
  try {
    count = 0
    loading.value = true
    let res = await api.result.enterVnc({ 
      action: 3,
      value: JSON.stringify({ uuid: u, baidu_id: record.baidu_id })
    })
    loopVnc(res.id)
  } catch {
    loading.value = false
  }
}

const loopVnc = async (id: String) => {
  if(count >= 8) {
    loading.value = false
    message.info('连接服务器失败')
    return
  }
  try {
    count++
    loading.value = true
    const res = await api.result.checkVnc(id)
    if(res.status == 1 && res.address) {
      loading.value = false
      // openLink(res.address)
      const newWindow = window.open(res.address, 'vnc')

      interval = setInterval(async () => {    
        if (newWindow && newWindow.closed) {
          console.log('closed')
          await api.result.quitVnc(id)
          clearInterval(interval); 
        }
      }, 1000);
    } else {
      setTimeout(() => loopVnc(id), 1000)
    }
  } catch {
    loading.value = false
  }
}

const tableRef = ref()
onMounted(() => tableRef.value.refresh())
onUnmounted(() => {
  clearInterval(interval)
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