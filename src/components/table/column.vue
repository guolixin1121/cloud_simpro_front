<template>
  <template v-if="dataIndex == 'index'">
    {{ (pagination.current -1) * pagination.size + scope.index + 1}}
  </template>
  <!-- 封装操作列 -->
  <template v-if="dataIndex == 'actions'">
    <Action :scope="scope" :is-only-creator="isOnlyCreator" @refresh="emits('refresh')"></Action>
  </template>
  <!-- 值为时间：格式化时间 -->
  <template v-else-if="isDateColumn(dataIndex)">
    {{ dataValue ? dayjs(dataValue).format('YYYY-MM-DD HH:mm:ss') : '' }}
  </template>
  <!-- 值为对象：获取name -->
  <template v-else-if="isObject(dataValue)">
    {{ dataValue[column.apiField] || dataValue.name }}
  </template>
  <!-- 值为数组： 默认获取name值，可通过label指定字段 -->
  <template v-else-if="Array.isArray(dataValue)">
    <a-tooltip :title="dataValue.map((d: any) => d[column.apiField]|| d.name).join('  ')">
      <span v-for="label in dataValue" :key="label.id" class="text-blue mr-2">
        {{ label[column.apiField] || label.name }}
      </span>
    </a-tooltip>
  </template>
  <!-- 自定义格式化函数 -->
  <template v-else-if="column.formatter">
    {{ column.formatter(dataValue) }}
  </template>
  <!-- 默认列 -->
  <!-- hover时加tooltip -->
  <template v-else-if="dataIndex != 'actions'">
    <a-tooltip :title="dataValue">
      {{ dataValue }}
    </a-tooltip>
  </template>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { isObject } from '@/utils/validate'
import Action from './action.vue'

const props = defineProps(['scope', 'isOnlyCreator', 'pagination'])
const emits = defineEmits(['refresh'])

const column = computed(() => props.scope?.column)
const dataIndex = computed(() => props.scope?.column.dataIndex)
const dataValue = computed(() => props.scope?.record[dataIndex.value])

const isDateColumn = (column: string) => {
  return column.indexOf('_time') > -1 || column.indexOf('Time') > -1 || column.indexOf('_date') > -1 || column.indexOf('Date') > -1 
}
</script>
