<template>
  <search-form :items="formItems" @on-search="onSearch"></search-form>

  <div class="main">
    <div class="flex justify-between items-center">
      <span class="title">逻辑场景管理</span>
      <a-button type="primary" v-if="user.hasPermission('add')" @click="router.push('/logic-scene/edit/0')">上传逻辑场景</a-button>
    </div>

    <Table ref="table" :api="listApi" :query="query" :columns="columns" :scroll="{ x: 1100, y: 'auto' }">
      <template #bodyCell="{column, record, text}">
        <template v-if="column.dataIndex == 'result_scene_count'">
          <router-link class=" text-blue" :to="'/logic-scene/result/' + record.id +'?name=' +record.name">{{ text }}</router-link>
        </template>
      </template>
    </Table>

    <a-modal v-model:visible="showRunConfirm" 
      :closable="false"
      :footer="null">
      <div>
        <svg-icon style="color: #faad14" icon="alert"></svg-icon>
        <span class="ml-4" style="font-size: 16px">是否要对此逻辑场景进行泛化？</span>
      </div>
      <p class="ml-8 mt-2">泛化结果为{{ runScene.config_result_count }}个具体场景</p>
      <div class=" text-right">
        <a-button @click="closeRunConfirm">否</a-button>
        <a-button @click="runConfirm" type="primary" class="ml-2">是</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
/****** api */
const user = store.user
const currentApi = api.logicScene
const listApi = (args: any) => currentApi.getList({ source: 0, ...args})
const tagsApi = (args: object) => api.tags.getList({ tag_type: 3, ...args })

/****** 搜素区域 */
type Query = Record<string, any>
const query: Query = ref({})
const formItems = ref<SearchFormItem[]>([
  { label: '名称', key: 'name', type: 'input', placeholder: '请输入逻辑场景名称' },
  {
    label: '标签',
    key: 'labels',
    type: 'select',
    mode: 'multiple',
    api: tagsApi,
    fieldNames: { label: 'display_name', value: 'name' },
    defaultValue: ['']
  },
  { label: '创建时间', key: 'create_time', type: 'range-picker' }
])
const onSearch = (data: Query) => (query.value = data)

/****** 表格区域 */
const showRunConfirm = ref(false)
const runScene = ref<any>()
const router = useRouter()
const columns = [
  { title: '场景ID', dataIndex: 'id', width: 90 },
  { title: '逻辑场景名称', dataIndex: 'name', width: 150, ellipsis: true },
  { title: '关联场景数', dataIndex: 'result_scene_count', width: 150, ellipsis: true },
  { title: '标签', dataIndex: 'labels_detail', apiField: 'display_name' },
  { title: '创建时间', dataIndex: 'create_time', width: 180 },
  { title: '所属用户', dataIndex: 'create_user', width: 150, ellipsis: true },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 180,
    actions: {
      运行: (data: any) => {
        showRunConfirm.value = true
        runScene.value = data
      },
      查看: (data: any) => router.push('/logic-scene/view/' + data.id),
      编辑: (data: any) => router.push('/logic-scene/edit/' + data.id),
      删除: async ({ id }: { id: string }) => await currentApi.delete(id)
    }
  }
]

const table = ref()
const closeRunConfirm = () => showRunConfirm.value = false
const runConfirm = async () => {
  await currentApi.run({
    source: 0,
    data: [{
      logic_scene_version_id: runScene.value.logic_scene_version_id
  }]})
  closeRunConfirm()
  setTimeout(() => {
    
    table.value.refresh()
  }, 500);
}
</script>
