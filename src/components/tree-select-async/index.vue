<template>
  <div class="tree-select position" ref="treeRef">
    <div class="ant-input-affix-wrapper">
      <input v-model="searchValue" 
        class="ant-input"
        :placeholder="($attrs.placeholder as string)" 
        :maxlength="showSearch ? 255 : 0"
        @input="onSearch" 
        @focus="onFocus" />
      <div class="ant-input-suffix">
        <svg-icon v-if="focused" icon="search" class="icon"></svg-icon>
        <svg-icon v-else icon="arrow" class="icon"></svg-icon>
      </div>
    </div>
    <!-- a-input里只要有手动输入，就会触发form的required验证失败，所以改为input -->
    <!-- <a-input v-model:value="searchValue"
      :placeholder="$attrs.placeholder" 
      :maxlength="showSearch ? 255 : 0"
      @change="onSearch" 
      @focus="onFocus">
      <template #suffix>
        <svg-icon v-if="focused" icon="search" class="icon"></svg-icon>
        <svg-icon v-else icon="arrow" class="icon"></svg-icon>
      </template>
    </a-input> -->
    <div class="tree-container" v-if="isShowList"> 
      <a-spin :spinning="loading" class=" w-full">
      </a-spin>
      <!-- 刷新数据需要重新渲染，否则展开节点会有bug -->
      <a-tree 
        v-if="!loading"
        :loading="loading"
        :load-data="loadData"
        :tree-data="treeData"
        :expandedKeys="expandRowKeys"
        :selectedKeys="selectedRowKeys"
        v-bind="$attrs"
        @expand="onExpand"
        @select="onSelect">
      </a-tree>
      <div class=" text-center ant-empty-normal" v-if="!loading && treeData.length == 0">
        <svg-icon icon="empty" style="width: 64px; height: 40px;"></svg-icon>
        <div>暂无数据</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

const props = defineProps({
  title: {
    type: String
  },
  api: {
    type: Function,
    required: true
  },
  apiFilter: {
    type: Function
  },
  query: {
    type: Object,
    default: () => ({})
  },
  filedNames: {
    type: Object,
    default: () => ({ label: 'groupName', value: 'id'})
  },
  selectNode: {
    type: Object
  },
  showSearch: {
    type: Boolean,
    default: () => true
  }
})
const emites = defineEmits(['update:selectNode', 'update:value', 'change'])

/******** input box */
const searchValue = ref() 
const searchQuery = ref(props.query)
const onSearch = () => {
  console.log(searchValue.value)
  expandRowKeys.value = []
  selectedRowKeys.value = []
  searchQuery.value = { ...props.query, name: searchValue.value}
  refresh()
}
const focused = ref(false)
const onFocus = () => {
  isShowList.value = true
  focused.value = true
}

/******* toggle tree *****/
const isShowList = ref(false)
const treeRef = ref()
onClickOutside(treeRef, () => {
  isShowList.value = false
  focused.value = false
})

/******* tree ******/
const loading = ref(false)
const treeData = ref([])

const refresh = async () => {
  try{
    loading.value = true
    const data = await getOptions()
    treeData.value = data
  } finally {
    loading.value = false
  }
}

const getOptions = async (query: any = {}) => {
  const res = await props.api({
    ...searchQuery.value, 
    ...query
  } )
  return transformData(res.results)
}

const transformData = (data: any = []) => {
  const { label, value } = props.filedNames
  let parents = data
  const apiFilter = props.apiFilter
  if(apiFilter) {
    parents = parents.filter((item: any) => apiFilter(item))
  }
  return parents.map((item: any) => ({
    id: item[value],
    key: item[value],
    title: item[label],
    children: null,
    selectable: apiFilter ? true : (item.isLeaf == 1),
    isLeaf: item.isLeaf == 1
  }))
}

const loadData = async (treeNode: any) => {
  return new Promise((resolve: (value?: unknown) => void) => {
    if (treeNode.dataRef.children) {
      resolve();
      return;
    }
    getOptions({parent: treeNode.key}).then((res) => {
      if(res.length == 0) {
        treeNode.dataRef.isLeaf = true
      }
      treeNode.dataRef.children = res 
      treeData.value = [...treeData.value]
      resolve()
    })
  })
}

// 选中的树节点
const selectedNode = ref()
const selectedRowKeys = ref([selectedNode.value?.id])
const onSelect = (keys: string[], {selected, selectedNodes}: any) => {
  isShowList.value = false
  if(!selected) return

  const node = selectedNodes[0]

  selectedNode.value = node
  selectedRowKeys.value = [node.id]
  searchValue.value = node.title
  
  emites('change', node)
  emites('update:selectNode', node)
  emites('update:value', node.id)
}

const expandRowKeys = ref()
const onExpand = (expandedKeys: string[]) => {
  expandRowKeys.value = expandedKeys
}

refresh()
</script>

<style lang="less" scoped>
.icon {
  color: rgba(0, 0, 0, 0.25); 
  width: 12px; 
  height: 12px;
  position: relative;
  top: -2px;
}
.tree-container {
  position: absolute;
  background-color: #fff;
  z-index: 200000;
  width: 100%; 
  height: 300px;
  overflow-y: auto;
  margin-top: 2px;
  padding: 10px 4px;
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
}
</style>
