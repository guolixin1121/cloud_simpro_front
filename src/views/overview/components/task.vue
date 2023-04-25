<template>
  <div class="white-block entry">
     <div class="title-primary">仿真任务</div>
     <a-table
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false"></a-table>
  </div>
</template>

<script lang="ts" setup>
const columns = [
  {
    dataIndex: 'id',
    title: '任务ID'
  },
  {
    dataIndex: 'name',
    title: '任务名称'
  },
  {
    dataIndex: 'status',
    title: '任务状态'
  },
  {
    dataIndex: 'result',
    title: '任务结果'
  }
]
const dataSource = [
  { id: '1', name: 'test', status: 1, result: '通过'},
  { id: '1', name: 'test', status: 1, result: '通过'},
  { id: '1', name: 'test', status: 1, result: '通过'},
  { id: '1', name: 'test', status: 1, result: '通过'}
]
</script>
<style lang="less" scoped>
</style>