<template>
  <a-select
    :options="options"
    placeholder="请选择"
    showSearch
    :filter-option="filterOption"
    @search="onSearch"
    @blur="onBlur"
    @popupScroll="onScroll">
  </a-select>
</template>
<script setup lang="ts">
import { OptionProps } from 'ant-design-vue/lib/select';
import type { PropType } from 'vue';
import { debounce } from '@/utils/tools'

// 自定义字段
interface FieldName {
  label: string,
  value: string
}
const props = defineProps({
  api: {
    type: Function
  },
  fieldNames: {
    type: Object as PropType<FieldName>,
    default: () => ({ label: 'name', value: 'id'})
  }
})

const currentPage = ref(1)
const isAllLoaded = ref(false)
const options = ref<OptionProps>([{ label: '全部', value: ''}])

const filterOption = (input: string, option: any) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const getOptions = async (query: string = '') => {
  if(props.api) {
    const res = await props.api({ page: currentPage.value, [props.fieldNames.value]: query })
    const { fieldNames } = props
    const newOptions = res.results.map((item: any) => ({ 
      label: item[fieldNames.label],
      value: item[fieldNames.value]
    }))

    options.value.push(...newOptions)
    isAllLoaded.value = options.value.length >= res.count
  }
}

const onScroll = (e: any) => {
  if(props.api && !isAllLoaded.value) {
    const { target } = e
    if(target.scrollTop + target.offsetHeight === target.scrollHeight) {
      currentPage.value = currentPage.value + 1
      getOptions()
    }
  }
}

const onSearch = debounce((input: string) => {
  if(props.api) {
    currentPage.value = 1
    options.value = []
    getOptions(input)
  }
})

// 重新获取全量数据
const onBlur = debounce(() => {
  if(props.api) {
    currentPage.value = 1
    options.value = [{ label: '全部', value: ''}]
    getOptions()
  }
})

getOptions()
</script>