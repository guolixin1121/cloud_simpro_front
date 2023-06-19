<template>
  <div class="main-tree">
    <tree
      ref="treeRef"
      :title="'场景集'"
      :api="sceneApi.getList"
      :query="{...selectedSceneset, version: 2 }"
      :lazy="true"
      :filedNames="{label: 'groupName', value: 'id'}"
      @select="onSelect"
      @btn-click="onClick"
    />
    <div class="main-right">
      <a-spin :spinning="loading">
        <div class="right-title">
          <div class="title-item"><span class="label">场景集名称</span>{{ catalog.sceneCatalog.name }}</div>
          <div class="title-item"><span class="label">路径</span>{{ catalog.sceneCatalog.path }}</div>
          <div class="title-item">
            <span class="label">标签</span>
            <ul style="flex: 1">
              <li class="inline-block mr-4" v-for="item in catalog.sceneCatalog.labels_detail" :key="item.name">
                {{ item.display_name  }}
              </li>
            </ul>
          </div>
        </div>
      </a-spin>

      <search-form :items="formItems" :manual="true" @search="onSearch"></search-form>
        
      <div class="main">
        <div class="flex justify-between items-center">
          <span class="title">场景管理</span>
          <a-button type="primary" v-if="user.hasPermission('add')" @click="router.push('/scene/edit/0')">上传场景</a-button>
        </div>
        <Table :api="currentApi.getList" :query="query" :columns="columns" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SceneSourceOptions, getSceneSourceName } from '@/utils/dict'
import { SStorage } from '@/utils/storage';

const currentApi = api.scene
const sceneApi = api.scenesets
const user = store.user
const selectedSceneset = SStorage.get('logic-sceneset')
/****** 搜素区域 */
const formItems = ref<SearchFormItem[]>([
  { label: '名称', key: 'adsName', type: 'input', placeholder: '请输入场景名称' },
  { label: '场景来源', key: 'adsSource', type: 'select', options: SceneSourceOptions, placeholder: '请选择场景来源', defaultValue: '' },
  {
    label: '标签',
    key: 'labels',
    type: 'select',
    mode: 'multiple',
    api: api.tags.getList,
    query: { tag_type: 3 },
    placeholder: '请选择标签，最多选择9个',
    fieldNames: { label: 'display_name', value: 'name' }
  }
])
let catalog = store.catalog // 缓存左侧树选中的场景集
catalog.sceneCatalog = {} as any // clear 

const query: Query = ref({})
const onSearch = (data: Query) => {
  const sceneCatalog = catalog.sceneCatalog
  query.value = { ...data, scene_set: sceneCatalog?.id }
}

/****** 表格区域 */
const router = useRouter()
const columns = [
  { title: '场景ID', dataIndex: 'id', width: 150 },
  { title: '场景名称', dataIndex: 'adsName', width: 200, ellipsis: true },
  { title: '场景来源', dataIndex: 'adsSource', formatter: getSceneSourceName, width: 90 },
  { title: '标签', dataIndex: 'labels_detail', apiField: 'display_name', ellipsis: true },
  { title: '创建时间', dataIndex: 'createTime', width: 180 },
  { title: '修改时间', dataIndex: 'updateTime', width: 180 },
  { title: '所属用户', dataIndex: 'createUser', width: 150, ellipsis: true },
  { title: '修改者', dataIndex: 'updateUser', width: 150, ellipsis: true },
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

// const loading = ref(false)
const onSelect = async (val: any) => {
  query.value = { ...query.value, scene_set: val.id }
  loading.value = true
  const res = await api.scenesets.get(val.id)
  catalog.sceneCatalog = res
  loading.value = false
}
const onClick = (val: any) => {
  const { type, data } = val
  const id = type == 'add' ? 0 : data.id
  if(type != 'delete') {
    router.push('/scene/sceneset-edit/' + id)
  } else {
    deleteData(id)
  }
}

const treeRef = ref()
const loading = ref(false)
const deleteData = async (id: string) => {
  loading.value = true
  await api.scenesets.delete(id)
  message.info('删除成功')
  loading.value = false
  treeRef.value.refresh()
}
</script>
