<template>
  <a-spin :spinning="loading">
    <Table :data-source="dataSource || []" :columns="columns" @on-select="onSelect">
    </Table>
  </a-spin>
</template>

<script setup lang="ts">
import { useRequest} from 'vue-request'
import Table from '@/components/table/index.vue'
import { useTableApi } from '@/apis/table';

const tableApi = useTableApi()
const { data: dataSource, loading } = useRequest(tableApi.getList)

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: '操作',
    key: 'actions',
    actions: {
      // 查看、编辑、删除的响应函数
      view: ( data: any ) => console.log('go to view page', data) ,
      edit: ( data: any ) => console.log('go to edit page', data) ,
      delete: (data: any) => console.log('delete data after confirm', data)
    }
  }
]

const onSelect = (keys: any) => console.log('selected data: ', keys)
</script>
