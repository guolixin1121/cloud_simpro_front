<template>
  <Table :api="getScenes"
    :columns="columns">
    <template #bodyCell="{column, record}">
        <template v-if="column.dataIndex == 'labels_detail'">
          <a-tooltip :title="record.labels_detail.map((d: any) => d.display_name).join('  ')">
            <span v-for="label in record.labels_detail" :key="label.id" class="text-blue mr-2">
              {{ label.display_name }}
            </span>
          </a-tooltip>
        </template>
        <template v-if="column.dataIndex == 'actions'">
          <a class="text-blue mr-2" @click="showVideo(record)">回放</a>
          <a class=" text-blue" 
            :href="'/api/simpro/resource/' + record.obs_report" target="_blank" >查看报告</a>
        </template>
    </template>
  </Table>
  <a-modal class="video-player" 
    style="width: 60%; height: 60%;"
    :visible="isModal"
    :footer="null"
    @cancel="closeVideo" >
    <video style="height: 100%; width: 100%;" autoplay loop>
      <source :src="videoSrc" type="video/mp4">
    </video>
  </a-modal>
</template>

<script setup lang="ts">
const task = useRoute().params.id
const getScenes = () => api.result.getScenes({ task })

const columns = [
  { dataIndex: 'id', title: '场景ID'},
  { dataIndex: 'adsName', title: '场景名称'},
  { dataIndex: 'labels_detail', title: '场景标签'},
  { dataIndex: 'batch', title: '仿真轮次', width: 100},
  { dataIndex: 'run-time', title: '开始时间'},
  { dataIndex: 'funish-time', title: '完成时间'},
  {
    dataIndex: 'actions', title: '操作', fixed: 'right', width: 150
  }
]


const isModal = ref(false)
const videoSrc = ref('')
const showVideo = (record: RObject) => {
  isModal.value = true
  videoSrc.value = '/api/simpro/resource/' + record.obs_video
  // videoSrc.value = 'http://10.31.1.171/data1/fangzhenshare/cloud_simpro_server/files/video_downloads/115693_61835_1.mp4'
}
const closeVideo = () => {
  isModal.value = false
}
</script>

<style lang="less">
.video-player {
  .ant-modal-body {
    padding: 0px;
    background-color: rgba(0, 0, 0, 0.5);
  }
}
</style>