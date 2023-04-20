<template>
  <div class="ant-transfer-list">
    <a-checkbox 
      v-model:checked="state.allChecked" 
      :indeterminate="state.indeterminate"
      @change="onCheckAllChange">可选标签</a-checkbox>
    <a-input-search class="my-2" placeholder="请输入搜索内容"></a-input-search>
    <ul style="height: calc(100% - 40px); overflow: auto" @scroll="onScroll">
        <a-checkbox-group 
          v-model:value="state.checkedList" 
          :options="dataSource"
          @change="onChange">
        </a-checkbox-group>
    </ul>
  </div>
</template>
<script setup lang="ts">
const props = defineProps({
  dataSource: {
    type: Array as PropType<SelectOption[]>,
    default: () => []
  }
})

const emits = defineEmits(['change', 'scroll'])
const state = reactive({
  allChecked: false,
  indeterminate: false,
  checkedList: [] as Array<string | number>
})

const onCheckAllChange = (e: any) => {
  state.checkedList = e.target.checked ? props.dataSource.map(v => v.value) : []
  state.indeterminate = false
  emits('change', state.checkedList)
}

const onScroll = () => emits('scroll')
const onChange = () => emits('change', state.checkedList)

watch(
  () => state.checkedList,
  val => {
    const length = props.dataSource?.length || 0
    state.indeterminate = !!val.length && (val.length < length)
    state.allChecked = val.length === length
  },
);
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