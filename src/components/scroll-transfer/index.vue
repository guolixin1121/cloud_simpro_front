<template>
  <div class="ant-transfer">
    <a-form-item-rest>
      <div class="ant-transfer-list">
        <!-- <a-checkbox 
          v-model:checked="leftState.allChecked" 
          :indeterminate="leftState.indeterminate"
          @change="onCheckAllChange">{{ titles[0] }}</a-checkbox> -->
        <div class="flex justify-between">
          <span>{{ titles[0] }}</span>
          <!-- <span class=" text-blue cursor-pointer" @click="() => onCheckedAll()">全选</span> -->
        </div>
        <a-input-search class="my-2" placeholder="请输入搜索内容" allowClear 
          @search="onSearch"
          @pressEnter="onSearch"></a-input-search>
        <div style="height: calc(100% - 40px); overflow: auto" 
          @scroll="(e: Event) => onScroll(e)">
          <a-checkbox-group 
            v-model:value="leftState.checkedKeys" 
            :options="leftState.dataSource"
            @change="onChecked">
          </a-checkbox-group>
          <a-spin v-if="loading" style="width: 100%; padding-top: 20px"></a-spin>
        </div>
      </div>
      <!-- 右侧 -->
      <div class="ant-transfer-list ml-1">
        <div class="ant-transfer-list-title mt-1 flex justify-between">
          <span>{{ titles[1] }}</span>
          <span class=" text-blue cursor-pointer" @click="onRemoveAll">删除全部</span>
        </div>
        <ul style="height: calc(100% - 40px); overflow: auto">
          <li class="transfer-checked-item flex justify-between items-center"
            v-for="item in selectedNodes" :key="item.value">
            {{ item.label }}
            <svg-icon icon="close" class=" text-gray-400 cursor-pointer"
              @click="onRemove(item)"/>
          </li>
        </ul>
      </div>
    </a-form-item-rest>
  </div>
</template>
<script setup lang="ts">
import "ant-design-vue/es/transfer/style/index.css"

import { watchOnce } from '@vueuse/core'

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
    default: () => ({ label: 'name', value: 'id', apiField: '' })
  }
} as any)

const leftState = reactive({
  // allChecked: false,
  indeterminate: false,
  searchText: '',
  checkedKeys: [],
  dataSource: [] as any
})
const selectedNodes = ref([] as any)

// 分页获取数据
let page = 1
let isAllLoaded = ref(false)
let loading = ref(false)
const getOptions = async () => {
  if (props.api) {
    try {
      loading.value = true
      const { label, value, apiField } = props.fieldNames
      const res = await props.api({ page, size: 10, [label]: leftState.searchText })
      const results = res.results ||  res[apiField] || res
      const newOptions = results.map((item: any) => ({
        label: item[label],
        value: item[value]
      }))

      leftState.dataSource.push(...newOptions)
      isAllLoaded.value = leftState.dataSource.length >= (res.count || res.length)

      // if(isCheckedAll.value) {
      //   onCheckedAll(newOptions)
      // }
    } finally {
      loading.value = false
    }
  }
}

// 搜索查询数据
const onSearch = (input: string) => {
  if (props.api) {
    leftState.searchText = input
    leftState.dataSource = []
    page = 1
    getOptions()
  }
}

const onScroll = (e: any) => {
  if (props.api && !isAllLoaded.value) {
    const { target } = e
    if (target.scrollTop + target.offsetHeight >= target.scrollHeight && !loading.value) {
      page = page + 1
      getOptions()
    }
  }
}

const onChecked = (data: any) => {
  hasDefaultValue = false
  selectedNodes.value = data.map((val: any) => leftState.dataSource.find((d: any) => d.value == val))
  emits('update:targetKeys', selectedNodes.value)
}

const onRemove = (data: any) => {
  selectedNodes.value = selectedNodes.value.filter((item: any) => item.value != data.value)
  leftState.checkedKeys = selectedNodes.value.map((item: any) => item.value)
  emits('update:targetKeys', selectedNodes.value)
}

const onRemoveAll = () => {
  selectedNodes.value = []
  leftState.checkedKeys = []
  emits('update:targetKeys', selectedNodes.value)
}

// const onCheckedAll = (allData: any = leftState.dataSource) => {
//   hasDefaultValue = false
//   selectedNodes.value.push(...allData)
//   leftState.checkedKeys = selectedNodes.value.map((item: any) => item.value)
//   emits('update:targetKeys', selectedNodes.value)
// }

// 仅用于编辑时的回写
let hasDefaultValue = true
watchOnce(
  () => props.targetKeys,
  () => {
    if(hasDefaultValue) {
      hasDefaultValue = false
      const { label, value } = props.fieldNames
      selectedNodes.value = props.targetKeys?.map((item: any) => ({
        label: item[label],
        value: item[value]
      }))
      leftState.checkedKeys = selectedNodes.value?.map((data: any) => data.value)
      emits('update:targetKeys', selectedNodes.value) // 同步父组件数据，保持数据结构一致
    }
  })

// 动态api
watch(
  () => props.api,
  () => {
    leftState.dataSource = []
    page = 1
    getOptions()
  }
)

getOptions()
</script>
<style lang="less">
.ant-transfer-list {
  padding: 8px 12px;
}
.ant-checkbox-wrapper {
  display: flex;
  margin-top: 4px;
}
</style>
<style lang="less" scoped>
.ant-transfer-list-title {
  padding-bottom: 8px;
  border-bottom: 1px solid #e6e7eb;
}
.transfer-checked-item {
  line-height: 20px;
  padding: 6px 2px;
  word-break: break-all;
  &:hover {
    background: #f2f3f5;
  }
  .delete-icon {
    cursor: pointer;
  }
}
</style>