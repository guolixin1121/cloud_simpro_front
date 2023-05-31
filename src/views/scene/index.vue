<template>
  <search-form :items="formItems" @on-search="onSearch"></search-form>

  <div class="main main-bg">
    <left-tree :title="'所属场景集'" @select="onSelect" :api="() => sceneApi.getList({ tree: 1 })" />
    <div class="right-table">
      <div class="flex justify-between items-center">
        <span class="title">场景管理</span>
        <a-button type="primary" v-if="user.hasPermission('add')" @click="router.push('/scene/edit/0')">上传场景</a-button>
      </div>
      <Table :api="currentApi.getList" :query="query" :columns="columns" :scroll="{ x: 1100, y: 'auto' }" />
    </div>
    <!-- <div class="flex justify-between items-center">
      <span class="title">场景管理</span>
      <a-button type="primary" v-if="user.hasPermission('add')" @click="router.push('/scene/edit/0')">上传场景</a-button>
    </div>

    <Table :api="currentApi.getList" :query="query" :columns="columns" :scroll="{ x: 1100, y: 'auto' }" /> -->
  </div>
</template>

<script setup lang="ts">
import { SceneSourceOptions, getSceneSourceName } from '@/utils/dict'
// store、api、useRouter等通过auto import自动导入的，直接在template、自定义函数等使用时无效，为undefined
/****** api */
const user = store.user
const currentApi = api.scene
const sceneApi = api.scenesets
const tagsApi = (args: object) => api.tags.getList({ tag_type: 3, ...args })

/****** 搜素区域 */
type Query = Record<string, any>
const query: Query = ref({})
const formItems = ref<SearchFormItem[]>([
  { label: '名称', key: 'adsName', type: 'input', placeholder: '请输入场景名称' },
  { label: '场景来源', key: 'adsSource', type: 'select', options: SceneSourceOptions, placeholder: '请选择场景来源' },
  {
    label: '标签',
    key: 'labels',
    type: 'select',
    mode: 'multiple',
    api: tagsApi,
    placeholder: '请选择标签',
    fieldNames: { label: 'display_name', value: 'name' }
  }
])
const onSearch = (data: Query) => (query.value = data)

/****** 表格区域 */
const router = useRouter()
const columns = [
  { title: '场景ID', dataIndex: 'id', width: 150 },
  { title: '场景名称', dataIndex: 'adsName', width: 150, ellipsis: true },
  { title: '场景来源', dataIndex: 'adsSource', formatter: getSceneSourceName, width: 90 },
  { title: '标签', dataIndex: 'labels_detail', apiField: 'display_name', ellipsis: true },
  { title: '创建时间', dataIndex: 'createTime', width: 180 },
  { title: '所属用户', dataIndex: 'createUser', width: 150, ellipsis: true },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 150,
    actions: {
      查看: (data: any) => router.push('/scene/view/' + data.id),
      编辑: (data: any) => router.push('/scene/edit/' + data.id),
      删除: async ({ id }: { id: string }) => await currentApi.delete(id)
    }
  }
]

const onSelect = (selectedKeys: any, e: any) => {
  query.value = { ...query.value, scene_set: e.node.id }
}
</script>
