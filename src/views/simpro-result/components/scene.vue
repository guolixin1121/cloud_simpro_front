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
          <a class="text-blue mr-2" @click="replay(record)">回放</a>
          <a class=" text-blue" 
            :href="'/api/simpro/resource/' + record.obs_report" target="_blank" >查看报告</a>
        </template>
    </template>
  </Table>
  <!-- <a-modal class="video-player" 
    style="width: 60%; height: 60%;"
    :visible="isModal"
    :footer="null"
    @cancel="closeVideo" >
    <video style="height: 100%; width: 100%;" autoplay loop>
      <source :src="videoSrc" type="video/mp4">
    </video>
  </a-modal> -->
</template>

<script setup lang="ts">

const task = useRoute().params.id
const getScenes = () => api.result.getScenes({ task })

const columns = [
  { dataIndex: 'id', title: '场景ID', width: 100},
  { dataIndex: 'adsName', title: '场景名称'},
  { dataIndex: 'labels_detail', title: '场景标签'},
  { dataIndex: 'batch', title: '仿真轮次', width: 100},
  // { dataIndex: 'run-time', title: '开始时间', width: 150},
  // { dataIndex: 'funish-time', title: '完成时间', width: 150},
  {
    dataIndex: 'actions', title: '操作', fixed: 'right', width: 150
  }
]

// const isModal = ref(false)
// const videoSrc = ref('')
// const showVideo = (record: RObject) => {
//   isModal.value = true
//   videoSrc.value = '/api/simpro/resource/' + record.obs_video
//   // videoSrc.value = 'http://10.31.1.171/data1/fangzhenshare/cloud_simpro_server/files/video_downloads/115693_61835_1.mp4'
// }
// const closeVideo = () => {
//   isModal.value = false
// }

// const { u } = useRoute().query
const loading = ref(false)
let interval: any = -1
let closeInterval: any = -1
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const replay = async (record: RObject) => {
  try {
    loading.value = true
    let res = await api.result.enterVnc({ 
      action: 3,
      value: JSON.stringify({ uuid: 'b199e9cb-ee14-4804-a951-50475bfe6109', baidu_id: '1603685404' })
      // value: JSON.stringify({ uuid: u, baidu_id: record.baidu_id })
    })
    const interval = setInterval(async () => {
      try {
        loading.value = true
        res = await api.result.checkVnc(res.id)
        if(res.status == 1 && res.address) {
          const newWindow = window.open(res.address)
          clearInterval(interval)

          closeInterval = setInterval(async () => {    
            if (newWindow && newWindow.closed) {
              await api.result.quitVnc(res.id)
              console.log('我被关闭了')
              clearInterval(closeInterval); 
            }
          }, 500);
        }
      } finally {
        loading.value = false
        clearInterval(interval)
      }
    }, 1000) 
  } catch {
    loading.value = false
  }
}

const tableRef = ref()
onMounted(() => tableRef.value.refresh())
onUnmounted(() => {
  clearInterval(interval)
  clearInterval(closeInterval)
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