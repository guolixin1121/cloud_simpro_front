<template>
  <!-- 封装操作列 -->
  <template v-if="dataIndex == 'actions'">
    <Action :scope="scope" :is-only-creator="isOnlyCreator" @delete="() => emits('refresh')"></Action>
  </template>
  <!-- 值为时间：格式化时间 -->
  <template v-else-if="dataIndex?.toLowerCase().indexOf('time') > -1 || dataIndex?.toLowerCase().indexOf('date') > -1">
    {{ dataValue ? dayjs(dataValue).format('YYYY-MM-DD HH:MM:ss') : '' }}
  </template>
  <!-- 值为对象：获取name -->
  <template v-else-if="isObject(dataValue)">
      {{ dataValue[column.label] || dataValue.name }}
  </template>
  <!-- 值为数组： 默认获取name值，可通过label指定字段 -->
  <template v-else-if="Array.isArray(dataValue)">
    <a-tooltip :title="dataValue.map((d: any) => d[column.label]|| d.name).join('  ')">
      <span v-for="label in dataValue" :key="label.id" class="text-blue mr-2">
        {{ label[column.label] || label.name }}
      </span>
    </a-tooltip>
  </template>
  <!-- 自定义格式化函数 -->
  <template v-else-if="column.formatter">
    {{ column.formatter(dataValue)  }}
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

const props = defineProps(['scope', 'isOnlyCreator'])
const emits = defineEmits(['refresh'])

const column = computed(() => props.scope?.column)
const dataIndex = computed(() => props.scope?.column.dataIndex)
const dataValue = computed(() => props.scope?.record[dataIndex.value])
</script>
