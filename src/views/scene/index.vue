<template>
  <div class="main" >
    <list :form-items="formItems" :api="sceneApi.getScenes" :columns="columns">
      <div class="flex justify-between items-center">
        <span class="title">场景管理</span>
        <a-button type="primary" v-if="user.hasPermission('add')" @click=" router.push('/scene/edit/0')">上传场景</a-button>
      </div>
      <template #bodyCell="{column, record}">
          <template v-if="column.dataIndex == 'labels_detail'">
            <span v-for="label in record.labels_detail" :key="label.id">{{ label.display_name }}</span>
          </template>
      </template>
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
  { title: '标签', dataIndex: 'labels_detail' },
  { title: '创建时间', dataIndex: 'createTime' },
  { title: '修改时间', dataIndex: 'updateTime' },
  { title: '所属用户', dataIndex: 'createUser' },
  {
    title: '操作', key: 'actions',
    fixed: 'right',
    actions: { // 查看、编辑、删除的响应函数
      '查看': ( data: any ) => console.log('go to view page', data) ,
      '编辑': ( data: any ) => router.push('/scene/edit/' + data.id) ,
      '删除': handleDelete
    }
  }
]

const getDataFromApi = async () => {
  const tagsData = await api.tags.getTags({ tag_type: 3 })
  let options = tagsData.results.map((v: any) => ({ label: v['display_name'], value: v['name'] }))

  formItems.value = [
    { label: '名称', key: 'adsName', type: 'input', placeholder: '请输入场景名称或ID'},
    { label: '场景来源', key: 'adsSource', type: 'select', options: [{ label: '上传', value: '0' }, { label: '泛化', value: '1'}, { label: '外部', value: '2'}], defaultValue: ''},
    { label: '标签', key: 'labels', type: 'select', mode: 'multiple', options, defaultValue: ''},
    { label: '创建时间', key: 'date', type: 'range-picker' }
  ]
}
getDataFromApi()

async function handleDelete (data: any) {
  await api.scene.deleteScene(data.id)
  message.info('删除成功')
}
 </script>
 