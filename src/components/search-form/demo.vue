<template>
  <search-form :items="formItems" :loading="loading" @on-search="onSearch"></search-form>
</template>

<script setup lang="ts">
import SearchForm from '@/components/search-form/index.vue'

let loading = ref(false)

// eslint-disable-next-line no-undef
const formItems: SearchFormItem[] = [
  { label: '姓名', key: 'name', type: 'input', pressEnter: () => console.log(111)},
  { label: '场景', key: 'scene', type: 'select', options: [{ label: '全部', value: '' }, { label: '场景一', value: 'scene1' }, { label: '场景二', value: 'scene2'}], defaultValue: ''},
  { label: '标签', key: 'tag', type: 'select', mode: 'multiple', options: [{ label: '全部', value: '' }, { label: '车架', value: '1' }, { label: '车身', value: '2'}], defaultValue: ['']},
  { label: '创建时间', key: 'date', type: 'range-picker' }
]

const onSearch = (query: Record<string, any>) => {
  // query自动包含start_data, end_date
  console.log('search with query: ', query)

  loading.value = true
  setTimeout(() => { 
    // reset loading after search
    loading.value = false 
  }, 1000);
}
</script>
