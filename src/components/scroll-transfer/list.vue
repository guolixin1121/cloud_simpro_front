<template>
  <div class="ant-transfer-list">
    <a-checkbox 
      v-if="showAllChecked"
      v-model:checked="state.allChecked" 
      :indeterminate="state.indeterminate"
      @change="onCheckAllChange">{{ title }}</a-checkbox>
    <div v-else class=" mt-1 ml-2">{{ title }}</div>
    <a-input-search class="my-2" placeholder="请输入搜索内容" allowClear 
      @search="onSearch"
      @pressEnter="onSearch"></a-input-search>
    <div style="height: calc(100% - 40px); overflow: auto" 
      @scroll="(e: Event) => onScroll(e)">
      <a-checkbox-group 
        v-model:value="state.checkedList" 
        :options="dataSource"
        @change="onChange">
      </a-checkbox-group>
      <a-spin v-if="loading" style="width: 100%; padding-top: 20px"></a-spin>
    </div>
  </div>
</template>
<script setup lang="ts">
import "ant-design-vue/es/transfer/style/index.css"

const emits = defineEmits(['select', 'scroll', 'search'])
const props = defineProps({
  title: {
    type: String,
  },
  dataSource: {
    type: Array as PropType<SelectOption[]>,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: () => false
  },
  showAllChecked: {
    type: Boolean,
    default: () => true
  }
})
const state = reactive({
  allChecked: false,
  indeterminate: false,
  checkedList: [] as Array<string | number | undefined>
})

const onCheckAllChange = (e: any) => {
  state.checkedList = e.target.checked ? props.dataSource.map(v => v.value) : []
  state.indeterminate = false
  emitSelect()
}

const onScroll = (e: Event) => emits('scroll', e)
const onChange = () => emitSelect()
const onSearch = (text: string) => emits('search', text)

watch(
  () => state.checkedList,
  val => {
    const length = props.dataSource?.length || 0
    state.indeterminate = !!val.length && (val.length < length)
    state.allChecked = length > 0 && val.length === length
  },
)
watch(() => props.dataSource, () => state.indeterminate = false)

const emitSelect = () => {
  const checkedList = state.checkedList.map(value => props.dataSource.find(v => v.value === value))
  emits('select', checkedList)
}

const clear = () => state.checkedList = []
defineExpose({ clear })
</script>

<style lang="less">
.ant-transfer-list {
  padding: 8px 12px;
}
.ant-checkbox-wrapper {
  display: flex;
  margin-top: 4px;
}
</style>