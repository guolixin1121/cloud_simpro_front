<template>
  <Table :api="tableApi.getList" :query="query" :columns="columns" @on-select="onSelect">
  </Table>
</template>

<script setup lang="ts">
import Table from '@/components/table/index.vue'
import { useTableApi } from '@/apis/table';

const tableApi = useTableApi()
const query = ref<{}>

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '名称',
    dataIndex: 'adsName',
    key: 'adsName',
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
