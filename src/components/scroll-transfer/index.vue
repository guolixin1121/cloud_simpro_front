<template>
  <div class="ant-transfer">
    <a-form-item-rest>
      <list
        ref="leftListRef"
        :title="titles[0]"
        :dataSource="leftDataSource"
        @select="onLeftSelect"
        @search="onLeftSearch"
        @scroll="onScroll"
      ></list>

      <div class="ant-transfer-operation">
        <button
          :disabled="!leftSelectedValues.length"
          v-on:click.prevent="addToRight"
          class="ant-btn ant-btn-primary ant-btn-sm ant-btn-icon-only"
        >
          >
        </button>
        <button
          :disabled="!rightSelectedValues.length"
          v-on:click.prevent="addToLeft"
          class="ant-btn ant-btn-primary ant-btn-sm ant-btn-icon-only"
        >
          &lt;
        </button>
      </div>

      <list
        ref="rightListRef"
        :title="titles[1]"
        :dataSource="rightDataSource"
        @search="onRightSearch"
        @select="onRightSelect"
      ></list>
    </a-form-item-rest>
  </div>
</template>
<script setup lang="ts">
import { watchOnce } from '@vueuse/core'
import List from './list.vue'

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

let leftSearchText = ''
const leftListRef = ref()
const leftDataSource = ref<SelectOption[]>([]) // 左侧列表数据
const leftSelectedValues = ref<SelectOption[]>([]) // 左侧选中数据

const rightListRef = ref()
const rightDataSource = ref<SelectOption[]>([])
const rightSelectedValues = ref<SelectOption[]>([])

const rightDataSourceBackup = ref<SelectOption[]>([])
const dataSourceFromApi = ref<SelectOption[]>([]) // 左侧全部列表数据。从接口获取
const isWriteBack = ref() // 是否是回写

const onLeftSelect = (data: SelectOption[]) => (leftSelectedValues.value = data)
const onRightSelect = (data: SelectOption[]) => (rightSelectedValues.value = data)

const addToRight = () => {
  rightDataSource.value = [...leftSelectedValues.value, ...rightDataSource.value]
  rightDataSourceBackup.value = rightDataSource.value

  // 右侧数据是用户手动添加的，不再需要反写
  isWriteBack.value = false
}
const addToLeft = () => {
  rightDataSource.value = removeOptions(rightDataSource.value, rightSelectedValues.value)
  rightDataSourceBackup.value = rightDataSource.value
}

const removeOptions = (source: SelectOption[], removedData: SelectOption[]) => {
  return source.filter((item: SelectOption) => !removedData.find(rItem => rItem.value === item.value))
}

// 分页获取数据
const page = ref(1)
const isAllLoaded = ref(false)
const getOptions = async () => {
  if (props.api) {
    const res = await props.api({ page: page.value, size: 10,  [props.fieldNames.label]: leftSearchText })
    const { label, value, apiField } = props.fieldNames
    const results = res.results ||  res[apiField] || res
    const newOptions = results.map((item: any) => ({
      label: item[label],
      value: item[value]
    }))

    dataSourceFromApi.value.push(...newOptions)
    isAllLoaded.value = dataSourceFromApi.value.length >= (res.count || res.length)

    if(isWriteBack.value) {
      setDefaultOptions()
    }
  }
}

// 分页回写时，默认选中项可能不是第一页的数据
// 为每个默认value值调用接口获取{label，value}放到右侧列表
const setDefaultOptions = async () => {
  if (props.api) {
    const targetKeys = props.targetKeys || []
    const { label, value, apiField } = props.fieldNames

    targetKeys.forEach(async (key: String) => {
      let options = dataSourceFromApi.value.filter((item: any) => item.value == key)
      if (props.api && !options.length) {
        const res = await props.api({ [value]: key })
        const results = res.results ||  res[apiField] || res
        options = results.map((item: any) => ({
          label: item[label],
          value: item[value]
        }))
      }
      // 右侧数据
      rightDataSource.value.push(...options)
      rightDataSourceBackup.value = rightDataSource.value
      isWriteBack.value = false

      // 左侧数据不够一屏，继续加载数据，确保滚动条出现
      if (rightDataSource.value.length === targetKeys.length && !isAllLoaded.value) {
        page.value++
        getOptions()
      }
    })
  }
}

// 仅用于回写
watchOnce(
  () => props.targetKeys,
  () => isWriteBack.value = true
)

// 发送数据给父组件
watch(rightDataSource, () => {
  const newTargetKeys = rightDataSource.value.map((v: SelectOption) => v.value)
  emits('update:targetKeys', newTargetKeys)
})

// 左侧数据 = 从所有数据中过滤掉右侧数据
watchEffect(() => {
  const isInRightList = (item: SelectOption) => rightDataSource.value.find(rItem => rItem.value === item.value)
  leftDataSource.value = dataSourceFromApi.value.filter((item: SelectOption) => !isInRightList(item))

  // clear data
  leftSelectedValues.value = []
  rightSelectedValues.value = []
  leftListRef.value?.clear()
  rightListRef.value?.clear()
})

const onScroll = (e: any) => {
  if (props.api && !isAllLoaded.value) {
    const { target } = e
    if (target.scrollTop + target.offsetHeight == target.scrollHeight) {
      page.value = page.value + 1
      getOptions()
    }
  }
}

// 搜索查询数据
const onLeftSearch = (input: string) => {
  if (props.api) {
    leftSearchText = input
    page.value = 1
    dataSourceFromApi.value = []
    // leftDataSource.value = []
    getOptions()
  }
}
// 右侧仅查询
const onRightSearch = (input: string) => {
  rightDataSource.value = rightDataSourceBackup.value.filter((v: SelectOption) => v.label.indexOf(input) > -1)
}

getOptions()
</script>
