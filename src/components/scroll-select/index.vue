<template>
  <a-select
    ref="self"
    v-model:value="innerValue"
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
import { throttle} from 'lodash'
import { isEmpty } from '@/utils/tools'

const props = defineProps({
  value: {
    type: Array<String> || String
  },
  api: {
    type: Function
  },
  query: {
    type: Object,
    default: () => ({})
  },
  fieldNames: {
    type: Object as PropType<FieldNames>,
    default: () => ({ label: 'name', value: 'id', apiField: ''})
  },
  maxlength: {
    type: Number,
    default: () => 9
  }
})
const emits = defineEmits(['update:value'])
const attrs = useAttrs()
const currentPage = ref(1) // 分页load选项
const isAllLoaded = ref(false)
const hasDefaultValue = ref(true)
const options = ref<OptionProps>([])
let searchValue = ''

// 根据defaultValue是否为空，判断是否需要加‘全部’的option
// 一般在列表页搜索时需要加，在编辑页是不需要加
const self = ref()
const initOptions = () => {
  options.value = []

  const defaultValue = attrs.defaultValue
  const hasAllOption = defaultValue === '' || (Array.isArray(defaultValue) && defaultValue.toString() === '')
 
  if(hasAllOption) {
    if(props.api) {
      options.value.push({ label: '全部', value: '' })
    } else {
      const attrsOptions = useAttrs().options as any
      if(!attrsOptions.find((item: any) => item.label === '全部')) {
        attrsOptions.unshift({ label: '全部', value: '' })
      }
    }
  }
}

const filterOption = (input: string, option: any) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
}

// 滚动分页查询
const onScroll = (e: any) => {
  if (props.api && !isAllLoaded.value) {
    const { target } = e
    if (target.scrollTop + target.offsetHeight >= (target.scrollHeight - 50) && !loading.value) {
      currentPage.value = currentPage.value + 1
      getOptions()
    }
  }
}

// 搜索查询数据
const onSearch = throttle((input: string) => {
  if (props.api) {
    currentPage.value = 1
    options.value = []
    searchValue = input
    if(searchValue == '') {
      initOptions()
    }
    getOptions()
  }
}, 800, { leading: false})

// 重新获取数据
const onFocus = () => {
  // if (props.api) {
  //   currentPage.value = 1
  //   options.value = []
  //   initOptions()
  //   getOptions()
  // }
}

// 为了实现选中个数的限制
// 双向同步数据, 
const innerValue = ref()
watch(() => props.value,
 () => {
   innerValue.value = props.value
   if(isEmpty(props.value)) {
    // 重置时清空数据并初始化下拉选项
    searchValue = ''
    initOptions()
    getOptions()
   }
 })

const onChange = () => {
  hasDefaultValue.value = false  // 值从父组件传过来时触发getDefaultOptions，内部的更改则不触发
  // 最多选择多少个
  if(!Array.isArray(innerValue.value) || innerValue.value.length <= props.maxlength) {
    emits('update:value', innerValue.value)
  }
}

const loading = ref(false)
const getOptions = async () => {
  if (props.api) {
    try {
      loading.value = true
      const res = await props.api({ 
        ...props.query, 
        page: currentPage.value, size: 10, 
        [props.fieldNames.label]: searchValue })
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
    const values = Array.isArray(props.value) ? props.value : [props.value || '']
    values.forEach(async (value: String) => {
      const isExistInOptions = options.value.find((item: any) => item.value == value)
      if (props.api && !isExistInOptions) {
        const res = await props.api({ [props.fieldNames.value]: value })
        options.value.push(...transformOption(res))
      }
    })
  }
}

const transformOption = (response: RObject) => {
  const { label, value, apiField = '' } = props.fieldNames
  const results = response.results || response.datalist || response[apiField] || response
  let newOptions = results.map((item: any) => ({
    label: item[label],
    value: item[value]
  }))
  // 过滤掉列表中已存在的项
  newOptions = newOptions.filter((item: SelectOption) => !options.value.find((option: SelectOption) => option.value === item.value))
  return newOptions || []
}

// 仅仅初始化时回写数据
watchOnce(
  () => props.value, 
  () => {
    if(hasDefaultValue.value && props.value) {
      getDefaultOptions()
    }
  }
)

watch(
  () => props.api,
  () => {
    options.value = []
    currentPage.value = 1
    getOptions()
  }
)
initOptions()
getOptions()
</script>
