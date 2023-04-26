<template>
  <Table :api="tableApi.getList" :query="{}" :columns="columns" @on-select="onSelect">
  </Table>
</template>

<script setup lang="ts">
const tableApi = api.table

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
      '运行': {
        validate: (data: any) => data.status === '运行中',
        handler: (data: any) => console.log('need disable', data)
      },
      '查看': ( data: any ) => console.log('go to view page', data) ,
      '编辑': ( data: any ) => console.log('go to edit page', data) ,
      '删除': (data: any) => console.log('delete data after confirm', data)
    }
  }
]

const onSelect = (keys: any) => console.log('selected data: ', keys)
</script>
