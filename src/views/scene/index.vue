<template>
  <search-form :items="formItems" @on-search="onSearch"></search-form>
  
  <!-- 有权限的人才可以看到这个button -->
  <a-button class="mt-5 mb-3" type="primary" v-if="user.hasPermission('add')">上传场景</a-button>
  <a-button class="mt-5 mb-3 ml-2" type="primary" v-if="user.hasPermission('delete')">批量删除</a-button>

  <Table :api="api.getList" :query="query" :columns="columns" @on-select="onSelect" />
</template>
 
<script setup lang="ts">
import { ref } from 'vue'
import SearchForm from '@/components/search-form/index.vue'
import Table from '@/components/table/index.vue'
import { useUserStore } from '@/store/user'
import { useSceneApi } from '@/apis/scene'

const user = useUserStore()
const api = useSceneApi()
const query: Record<string, any> = ref(null)

// eslint-disable-next-line no-undef
const formItems: SearchFormItem[] = [
  { label: '名称', key: 'adsName', type: 'input', placeholder: '请输入场景名称或ID'},
  { label: '场景来源', key: 'adsSource', type: 'select', options: [{ label: '全部', value: '' },{ label: '上传', value: '0' }, { label: '泛化', value: '1'}, { label: '外部', value: '2'}], defaultValue: ''},
  { label: '创建时间', key: 'date', type: 'range-picker' }
]
const columns = [
  { title: '场景ID', dataIndex: 'id' },
  { title: '场景名称', dataIndex: 'adsName' },
  {
    title: '操作', key: 'actions',
    actions: { // 查看、编辑、删除的响应函数
      view: ( data: any ) => console.log('go to view page', data) ,
      edit: ( data: any ) => console.log('go to edit page', data) ,
      delete: (data: any) => console.log('delete data after confirm', data)
    }
  }
]

const onSearch = (data: Record<string, any>) => query.value = data
const onSelect = (keys: string[]) => console.log('selected data: ', keys)
 </script>
 