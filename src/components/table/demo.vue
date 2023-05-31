<template>
  <a-tabs>
    <a-tab-pane key="2" tab="说明">
      <div class="bg-white px-8 py-4 markdown">
        <VueComponent />
      </div>
    </a-tab-pane>
    <a-tab-pane key="1" tab="示例">
      <Table :api="tableApi.getList" :query="{}" :columns="columns" @on-select="onSelect">
      </Table>
    </a-tab-pane>
  </a-tabs>
</template>

<script setup lang="ts">
import * as markdown from './readme.md'
import { getSceneSourceName } from '@/utils/dict'

interface Markdown {
  VueComponent: any
}
const VueComponent = (markdown as unknown as Markdown).VueComponent

const tableApi = api.table
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '名称',
    dataIndex: 'adsName'
  },
  
  { title: '场景来源', dataIndex: 'adsSource', formatter: getSceneSourceName, width: 90 },
  { title: '标签', dataIndex: 'labels_detail', label: 'display_name' },
  {
    title: '操作',
    dataIndex: 'actions',
    width: 200,
    actions: {
      '运行': {
        validator: (data: any) => data.adsSource === 0,
        handler: (data: any) => console.log('need disable', data)
      },
      '查看': ( data: any ) => console.log('go to view page', data) ,
      '编辑2': ( data: any ) => console.log('go to edit page', data) ,
      '删除2': (data: any) => console.log('delete data after confirm', data)
    }
  }
]

const onSelect = (keys: any) => console.log('selected data: ', keys)
</script>
