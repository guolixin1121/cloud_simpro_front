<template>
  <a-select
    :options="options"
    placeholder="请选择"
    @popupScroll="onScroll">>
  </a-select>
</template>
<script setup lang="ts">
import { OptionProps } from 'ant-design-vue/lib/select';

const props = defineProps({
  api: {
    type: Function
  },
})

const currentPage = ref(1)
const isAllLoaded = ref(false)
const options = ref<OptionProps>([])
const getOptions = async () => {
  if(props.api) {
    const res = await props.api({ page: currentPage.value })
    const newOptions = res.results.map((item: any) => ({ 
      label: item.name,
      value: item.id
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
    }
  }
}

watchEffect(getOptions)
</script>