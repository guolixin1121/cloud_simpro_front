<template>
  <div class="flex ant-transfer">
    <div class="ant-transfer-list">
      <div class="flex justify-between ant-transfer-list-title">
        <span>{{ titles[0] }}</span>
        <!-- <span class=" text-blue cursor-pointer" @click="onCheckedAll">全选</span> -->
      </div>
      <a-input-search
        class="my-2"
        placeholder="请输入搜索内容"
        allowClear
        @search="onSearch"
        @pressEnter="onSearch"
      ></a-input-search>
      <div style="height: calc(100% - 40px); overflow: auto"
        @scroll="onScroll">
        <a-tree checkable
          :tree-data="treeData" 
          v-model:checkedKeys="checkedKeys" 
          @check="onChecked"></a-tree>
        <a-spin :spinning="loading" style="width: 100%; padding-top: 20px"></a-spin>
      </div>
    </div>

    <div class="ant-transfer-list">
      <div class="ant-transfer-list-title mt-1 flex justify-between">
        <span>{{ titles[1] }}({{ selectedNodes?.length }})</span>
        <span class=" text-blue cursor-pointer" @click="onRemoveAll">删除全部</span>
      </div>
      <ul class="scroll-box" style="height: calc(100% - 40px); overflow: auto;">
        <li class="transfer-checked-item flex justify-between items-center"
          v-for="item in selectedNodes" :key="item.key">
          <span class="label">{{ item.title }}</span>
          <svg-icon icon="close" class=" text-gray-400 cursor-pointer"
            @click="onRemove(item)"/>
        </li>
      </ul>
    </div>
  </div>
  <div v-if="isExceedLimit" style="color: #ff4d4f">最多选择9个</div>
</template>

<script lang="ts" setup>
import { watchOnce } from "@vueuse/core"
import "ant-design-vue/es/transfer/style/index.css"
import { TreeDataItem } from 'ant-design-vue/lib/tree'

const emits = defineEmits(['update:targetKeys'])
const props = defineProps({
  titles: {
    type: Array,
    default: () => ['', '']
  },
  api: {
    type: Function
  },
  query: {
    type: Object,
    default: () => ({})
  },
  targetKeys: {
    type: Array
  },
  fieldNames: {
    type: Object as PropType<FieldNames>,
    default: () => ({ label: 'name', value: 'nodeId', apiField: '' })
  }
} as any)

const treeData = ref<TreeDataItem[]>([])
const selectedNodes = ref<TreeDataItem[]>([])
const checkedKeys = ref<TreeDataItem[]>([])
const checkedKeysBackup = ref<TreeDataItem[]>([])

const loading = ref(false)
let isAllLoaded = false
let page = 1
const getOptions = async (input = '') => {
  try {
    const { value } = props.fieldNames
    loading.value = true
    const res = await props.api({ [value]: input, ...props.query, page, size: 20 })
    const data = treeTransfer(res.results || res)
    treeData.value.push(...data)
    isAllLoaded = treeData.value.length >= res.count || res.length
  } finally {
    loading.value = false
  }
}

const treeTransfer = (data: any): TreeDataItem[] => {
  const { label, value } = props.fieldNames
  const options = data.map((item: any) => ({
    title: item[label],
    value: item[value],
    key: item[value],
    children: treeTransfer(item.children || []),
    name: item.name,
    isTag: item.isTag
  }))
  return options
}

const isExceedLimit = ref(false)
const onChecked = (_checkedKeys: any, e: any) => {
  isExceedLimit.value = false
  let checkedNodes = e.checkedNodes.filter((item: any) => item.isTag)
  checkedNodes = getSelectedNode(checkedNodes)
  if(checkedNodes.length > 9) {
    isExceedLimit.value = true
    checkedKeys.value = [...checkedKeysBackup.value]
  } else {
    hasDefaultValue = false
    selectedNodes.value = checkedNodes
    checkedKeys.value = selectedNodes.value.map((d: any) => d.value)
    emits('update:targetKeys', selectedNodes.value)
  }
}

const onRemove = (item: any) => {
  isExceedLimit.value = false
  // 过滤掉要删除的项
  selectedNodes.value = selectedNodes.value.filter((data: any) => data.key != item.key)
  // 更新左侧的选中项
  checkedKeys.value = selectedNodes.value.map((data: any) => data.key)
  emits('update:targetKeys', selectedNodes.value)
}

const onRemoveAll = () => {
  selectedNodes.value = []
  checkedKeys.value = []
  emits('update:targetKeys', [])
}


// 有数据筛选，所以要保留筛选前选中的数据
const getSelectedNode = (currentCheckedNodes: any[]) => {  
  // const currentCheckedNodes = currentCheckedKeys.map((key: string) => treeData.value.find((d: any) => d.value == key))
  // 合并前后选中的数据
  const allCheckedNodes = [...selectedNodes.value]
  currentCheckedNodes.forEach((node: any) => {
    const isExist = allCheckedNodes.find((d: any) => d.value === node.value)
    if(!isExist)  {
      allCheckedNodes.push(node)
    }
  })
  // 计算最终选中的数据
  const checkedNodes = [] as any
  allCheckedNodes.forEach((node: any) => {
    const inLeftDataSource = isInTree(node.value)
    const inCurrentCheckedNodes = currentCheckedNodes.find((d: any) => d.value === node.value)
    if(!inLeftDataSource) {     // 不在左侧数据源中，则为旧的选中数据，需要保留
      checkedNodes.push(node)
    } else if(inCurrentCheckedNodes) { // 在当前选中数据中
      checkedNodes.push(node)
    }
  })
  return checkedNodes
}

const isInTree = (value: string, dataSource: any [] = treeData.value): boolean => {
  let isExist = false
  for(let i = 0; i < dataSource.length; i++) {
    const item = dataSource[i]
    if(item.value === value) {
      isExist = true
    } else {
      isExist = isInTree(value, item.children)
    }
    if(isExist) break
  }
  return isExist
}

watch(checkedKeys, () => checkedKeysBackup.value = [...checkedKeys.value])

// const onCheckedAll = () => {
//   hasDefaultValue = false
//   const allData = getTreeNode(treeData.value)
//   selectedNodes.value = allData.filter((item: any) => item.isTag)
//   checkedKeys.value = allData.map((item: any) => item.key)
//   emits('update:targetKeys', selectedNodes.value)
// }

// const getTreeNode = (root: any) => {
//   const results = [] as any
//   root.forEach((item: any) => {
//     results.push(item)
//     const children = getTreeNode(item.children || [])
//     if(children.length > 0) {
//       results.push(...children)
//     }
//   })
//   return results
// }

const onSearch = (input: string) => {
  treeData.value = []
  getOptions(input)
}

let hasDefaultValue = true
watchOnce(
  () => props.targetKeys,
  () => {
    if(hasDefaultValue && props.targetKeys) {
      hasDefaultValue = false
      const { label, value } = props.fieldNames
      selectedNodes.value = props.targetKeys?.map((item: any) => ({
        title: item[label],
        key: item[value],
        value: item[value]
      }))
      checkedKeys.value = selectedNodes.value?.map((data: any) => data.key)
    }
  })

const onScroll = (e: any) => {
  if (props.api && !isAllLoaded) {
    const { target } = e
    if (target.scrollTop + target.offsetHeight >= (target.scrollHeight - 50) && !loading.value) {
      page = page + 1
      getOptions()
    }
  }
}

getOptions()
</script>

<style lang="less" scoped>
.ant-transfer-list-title {
  padding-bottom: 8px;
  border-bottom: 1px solid #e6e7eb;
}
.transfer-checked-item {
  line-height: 20px;
  padding: 6px 12px;
  word-break: break-word;
  white-space:break-spaces;
  margin-top: 2px;
  .label {
    white-space: break-spaces;
  }
  &:hover {
    background: #f2f3f5;
  }
  .delete-icon {
    cursor: pointer;
  }
}
</style>
