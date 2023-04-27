<template>
  <div>
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
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
const task = useRoute().params.id
const getScenes = () => api.result.getScenes({ task })

const columns = [
  { dataIndex: 'id', title: '场景ID'},
  { dataIndex: 'adsName', title: '场景名称'},
  { dataIndex: 'labels_detail', title: '场景标签'},
  { dataIndex: 'batch', title: '仿真轮次'},
  { dataIndex: 'run-time', title: '开始时间'},
  { dataIndex: 'funish-time', title: '完成时间'},
  // {
  //   title: '报告', dataIndex: 'actions', fixed: 'right', width: 80,
  //   actions: {
  //     '报告': 
  //   }
  // }
]
</script>