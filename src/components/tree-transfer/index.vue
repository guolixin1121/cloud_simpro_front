<template>
  <div class="flex ant-transfer">
    <div class="ant-transfer-list">
      <div class="ant-transfer-list-title mt-1 ml-2">{{ titles[0] }}</div>
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

    <div class="ant-transfer-list ml-1">
      <div class="ant-transfer-list-title mt-1">{{ titles[1] }}</div>
      <ul style="height: calc(100% - 40px); overflow: auto">
        <li class="transfer-checked-item flex justify-between items-center"
          v-for="item in selectedNodes" :key="item.key">
          {{ item.title }}
          <svg-icon icon="close" class=" text-gray-400 cursor-pointer"
            @click="remove(item)"/>
        </li>
      </ul>
    </div>
  </div>
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


const onChecked = (_checkedKeys: any, e: any) => {
  selectedNodes.value = e.checkedNodes.filter((item: any) => item.isTag)
  hasDefaultValue = false
  emits('update:targetKeys', selectedNodes.value)
}

const remove = (item: any) => {
  selectedNodes.value = selectedNodes.value.filter((data: any) => data.key != item.key)
  checkedKeys.value = selectedNodes.value.map((data: any) => data.key)
  emits('update:targetKeys', selectedNodes.value)
}

const onSearch = (input: string) => {
  treeData.value = []
  getOptions(input)
}

let hasDefaultValue = true
watchOnce(
  () => props.targetKeys,
  () => {
    if(hasDefaultValue) {
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
    if (target.scrollTop + target.offsetHeight >= target.scrollHeight && !loading.value) {
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
  line-height: 32px;
  padding: 0 2px;
  word-break: break-all;
  &:hover {
    background: #f2f3f5;
  }
  .delete-icon {
    cursor: pointer;
  }
}
</style>
