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
      <div style="height: calc(100% - 40px); overflow: auto">
        <a-tree checkable :tree-data="treeData" v-model:checkedKeys="checkedKeys" @check="onChecked"></a-tree>
        <a-spin :spinning="loading" style="width: 100%; padding-top: 20px"></a-spin>
      </div>
    </div>

    <div class="ant-transfer-list">
      <div class="ant-transfer-list-title mt-1 ml-2">{{ titles[1] }}</div>
      <ul>
        <li class="transfer-checked-item flex justify-between items-center" v-for="item in selectedNodes" :key="item.key">
          {{ item.title }}
          <!-- <CloseOutlined class="delete-icon"/> -->
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import {CloseOutlined} from '@ant-design/icons-vue'
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
const checkedKeys = ref([])

const loading = ref(false)
const getOptions = async () => {
  loading.value = true
  const res = await props.api()
  loading.value = false
  treeData.value = treeTransfer(res.results || res)
}

const treeTransfer = (data: any): TreeDataItem[] => {
  const { label, value } = props.fieldNames
  const options = data.map((item: any) => ({
    title: item[label],
    value: item[value],
    key: item[value],
    children: treeTransfer(item.children || []),
    isTag: item.isTag
  }))
  return options
}

watch(checkedKeys, () => {
  console.log(checkedKeys)
})
const onChecked = (_checkedKeys: any, e: any) => {
  console.log( 'checkedNodes', e.checkedNodes)
  selectedNodes.value = e.checkedNodes.filter((item: any) => item.isTag)
  emits('update:targetKeys', selectedNodes.value)
}

const onSearch = () => {
  console.log()
}

getOptions()
</script>

<style lang="less" scoped>
.ant-transfer-list-title {
  padding-bottom: 8px;
  border-bottom: 1px solid #e6e7eb;
}
.transfer-checked-item {
  height: 32px;
  line-height: 32px;
  padding: 0px 12px;
  &:hover {
    background: #f2f3f5;
  }
  .delete-icon {
    cursor: pointer;
  }
}
</style>
