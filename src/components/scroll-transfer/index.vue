<template>
 <a-transfer
    show-search
    v-model:target-keys="targetKeys"
    :data-source="dateSource"
    :titles="['可用标签', '选中标签']"
    :render="(item: any) => item.title"
    @scroll="onScroll"
    @search="onSearch"
  />
</template>
<script setup lang="ts">
import { debounce } from '@/utils/tools'

const props = defineProps({
  api: {
    type: Function
  },
  labelKey: { // 返回值label对应的key
    type: String,
    default: () => 'name'
  }
})

const targetKeys = ref<string[]>([])
const dateSource = ref<{key: string, title: string}[]>([]);
const currentPage = ref(1)
const isAllLoaded = ref(false)

const getOptions = async (name: string = '') => {
  if(props.api) {
    const res = await props.api({ name, page: currentPage.value })
    const newOptions = res.results.map((item: any) => ({ 
      title: item[props.labelKey],
      key: item.id
    }))
    dateSource.value.push(...newOptions)
    isAllLoaded.value = dateSource.value.length >= res.count
  }
}

const onScroll = debounce((direction: string, e: any) => {
  if(props.api && !isAllLoaded.value) {
    const { target } = e
    if(target.scrollTop + target.offsetHeight === target.scrollHeight) {
      currentPage.value = currentPage.value + 1
      getOptions()
    }
  }
})

const onSearch = debounce((direction: string, value: string) => {
  if(direction == 'left') {
    dateSource.value = []
    currentPage.value = 1
    getOptions(value)
  } else {
    targetKeys.value = targetKeys.value.filter(v => v.indexOf(value) > -1)
  }
})

getOptions()
</script>