<template>
  <a-select
    :options="options"
    placeholder="请选择"
    showSearch
    :filter-option="filterOption"
    @search="onSearch"
    @focus="onFocus"
    @popupScroll="onScroll"
  >
  </a-select>
</template>
<script setup lang="ts">
import { OptionProps } from 'ant-design-vue/lib/select'
import type { PropType } from 'vue'
import { watchOnce } from '@vueuse/core'

const props = defineProps({
  api: {
    type: Function
  },
  fieldNames: {
    type: Object as PropType<FieldNames>,
    default: () => ({ label: 'name', value: 'id' })
  }
})
const attrs = useAttrs()
const allOption = { label: '全部', value: '' }
const currentPage = ref(1) // 分页load选项
const isAllLoaded = ref(false)
const options = ref<OptionProps>([])

// 根据defaultValue是否为空，判断是否需要加‘全部’的option
// 一般在列表页搜索时需要加，在编辑页是不需要加
const initOptions = () => {
  options.value = []

  const defaultValue = attrs.defaultValue
  const hasAllOption = defaultValue === '' || (Array.isArray(defaultValue) && defaultValue.toString() === '')
  hasAllOption && options.value.push(allOption)
}

const filterOption = (input: string, option: any) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
}

const getOptions = async (query: string = '') => {
  if (props.api) {
    const res = await props.api({ page: currentPage.value, [props.fieldNames.label]: query })
    const { fieldNames } = props
    const results = res.results || res.datalist || res
    const newOptions = results.map((item: any) => ({
      label: item[fieldNames.label],
      value: item[fieldNames.value]
    }))
    options.value.push(...newOptions)
    isAllLoaded.value = options.value.length >= res.count
  }
}

const onScroll = (e: any) => {
  if (props.api && !isAllLoaded.value) {
    const { target } = e
    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      currentPage.value = currentPage.value + 1
      getOptions()
    }
  }
}

// 搜索查询数据
const onSearch = (input: string) => {
  if (props.api) {
    currentPage.value = 1
    options.value = []
    getOptions(input)
  }
}

// 重新获取数据
const onFocus = () => {
  if (props.api) {
    currentPage.value = 1
    initOptions()
    getOptions()
  }
}

// 分页时，默认选中项可能不是第一页的数据，需要单独加载
const getDefaultOptions = async () => {
  if (props.api) {
    // 统一转换成多选，方便处理
    const values = Array.isArray(attrs.value) ? attrs.value : [attrs.value || '']
    const { label, value } = props.fieldNames
    values.forEach(async (data: string) => {
      if (props.api) {
        const res = await props.api({ [value]: data })
        const results = res.results || res.datalist || res
        const newOptions = results.map((item: any) => ({
          label: item[label],
          value: item[value]
        }))

        options.value.push(...newOptions)
      }
    })
  }
}
// 仅仅初始化时回写
watchOnce(() => attrs.value, getDefaultOptions)

initOptions()
getOptions()
</script>
