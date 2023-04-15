<template>
  <div class="main" >
    <list :form-items="formItems" :api="sceneApi.getList" :columns="columns">
      <div class="flex justify-between items-center">
        <span class="title">场景管理</span>
        <div>
          <a-button class="mt-5 mb-3" type="primary" v-if="user.hasPermission('add')" @click=" router.push('/scene/edit/0')">上传场景</a-button>
        </div>
      </div>
    </list>
  </div>
</template>
 
<script setup lang="ts">
// store和apis直接在template使用时无效，为undefined
const user = store.user
const sceneApi = api.scene
const router = useRouter()
const formItems = ref<SearchFormItem[]>([])

const columns = [
  { title: '场景ID', dataIndex: 'id' },
  { title: '场景名称', dataIndex: 'adsName' },
  {
    title: '操作', key: 'actions',
    actions: { // 查看、编辑、删除的响应函数
      '运行': ( data: any ) => console.log('run', data),
      '查看': ( data: any ) => console.log('go to view page', data) ,
      '编辑': ( data: any ) => router.push('/scene/edit/' + data.id) ,
      '删除': (data: any) => console.log('delete data after confirm', data)
    }
  }
]

const getDataFromApi = async () => {
  const tagsData = await api.tags.getList()
  let options = tagsData.results.map((v: any) => ({ label: v['display_name'], value: v.id }))

  formItems.value = [
    { label: '名称', key: 'adsName', type: 'input', placeholder: '请输入场景名称或ID'},
    { label: '场景来源', key: 'adsSource', type: 'select', options: [{ label: '上传', value: '0' }, { label: '泛化', value: '1'}, { label: '外部', value: '2'}], defaultValue: ''},
    { label: '标签', key: 'labels', type: 'select', mode: 'multiple', options, defaultValue: ''},
    { label: '创建时间', key: 'date', type: 'range-picker' }
  ]
}
getDataFromApi()

 </script>
 