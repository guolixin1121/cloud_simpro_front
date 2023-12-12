<template>
  <div class="flex ant-transfer">
    <a-form-item-rest>
      <div class="ant-transfer-list">
        <div class="flex justify-between ant-transfer-list-title">
          <span>场景集</span>
        </div>
        <a-input-search class="my-2" v-model:value="searchSceneset" placeholder="请输入搜索内容" allowClear @search="onScenesetSearch" @pressEnter="onScenesetSearch"></a-input-search>
        <div style="height: calc(100% - 40px); overflow: auto">
          <a-tree v-if="!scenesetLoading" :tree-data="scenesets" :load-data="loadSubSceneset" 
            v-model:checkedKeys="selectedSceneset" 
            @select="onScenesetSelected"></a-tree>
          <a-spin :spinning="scenesetLoading" style="width: 100%; padding-top: 20px"></a-spin>
        </div>
      </div>

      <div class="ant-transfer-list">
        <div class="ant-transfer-list-title mt-1 flex justify-between">
          <span>场景(累计选中{{ selectedScenes?.length }}项)</span>
          <span class="text-blue cursor-pointer" v-if="!isAllChecked" @click="onAllChecked">全选</span>
          <span class="text-blue cursor-pointer" v-else @click="onAllUnchecked">取消选中</span>
        </div>
        <div class="scroll-box" style="height: calc(100% - 70px); overflow: auto">
          <a-spin :spinning="sceneLoading" v-if="scenes.length" >
            <a-checkbox-group v-model:value="currentSelectedScenes">
              <a-checkbox v-for="item in scenes" :key="item.id" :value="item.id" style="margin-left: 0"
                @change="onSceneChecked">
                <span class="label">{{ item.adsName }}</span>
              </a-checkbox>
            </a-checkbox-group>
          </a-spin>
          <div v-else>
              <empty style="margin-top: 12%"/>
          </div>
        </div>
        <!-- 全选 -->
        <div class="flex justify-between" style="margin-top: 8px"  v-if="pagination.total > 0" >
          <a-checkbox v-model:checked="isCurrentAllChecked"
              :indeterminate="indeterminate"
              @change="onCurrentAllChecked">当前页面已选中{{currentSelectedScenes.length}}项</a-checkbox>
          <a-pagination
              class="flex"
              v-model:pageSize="pagination.size" 
              v-model:current="pagination.current" 
              :total="pagination.total"
              @change="onScenePageChanged"></a-pagination>
        </div>
      </div>
    </a-form-item-rest>
  </div>
</template>

<script lang="ts" setup>
import 'ant-design-vue/es/transfer/style/index.css'

const emits = defineEmits(['update:value'])
type Scene = {
  id: string,
  adsName: string,
}
const scenesets = ref([]) // 场景集列表
const selectedSceneset = ref<string[]>([]) // 选中的场景集
const searchSceneset = ref()

let pagination = reactive({
  total: 0,
  current: 1,
  size: 20
})
const scenes = ref<Scene[]>([]) // 场景列表
const selectedScenes = ref<string[]>([]) // 全局的选中场景
const currentSelectedScenes = ref<string[]>([]) // 当前页的选中场景列表
const isAllChecked = ref(false) // 全局的是否全选
const isCurrentAllChecked = ref(false) // 当前页的是否全选
const indeterminate = ref(false)
const scenesetLoading = ref(false)
const sceneLoading = ref(false)

const getSceneset = async (query?: Object) => {
  const res = await api.scenesets.getList({...query, version: 2, name: searchSceneset.value?.trim()})
  return res.results.map((item: any) => ({
    id: item.baidu_id,
    key: item.baidu_id,
    title: item.groupName,
    name: item.groupName,
    isLeaf: item.isLeaf
  }))
}

const getScenes = async (query?: Object) => {
  const res = await api.scene.getList({
    scene_set: selectedSceneset.value[0],
    page: pagination.current,
    size: pagination.size,
    ...query
  })
  pagination.total = res.count
  return res.results
}

const loadScene = async (query: Object = {}) => {
  try {
    sceneLoading.value = true
    scenes.value = await getScenes(query)
  } finally {
    sceneLoading.value = false
  }
}

const loadSubSceneset = async (treeNode: any) => {
  return new Promise((resolve: (value?: unknown) => void) => {
    if (treeNode.dataRef.children) {
      resolve();
      return;
    }
    getSceneset({parent: treeNode.key}).then((res) => {
      if(res.length == 0) {
        treeNode.dataRef.isLeaf = true
      }
      treeNode.dataRef.children = res 
      scenesets.value = [...scenesets.value]
      resolve()
    })
  })
}

const onScenesetSearch = async () => {
   try {
    scenesetLoading.value = true
    scenesets.value = await getSceneset()
  } finally {
    scenesetLoading.value = false
  }
}

// 切换场景集，重置所有数据
// const onScenesetChecked = (checkedKeys: string[]) => {
//   pagination.current = 1
//   selectedSceneset.value = checkedKeys
//   selectedScenes.value = []
//   currentSelectedScenes.value = []
//   isAllChecked.value = false
//   loadScene()
// }

// 切换场景集: 重置所有数据, cancel other request
const onScenesetSelected = async (selectedKeys: string[]) => {
  pagination.current = 1
  pagination.total = 0
  selectedSceneset.value = selectedKeys
  selectedScenes.value = []
  currentSelectedScenes.value = []
  isAllChecked.value = false
  loadScene()
}

// 场景列表分页
const onScenePageChanged = async (page: number) => {
  pagination.current = page
  await loadScene()
  // 从全局选中数据中恢复当前选中数据
  currentSelectedScenes.value = selectedScenes.value.filter((item: any) => scenes.value.find((scene: any) => scene.id === item))
  isCurrentAllChecked.value = currentSelectedScenes.value.length === scenes.value.length
}

// 设置全局选中场景
const onSceneChecked = (e: any) => {
  const { checked, value } = e.target
  if(checked) {
    selectedScenes.value = [...selectedScenes.value, value]
  } else {
    selectedScenes.value = selectedScenes.value.filter((item) => item !== value)
  }
  isAllChecked.value = selectedScenes.value.length == pagination.total
}

// 当前全选
const onCurrentAllChecked = (e: any) => {
  const { checked } = e.target
  if(checked) {
    currentSelectedScenes.value = scenes.value.map((item: any) => item.id)
    selectedScenes.value = [...selectedScenes.value, ...currentSelectedScenes.value]
  } else {
    currentSelectedScenes.value = []
    selectedScenes.value = selectedScenes.value.filter((item: any) => scenes.value.findIndex((scene: any) => scene.id === item) == -1)
  }
}

// 全选
const onAllChecked = async () => {
  if(!scenes.value.length || sceneLoading.value) return 
  const totalPageSize = Math.floor((pagination.total - 1) / pagination.size + 1)
  selectedScenes.value = []
  const allData = [] 
  // 获取所有数据，并选中
  for(let i = 0; i < totalPageSize; i++) {
    try {
      sceneLoading.value = true
      const data = await getScenes({ page: i + 1})
      allData.push(...data.map((item: any) => item.id))
    } finally {
      sceneLoading.value = false
    }
  }
  selectedScenes.value = allData
  isAllChecked.value = true

  // 更新当前选中
  currentSelectedScenes.value = selectedScenes.value.filter((item: any) => scenes.value.find((scene: any) => scene.id === item))
  isCurrentAllChecked.value = currentSelectedScenes.value.length === scenes.value.length
}

const onAllUnchecked = () => {
  isAllChecked.value = false
  currentSelectedScenes.value = []
  selectedScenes.value = []
}

// 当前全选逻辑
watch(currentSelectedScenes, () => {
  const currentLength = currentSelectedScenes.value.length
  const dataLength = scenes.value.length
  isCurrentAllChecked.value = currentLength > 0 && currentLength == dataLength
  indeterminate.value = currentLength > 0 && currentLength < dataLength
})
watch(selectedScenes, (newVal, oldVal) => {
  console.log(selectedScenes.value)
  if(newVal.length ==0 && oldVal.length == 0) return

  emits('update:value', selectedScenes.value)
})

onMounted(onScenesetSearch)
</script>

<style lang="less" scoped>
@import '@/assets/styles/variable.less';
.ant-transfer-list-title {
  padding-bottom: 8px;
  border-bottom: 1px solid #e6e7eb;
}
</style>
<style lang="less">
.ant-transfer-list .ant-tree {
  .ant-tree-treenode {
    padding: 2px 0px !important;
    width: 100%;
  }
  .ant-tree-treenode-selected {
    background-color: var(--menu-active-bg-color);
  }
}
.ant-transfer-list .ant-spin-nested-loading .ant-spin .ant-spin-dot {
  top: 20%;
}
</style>
