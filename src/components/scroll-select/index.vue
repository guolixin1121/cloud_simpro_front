<template>
  <a-select
    :options="options"
    placeholder="请选择"
    showSearch
    :not-found-content="loading ? '数据加载中...' :'暂无数据'"
    :filter-option="filterOption"
    @search="onSearch"
    @focus="onFocus"
    @popupScroll="onScroll"
    @change="onChange"
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
    default: () => ({ label: 'name', value: 'id', apiField: '', sublabel: '' })
  }
})
const attrs = useAttrs()
const currentPage = ref(1) // 分页load选项
const isAllLoaded = ref(false)
const hasDefaultValue = ref(true)
const options = ref<OptionProps>([])

// 根据defaultValue是否为空，判断是否需要加‘全部’的option
// 一般在列表页搜索时需要加，在编辑页是不需要加
const initOptions = () => {
  options.value = []

  const defaultValue = attrs.defaultValue
  const hasAllOption = defaultValue === '' || (Array.isArray(defaultValue) && defaultValue.toString() === '')
  hasAllOption && options.value.push({ label: '全部', value: '' })
}

const filterOption = (input: string, option: any) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
}

// 滚动分页查询
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
  // if (props.api) {
  //   currentPage.value = 1
  //   options.value = []
  //   initOptions()
  //   getOptions()
  // }
}

// 值从父组件传过来时触发getDefaultOptions，内部的更改则不触发
const onChange = () => hasDefaultValue.value = false

const loading = ref(false)
const getOptions = async (query: string = '') => {
  if (props.api) {
    try {
      loading.value = true
      const res = await props.api({ page: currentPage.value, size: 10, [props.fieldNames.label]: query })
      options.value.push(...transformOption(res))
      isAllLoaded.value = options.value.length >= (res.count || res.length)
    } finally {
      loading.value = false
    }
  }
}

/**** 分页时的数据回写，默认选中项可能不是第一页 ****/
const getDefaultOptions = async () => {
  if (props.api) {
    // 统一转换成多选，方便处理
    const values = Array.isArray(attrs.value) ? attrs.value : [attrs.value || '']
    values.forEach(async (data: string) => {
      const isExistInOptions = options.value.find((item: any) => item.value == data)
      if (props.api && !isExistInOptions) {
        const res = await props.api({ [props.fieldNames.value]: data })
        options.value.push(...transformOption(res))
      }
    })
    // hasDefaultValue.value = false
  }
}

const transformOption = (response: RObject) => {
  const { label, value, sublabel, apiField = '' } = props.fieldNames
  const results = response.results || response.datalist || response[apiField] || response
  let newOptions = results.map((item: any) => ({
    label: item[label] + (sublabel ? ('_' + item[sublabel]) : ''),
    value: item[value]
  }))
  // 过滤掉列表中已存在的项
  newOptions = newOptions.filter((item: SelectOption) => !options.value.find((option: SelectOption) => option.value === item.value))
  return newOptions || []
}

// 仅仅初始化时回写数据
watchOnce(
  () => attrs.value, 
  () => {
    if(hasDefaultValue.value) {
      getDefaultOptions()
    }
  }
)

watch(
  () => props.api,
  () => {
    options.value = []
    getOptions()
  }
)

initOptions()
getOptions()
</script>
