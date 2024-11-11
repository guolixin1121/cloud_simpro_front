<template>
  <div class="ant-transfer">
    <a-form-item-rest>
      <div class="ant-transfer-list">
        <div class="ant-transfer-list-title flex justify-between">
          <span>{{ titles[0] }}</span>
          <!-- <span class=" text-link cursor-pointer" @click="() => onCheckedAll()">全选</span> -->
        </div>
        <a-input-search placeholder="请输入搜索内容" allowClear @search="onSearch" @pressEnter="onSearch"></a-input-search>
        <div class="scroll-box" style="height: calc(100% - 40px);" @scroll="(e: Event) => onScroll(e)">
          <a-spin :spinning="loading" style="width: 100%; padding-top: 20px"></a-spin>
          <a-checkbox-group v-model:value="leftState.checkedKeys" @change="onChecked">
            <template v-for="item in leftState.dataSource" :key="item.key" >
              <div class="checkbox-container">
                <a-checkbox style="width: calc(100% - 24px)" class="ant-checkbox-group-item" :value="item.value" >
                    {{ item.label }}
                </a-checkbox>
                <a-tooltip placement="topLeft" :title="item.desc" v-if="item.desc">
                    <img src="../../../assets/images/tip.png" class="ml-1 cursor-pointer" style="height: 16px;"/>
                </a-tooltip>
              </div>
              </template>
          </a-checkbox-group>
        </div>
      </div>
      <!-- 右侧 -->
      <div class="ant-transfer-list">
        <div class="ant-transfer-list-title flex justify-between">
          <span>{{ titles[1] }}</span>
          <span class="text-link cursor-pointer" @click="onRemoveAll">删除全部</span>
        </div>
        <div class="scroll-box scroll-box-right" style="height: calc(100% - 40px)">
          <ul>
            <li class="transfer-checked-item flex justify-between items-center" v-for="item in selectedNodes" :key="item.value">
              <div style="width: 70%">{{ item.name }}</div>
              <div>
                <template v-if="item.threshold?.threshold_type == 0">
                  <div class="flex">
                    <a-input-number size="small" v-model:value="item.threshold.threshold_min" :max="item.threshold.threshold_max" />
                    <img src="../../../assets/images/icon_to.png" class="mx-2" />
                    <a-input-number size="small" v-model:value="item.threshold.threshold_max" :min="item.threshold.threshold_min" />
                  </div>
                </template>
                <template v-if="item.threshold?.threshold_type == 1">
                  <div class="flex">
                    <img src="../../../assets/images/icon_dayu.png" style="width: 16px"/>
                    <a-input-number size="small" v-model:value="item.threshold.threshold_min" />
                  </div>
                </template>
                <template v-if="item.threshold?.threshold_type == 2">
                  <div class="flex">
                    <img src="../../../assets/images/icon_xiaoyu.png" style="width: 16px"/>
                    <a-input-number size="small" v-model:value="item.threshold.threshold_max" />
                  </div>
                </template>
                <template v-if="item.threshold?.threshold_type == 3">
                  <div class="flex">
                    <span class="ml-1" style="width: 16px">=</span>
                    <a-input-number size="small" v-model:value="item.threshold.threshold_value" />
                  </div>
                </template>
                <!-- <template v-if="item.threshold?.threshold_type == 4">
                  <a-select size="small" v-model:value="item.threshold.threshold_value">
                    <a-select-option key="1" :value="1">是</a-select-option>
                    <a-select-option key="0" :value="0">否</a-select-option>
                  </a-select>
                </template> -->
              </div>
              <div>{{ item.threshold?.threshold_unit }}</div>
              <svg-icon icon="close" class="text-gray-400 cursor-pointer" @click="onRemove(item)" />
            </li>
          </ul>
        </div>
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
        value: item[value],
        ...item
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        ...item,
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
<style lang="less">
.ant-transfer-list {
  .ant-input,
  .ant-input-number,
  .ant-select .ant-select-selector {
    border-top: 0;
    border-left: 0;
    border-right: 0;
  }
}
</style>
<style lang="less" scoped>
.transfer-checked-item {
  line-height: 20px;
  padding: 6px 12px;
  word-break: break-word;
  white-space: break-spaces;
  margin-top: 2px;
  &:hover {
    background: var(--gray-global-bg-color);
  }
  .delete-icon {
    cursor: pointer;
  }
  img {
    height: 16px;
  }
  > div:first-child {
    width: 35%;
  }
  > div:nth-child(2) {
    width: 35%;
  }
  > div:nth-child(3) {
    width: 30%;
    margin-left: 10px;
  }
  .flex {
    align-items: center;
  }
}
</style>
