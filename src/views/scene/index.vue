<template>
  <div class="main-tree">
    <tree
      :title="'场景集'"
      :api="sceneApi.getList"
      :query="{ ...selectedSceneset, version: 2 }"
      :lazy="true"
      :is-recurse="scenesetFromLogic != null"
      :filedNames="{ label: 'groupName', value: 'id' }"
      :button-handlers="treeBtnHandlers"
      @select="onTreeSelect"
    />
    <div class="main-right">
      <a-spin :spinning="scenesetLoading">
        <div class="right-title">
          <div class="title-item"><span class="label">场景集名称</span>{{ selectedSceneset?.name }}</div>
          <!-- <div class="title-item"><span class="label">路径</span>{{ selectedSceneset?.path }}</div> -->
          <div class="title-item">
            <span class="label">标签</span>
            <ul style="flex: 1">
              <li class="inline-block mr-4" v-for="item in selectedSceneset?.labels_detail" :key="item.name">
                {{ item.display_name }}
              </li>
            </ul>
          </div>
        </div>
      </a-spin>

      <search-form :items="formItems" :manual="true" @search="onTableSearch"></search-form>

      <div class="main">
        <div class="flex justify-between items-center">
          <span class="title">场景列表</span>
          <div>
            <batch-button :disabled="!selectedItems.length" v-if="user.hasPermission('delete')" :api="onBatchDelete"></batch-button>
            <a-button type="primary" :disabled="selectedItems.length > 0"  v-if="user.hasPermission('add')" @click="router.push('/scene/edit/0')">上传场景</a-button>
          </div>
        </div>
        <a-spin :spinning="loading">
          <Table ref="tableRef" :api="currentApi.getList" :query="query" :columns="columns" :scroll="{ x: 1500, y: 'auto' }" 
            @select="onSelect" /> 
        </a-spin>
      </div>
    </div>
  </div>
  <VncModal ref="vncModal"></VncModal>
</template>

<script setup lang="ts">
import { SceneSourceOptions, getSceneSourceName } from '@/utils/dict'
import { SStorage } from '@/utils/storage'
import { gotoVnc } from '@/utils/vnc'
import VncModal from '@/components/vnc-modal/index.vue'
const vncModal = ref()
const scenesetFromLogic = SStorage.get('logic-sceneset')
const currentApi = api.scene
const sceneApi = api.scenesets
const user = store.user
const selectedSceneset = ref(scenesetFromLogic) // 逻辑场景跳转的默认场景集

/****** 搜素区域 */
const formItems = ref<SearchFormItem[]>([
  { label: '名称', key: 'adsName', type: 'input', placeholder: '请输入场景名称' },
  {
    label: '场景来源',
    key: 'adsSource',
    type: 'select',
    options: SceneSourceOptions,
    placeholder: '请选择场景来源',
    defaultValue: ''
  },
  {
    label: '标签',
    key: 'labels',
    type: 'tree-select',
    mode: 'multiple',
    api: api.tags.getList,
    query: { tree: 1, tag_type: 3, size: 100 }, // tree无法分页，一次性获取所有
    placeholder: '请选择标签，最多选择9个',
    fieldNames: { label: 'display_name', value: 'name' },
    defaultValue: [''],
    multiple: true
  }
])

const query: Query = ref({})
const onTableSearch = (data: Query) => {
  const sceneCatalog = selectedSceneset.value
  query.value = { ...data, scene_set: sceneCatalog?.id }
}

/****** 表格区域 */
const loading = ref(false)
const router = useRouter()
const columns = [
  { dataIndex: 'checkbox', width: 60 },
  { title: '场景ID', dataIndex: 'id', width: 150 },
  { title: '场景名称', dataIndex: 'adsName', width: 200, ellipsis: true },
  { title: '场景来源', dataIndex: 'adsSource', formatter: getSceneSourceName, width: 90 },
  { title: '标签', dataIndex: 'labels_detail', apiField: 'display_name', ellipsis: true },
  { title: '创建时间', dataIndex: 'createTime', width: 180 },
  { title: '修改时间', dataIndex: 'updateTime', width: 180 },
  { title: '创建者', dataIndex: 'createUser', width: 150, ellipsis: true },
  { title: '修改者', dataIndex: 'updateUser', width: 150, ellipsis: true },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 200,
    actions: {
      查看: (data: any) => router.push('/scene/view/' + data.id),
      编辑: (data: any) => router.push('/scene/edit/' + data.id),
      编辑场景: (data: any) => gotoVnc({ action: 1, value: data.id }, 
        loading,
        null,
        () => vncModal.value.show()),
      删除: async ({ id }: { id: string }) => await currentApi.delete(id)
    }
  }
]
store.catalog.sceneCatalog = {}
const scenesetLoading = ref(false)
const onTreeSelect = async (sceneset: any) => {
  selectedSceneset.value = sceneset
  store.catalog.sceneCatalog = sceneset
  // 切换地图集，地图列表page重置为1
  query.value = { ...query.value, scene_set: sceneset?.id, page: 1 }
  // 场景集信息
  if (sceneset?.isLeaf) {
    try {
      scenesetLoading.value = true
      const res = await api.scenesets.get(sceneset?.id)
      selectedSceneset.value = res
    } finally {
      scenesetLoading.value = false
    }
  }
}

const treeBtnHandlers = {
  add: () => router.push('/scene/sceneset/0'),
  edit: (data: any) => router.push('/scene/sceneset/' + data.id + (data.isLeaf ? '' : ('?name=' + encodeURIComponent(data.name)))),
  delete: api.scenesets.delete
}

const tableRef = ref()
const selectedItems = ref([])
const onSelect = (data: any) => selectedItems.value = data
const onBatchDelete = async () => {
  await currentApi.batchDelete({scenes_id: selectedItems.value})
  tableRef.value.refresh({ deletedRows: selectedItems.value.length })
}
</script>
