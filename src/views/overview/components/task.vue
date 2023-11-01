<template>
  <div class="white-block entry">
    <div class="flex justify-between">
      <div class="title--noborder">仿真结果</div>
      <router-link to="/simpro-result">
        <a style="color: #999ca3; cursor: pointer; display: flex">
          查看更多
          <img src="@/assets/images/icon_more.png" style="width: 16px;"/>
        </a>
      </router-link>
    </div>
    <a-table class="small-table mt-2" :row-class-name="(_record: any, index: number) => (index % 2 === 1 ? 'table-striped' : null)" :loading="loading" :columns="columns" :dataSource="dataSource" :pagination="false">
      <template #emptyText>
        <!-- loading时不显示暂无数据 -->
        <div v-if="loading" style="height: 100px"></div>
        <div v-if="!loading" class="ant-empty ant-empty-normal">
          <div class="ant-empty-image">
            <svg class="ant-empty-img-simple" width="64" height="41" viewBox="0 0 64 41">
              <g transform="translate(0 1)" fill="none" fill-rule="evenodd">
                <ellipse class="ant-empty-img-simple-ellipse" fill="#F5F5F5" cx="32" cy="33" rx="32" ry="7"></ellipse>
                <g class="ant-empty-img-simple-g" fill-rule="nonzero" stroke="#D9D9D9">
                  <path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"></path>
                  <path d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z" fill="#FAFAFA" class="ant-empty-img-simple-path"></path>
                </g>
              </g>
            </svg>
          </div>
          <p class="ant-empty-description">暂无数据</p>
          <!---->
        </div>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex == 'name'">
          <router-link :to="`/simpro-result/view/${record.id}`" class="name mr-2">{{ record.name }}</router-link>
        </template>
        <template v-if="column.dataIndex == 'is_passed'">
          {{ record.is_passed === null ? '-' : record.is_passed ? '通过' : '未通过' }}
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
    dataIndex: 'template_number',
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
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td,
  .ant-table tfoot > tr > th,
  .ant-table tfoot > tr > td {
    padding: 8px 16px;
  }
  .table-striped td {
    background: var(--table-stripe-color);

    &:hover {
      background-color: var(--table-hover-color);
    }
  }
  .ant-table-thead > tr > th {
    background: var(--gray-globel-bg-color);
  }
  .ant-table-cell {
    height: 38px;
  }
}
</style>
<style lang="less" scoped>
@import '@/assets/styles/variable.less';
.name {
  color: inherit;
  &:hover {
    color: @primary-color;
  }
}
</style>
