<template>
  <div class="ant-transfer">
    <a-form-item-rest>
      <div class="ant-transfer-list">
        <div class="flex justify-between  ant-transfer-list-title">
          <span>{{ titles[0] }}</span>
          <!-- <span class=" text-link cursor-pointer" @click="() => onCheckedAll()">全选</span> -->
        </div>
        <a-input-search placeholder="请输入搜索内容" allowClear @search="onSearch" @pressEnter="onSearch"></a-input-search>
        <div class="scroll-box" style="height: calc(100% - 40px); overflow: auto" @scroll="(e: Event) => onScroll(e)">
          <a-spin v-if="loading" style="width: 100%; padding-top: 20px"></a-spin>
          <a-checkbox-group v-model:value="leftState.checkedKeys" :options="leftState.dataSource" @change="onChecked"> </a-checkbox-group>
        </div>
      </div>
      <!-- 右侧 -->
      <div class="ant-transfer-list">
        <div class="ant-transfer-list-title flex justify-between">
          <span>{{ titles[1] }}</span>
          <span class="text-link cursor-pointer" @click="onRemoveAll">删除全部</span>
        </div>
        <ul class="scroll-box scroll-box-right">
          <li class="transfer-checked-item flex justify-between items-center" v-for="item in selectedNodes" :key="item.value">
            {{ item.label }}
            <svg-icon icon="close" style="height: 16px;" class="text-gray-400 cursor-pointer" @click="onRemove(item)" />
          </li>
        </ul>
      </div>
    </a-form-item-rest>
  </div>
</template>
<script setup lang="ts">
import 'ant-design-vue/es/transfer/style/index.css'
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
      const results = res.results || res[apiField] || res
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
    if (target.scrollTop + target.offsetHeight >= target.scrollHeight - 50 && !loading.value) {
      page = page + 1
      getOptions()
    }
  }
}

const onChecked = (checkedKeys: any) => {
  hasDefaultValue = false
  selectedNodes.value = getSelectedNode(checkedKeys)
  leftState.checkedKeys = selectedNodes.value.map((item: any) => item.value)
  // selectedNodes.value = checkedKeys.map((val: any) => leftState.dataSource.find((d: any) => d.value == val))
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

// 有数据筛选，所以要保留筛选前选中的数据
const getSelectedNode = (currentCheckedKeys: string[]) => {
  const currentCheckedNodes = currentCheckedKeys.map((key: string) => leftState.dataSource.find((d: any) => d.value == key))
  // 合并前后选中的数据
  const allCheckedNodes = [...selectedNodes.value]
  currentCheckedNodes.forEach((node: any) => {
    const isExist = allCheckedNodes.find((d: any) => d.value === node.value)
    if (!isExist) {
      allCheckedNodes.push(node)
    }
  })
  // 计算最终选中的数据
  const checkedNodes = [] as any
  allCheckedNodes.forEach((node: any) => {
    const inLeftDataSource = leftState.dataSource.find((d: any) => d.value === node.value)
    const inCurrentCheckedNodes = currentCheckedNodes.find((d: any) => d.value === node.value)
    if (!inLeftDataSource) {
      // 不在左侧数据源中，则为旧的选中数据，需要保留
      checkedNodes.push(node)
    } else if (inCurrentCheckedNodes) {
      // 在当前选中数据中
      checkedNodes.push(node)
    }
  })
  return checkedNodes
}

// 仅用于编辑时的回写
let hasDefaultValue = true
watchOnce(
  () => props.targetKeys,
  () => {
    if (hasDefaultValue && props.targetKeys) {
      hasDefaultValue = false
      const { label, value } = props.fieldNames
      selectedNodes.value = props.targetKeys?.map((item: any) => ({
        label: item[label],
        value: item[value]
      }))
      leftState.checkedKeys = selectedNodes.value?.map((data: any) => data.value)
      emits('update:targetKeys', selectedNodes.value) // 同步父组件数据，保持数据结构一致
    }
  }
)

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
<style lang="less" scoped>
.transfer-checked-item {
  line-height: 20px;
  padding: 6px 0px;
  word-break: break-word;
  white-space: break-spaces;
  &:hover {
    background: var(--gray-global-bg-color);
  }
  .delete-icon {
    cursor: pointer;
  }
}
</style>
