<template>
  <div class="white-block entry">
    <div class="flex justify-between">
      <div class="title-primary">仿真结果</div>
      <router-link to="/simpro-result">
        <a style="color: #999ca3; cursor: pointer; display: flex;">
          查看更多
          <img src="@/assets/images/icon_arrow.png" />
        </a>
      </router-link>
    </div>
    <a-table
      class="small-table mt-2"
      :row-class-name="(_record: any, index: number) => (index % 2 === 1 ? 'table-striped' : null)"
      :loading="loading"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex == 'name'">
          <router-link :to="`/simpro-result/view/${record.id}`" class="name mr-2">{{ record.name }}</router-link>
        </template>
        <template v-if="column.dataIndex == 'is_passed'">
          {{ record.is_passed === null ? '-' : record.is_passed ? '通过' : '不通过' }}
        </template>
        <template v-if="column.dataIndex == 'status'">
          <span :class="'task-status task-status--' + record.status">{{ getResultStatus(record.status) }}</span>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts" setup>
import { getResultStatus } from '@/utils/dict'
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
    dataIndex: 'is_passed',
    title: '任务结果'
  }
]
const dataSource = ref([])
const loading = ref(false)
const fetchData = async () => {
  loading.value = true
  const res = await api.result.getList()
  loading.value = false
  dataSource.value = res.results.slice(0, 4)
}
fetchData()
</script>
<style lang="less">
.small-table {
  .ant-table-thead > tr > th, .ant-table-tbody > tr > td, .ant-table tfoot > tr > th, .ant-table tfoot > tr > td {
    padding: 8px 16px;
  }
  .table-striped td {
    background: #f7f8fa;
  }
  .ant-table-thead > tr > th {
    background: #F2F3F5
  }
}
</style>
<style lang="less" scoped>
.name:hover {
  color: #4080FF;
}
</style>