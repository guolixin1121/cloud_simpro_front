<template>
 <div class="ant-transfer">
    <list :dataSource="leftDataSource" @change="onLeftChange"></list>

    <div class="ant-transfer-operation">
       <button :disabled="!leftValues.length" v-on:click.prevent="addToRight"
         class="ant-btn ant-btn-primary ant-btn-sm ant-btn-icon-only">></button>
       <button :disabled="!rightValues.length" v-on:click.prevent="addToLeft"
         class="ant-btn ant-btn-primary ant-btn-sm ant-btn-icon-only">&lt;</button>
    </div>
    <list :dataSource="rightDataSource" @change="onRightChange"></list>
 </div>
</template>
<script setup lang="ts">
import List from './list.vue'

defineProps({
  api: {
    type: Function
  },
  dataSource: {
   type: Array<SelectOption>
  },
  targetKeys: {
    type: Array
  },
  fieldNames: {
    type: Object as PropType<FieldNames>,
    default: () => ({ label: 'name', value: 'id'})
  }
})

const leftValues = ref<SelectOption[]>([])
const rightValues = ref<SelectOption[]>([])
const leftDataSource = ref<SelectOption[]>([ 
    { label: 5, value: 5},
    { label: 6, value: 6},
    { label: 7, value: 7}
 ])
const rightDataSource = ref<SelectOption[]>([
    { label: 1, value: 1},
    { label: 2, value: 2},
    { label: 3, value: 3},
    { label: 4, value: 4},
])

const onLeftChange = (data: SelectOption[]) => leftValues.value = data
const onRightChange = (data: SelectOption[]) => rightValues.value = data
const addToRight = () => {
   leftDataSource.value = filterOptions(leftDataSource.value, leftValues.value)
   rightDataSource.value.push(...leftValues.value)
}
const addToLeft = () => {
   rightDataSource.value = filterOptions(rightDataSource.value, rightValues.value)
   leftDataSource.value.push(...rightValues.value)
}

const filterOptions = (source: SelectOption[], removedData: SelectOption[] ) => {
   return source.filter((item: SelectOption) => removedData.indexOf(item.value as any) == -1)
}
</script>