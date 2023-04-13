<template>
  <list :form-items="formItems" :api="scene.getList" :columns="columns">
    <a-button class="mt-5 mb-3" type="primary" v-if="user.hasPermission('add')">上传场景</a-button>
    <a-button class="mt-5 mb-3 ml-2" type="primary" v-if="user.hasPermission('delete')">批量删除</a-button>
  </list>
</template>
 
<script setup lang="ts">
// store和apis直接在template使用时无效，为undefined
const user = store.user
const { scene, tags } = apis

const formItems = ref<SearchFormItem[]>([
  { label: '名称', key: 'adsName', type: 'input', placeholder: '请输入场景名称或ID'},
  { label: '场景来源', key: 'adsSource', type: 'select', options: [{ label: '全部', value: '' },{ label: '上传', value: '0' }, { label: '泛化', value: '1'}, { label: '外部', value: '2'}], defaultValue: ''},
  { label: '创建时间', key: 'date', type: 'range-picker' }
])

const columns = [
  { title: '场景ID', dataIndex: 'id' },
  { title: '场景名称', dataIndex: 'adsName' },
  {
    title: '操作', key: 'actions',
    actions: { // 查看、编辑、删除的响应函数
      '运行': ( data: any ) => console.log('run', data),
      '查看': ( data: any ) => console.log('go to view page', data) ,
      '编辑': ( data: any ) => console.log('go to edit page', data) ,
      '删除': (data: any) => console.log('delete data after confirm', data)
    }
  }
]

const getDataFromApi = async () => {
  const tagsData = await tags.getList()
  let options = tagsData.results.map(v => ({ label: v.name, value: v.id }))
  options = [{ label: '全部', value: '' }].concat(options)
  formItems.value.push({ label: '标签', key: 'tags', type: 'select', options, defaultValue: ''})
}
getDataFromApi()

 </script>
 