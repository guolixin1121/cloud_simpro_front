<template>
  <div class="ant-transfer">
    <a-form-item-rest>
      <list
        ref="leftListRef"
        :title="titles[0]"
        :dataSource="leftDataSource"
        :showAllChecked="false"
        :loading="loading"
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
const leftDataSource = ref<SelectOption[]>([]) // 左侧列表展示数据
const leftSelectedValues = ref<SelectOption[]>([]) // 左侧列表选中数据

const rightListRef = ref()
const rightDataSource = ref<SelectOption[]>([])
const rightSelectedValues = ref<SelectOption[]>([])

const rightAllDataSource = ref<SelectOption[]>([]) // 右侧全部数据
const allDataSource = ref<SelectOption[]>([]) // 全部数据
let hasDefaultValue = true // 是否是回写

const onLeftSelect = (data: SelectOption[]) => (leftSelectedValues.value = data)
const onRightSelect = (data: SelectOption[]) => (rightSelectedValues.value = data)

const addToRight = () => {
  rightAllDataSource.value = [...leftSelectedValues.value, ...rightAllDataSource.value]

  // 右侧数据是用户手动添加的，不再需要反写
  hasDefaultValue = false
}
const addToLeft = () => {
  rightAllDataSource.value = rightAllDataSource.value.filter((item: SelectOption) => !rightSelectedValues.value.find(rItem => rItem.value === item.value))
}

// 分页获取数据
let page = 1
let isAllLoaded = false
let loading = ref(false)
const getOptions = async () => {
  if (props.api) {
    loading.value = true
    const { label, value, apiField } = props.fieldNames
    const res = await props.api({ page, size: 10, [label]: leftSearchText })
    const results = res.results ||  res[apiField] || res
    const newOptions = results.map((item: any) => ({
      label: item[label],
      value: item[value]
    }))

    loading.value = false
    allDataSource.value.push(...newOptions)
    isAllLoaded = allDataSource.value.length >= (res.count || res.length)
  }
}

// 设置默认值，没有的数据从接口获取
const setDefaultOptions = async () => {
  if (props.api) {
    const targetKeys = props.targetKeys || []
    const { label, value, apiField } = props.fieldNames

    targetKeys.forEach(async (key: String) => {
      let options = allDataSource.value.filter((item: any) => item.value == key)
      if (props.api && !options.length) {
        const res = await props.api({ [value]: key })
        const results = res.results ||  res[apiField] || res
        options = results.map((item: any) => ({
          label: item[label],
          value: item[value]
        }))
      }
      rightAllDataSource.value.push(...options)
    })
  }
}

// 仅用于回写
watchOnce(
  () => props.targetKeys,
  () => hasDefaultValue && setDefaultOptions()
)

// 发送数据给父组件
watch(rightAllDataSource, () => {
  const newTargetKeys = rightAllDataSource.value.map((v: SelectOption) => v.value)
  emits('update:targetKeys', newTargetKeys)
})

// 左侧数据 = 从所有数据中过滤掉右侧数据
watchEffect(() => {
  rightDataSource.value = rightAllDataSource.value

  const isInRightList = (item: SelectOption) => rightAllDataSource.value.find(rItem => rItem.value === item.value)
  leftDataSource.value = allDataSource.value.filter((item: SelectOption) => !isInRightList(item))

  // clear data
  leftSelectedValues.value = []
  rightSelectedValues.value = []
  leftListRef.value?.clear()
  rightListRef.value?.clear()

  // 左侧数据不够一屏，继续加载数据，确保滚动条出现
  const leftLength = leftDataSource.value.length
  if (leftLength > 0 && leftLength < 10 && !isAllLoaded) {
    page++
    getOptions()
  }
})

const onScroll = (e: any) => {
  if (props.api && !isAllLoaded) {
    const { target } = e
    console.log(target.scrollTop + target.offsetHeight == target.scrollHeight)
    if (target.scrollTop + target.offsetHeight == target.scrollHeight) {
      page = page + 1
      getOptions()
    }
  }
}

watch(
  () => props.api,
  () => {
    allDataSource.value = []
    getOptions()
  }
)

// 搜索查询数据
const onLeftSearch = (input: string) => {
  if (props.api) {
    leftSearchText = input
    page = 1
    allDataSource.value = []
    getOptions()
  }
}
// 右侧仅查询
const onRightSearch = (input: string) => {
  rightDataSource.value = rightAllDataSource.value.filter((v: SelectOption) => v.label.indexOf(input) > -1)
}

getOptions()
</script>
