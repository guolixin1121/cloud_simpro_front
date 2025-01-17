<template>
  <div class="flex ant-transfer">
    <a-form-item-rest>
      <div class="ant-transfer-list">
        <div class="flex justify-between ant-transfer-list-title">
          <span>场景集</span>
        </div>
        <a-input-search v-model:value="searchSceneset" placeholder="请输入搜索内容" allowClear @search="onScenesetSearch" @pressEnter="onScenesetSearch"></a-input-search>
        <div class="scroll-box" style="height: calc(100% - 40px); overflow: auto" @scroll="(e: Event) => onScroll(e)">
          <a-tree :tree-data="scenesets"
            v-model:checkedKeys="selectedSceneset" 
            @select="onScenesetSelected"></a-tree>
          <a-spin :spinning="scenesetLoading" style="width: 100%; padding-top: 20px"></a-spin>
        </div>
      </div>

      <div class="ant-transfer-list">
        <div class="ant-transfer-list-title mt-1 flex justify-between">
          <span>场景(累计选中{{ selectedScenes?.length }}项)</span>
          <span class="text-link cursor-pointer" v-if="!isAllChecked" @click="onAllChecked">全选</span>
          <span class="text-link cursor-pointer" v-else @click="onAllUnchecked">取消选中</span>
        </div>
        <div class="scroll-box scroll-box-right" style="height: calc(100% - 70px); overflow: auto">
          <a-spin :spinning="sceneLoading" v-if="scenes.length" ></a-spin>
          <a-checkbox-group v-model:value="currentSelectedScenes">
            <a-checkbox v-for="item in scenes" :key="item.id" :value="item.id" style="margin-left: 0"
              @change="onSceneChecked">
              <span class="label">{{ item.adsName }}</span>
            </a-checkbox>
          </a-checkbox-group>
        </div>
        <!-- 全选 -->
        <div class="relative flex justify-between items-center" style="margin: 8px 12px 0px 12px;"  v-if="pagination.total > 0" >
          <a-checkbox v-model:checked="isCurrentAllChecked"
              :indeterminate="indeterminate"
              @change="onCurrentAllChecked">当前页面已选中{{currentSelectedScenes.length}}项</a-checkbox>
          <a-pagination
              class="flex"
              style="right: 0; bottom: 0"
              size="small"
              v-model:pageSize="pagination.size" 
              v-model:current="pagination.page" 
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
const scenesets = ref<any[]>([]) // 场景集列表
const selectedSceneset = ref<string[]>([]) // 选中的场景集
const searchSceneset = ref()
const scenesetPage = reactive({
  isAllLoaded: false,
  page: 1,
  size: 10,
})
const pagination = reactive({
  total: 0,
  page: 1,
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
  try {
    scenesetLoading.value = true
    const res = await api.scenesets.getListV2({
      ...query, 
      name: searchSceneset.value?.trim(),
      page: scenesetPage.page,
      size: scenesetPage.size
    })
    const results = res.results.map((item: any) => ({
      id: item.id,
      key: item.id,
      title: item.groupName,
      name: item.groupName,
      isLeaf: item.isLeaf
    }))
    scenesets.value.push(...results)
    console.log(scenesets.value)
  }  finally {
    scenesetLoading.value = false
  }
}

const getScenes = async (query?: Object) => {
  const res = await api.scene.getList({
    scene_set: selectedSceneset.value[0],
    page: pagination.page,
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

// const loadSubSceneset = async (treeNode: any) => {
//   return new Promise((resolve: (value?: unknown) => void) => {
//     if (treeNode.dataRef.children) {
//       resolve();
//       return;
//     }
//     getSceneset({parent: treeNode.key}).then((res) => {
//       if(res.length == 0) {
//         treeNode.dataRef.isLeaf = true
//       }
//       treeNode.dataRef.children = res 
//       scenesets.value = [...scenesets.value]
//       resolve()
//     })
//   })
// }

const onScenesetSearch = async () => {
  scenesetPage.page = 1
  scenesets.value = []
  getSceneset()
}

const onScroll = (e: any) => {
  if (!scenesetPage.isAllLoaded) {
    const { target } = e
    if (target.scrollTop + target.offsetHeight >= target.scrollHeight - 50 && !scenesetLoading.value) {
      scenesetPage.page = scenesetPage.page + 1
      getSceneset()
    }
  }
}
// 切换场景集，重置所有数据
// const onScenesetChecked = (checkedKeys: string[]) => {
//   pagination.page = 1
//   selectedSceneset.value = checkedKeys
//   selectedScenes.value = []
//   currentSelectedScenes.value = []
//   isAllChecked.value = false
//   loadScene()
// }

// 切换场景集: 重置所有数据, cancel other request
const onScenesetSelected = async (selectedKeys: string[]) => {
  pagination.page = 1
  pagination.total = 0
  selectedSceneset.value = selectedKeys
  selectedScenes.value = []
  currentSelectedScenes.value = []
  isAllChecked.value = false
  loadScene()
}

// 场景列表分页
const onScenePageChanged = async (page: number) => {
  pagination.page = page
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
    selectedScenes.value = selectedScenes.value.filter((item: any) => currentSelectedScenes.value.findIndex((scene: any) => scene === item) == -1)
    selectedScenes.value = [...selectedScenes.value, ...currentSelectedScenes.value]
  } else {
    currentSelectedScenes.value = []
    // 过滤掉当前页的数据
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
      selectedScenes.value = allData
    } finally {
      sceneLoading.value = false
    }
  }
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

<style lang="less">
// .ant-transfer-list .ant-tree {
//   .ant-tree-treenode {
//     padding: 2px 0px !important;
//     width: 100%;
//   }
//   .ant-tree-treenode-selected {
//     background-color: var(--menu-active-bg-color);
//   }
// }
// .ant-transfer-list .ant-spin-nested-loading .ant-spin .ant-spin-dot {
//   top: 20%;
// }
</style>
