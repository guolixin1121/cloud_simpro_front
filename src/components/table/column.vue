<template>
  <template v-if="dataIndex == 'index'">
    {{ (pagination.current -1) * pagination.size + scope.index + 1}}
  </template>
  <template v-if="dataIndex == 'checkbox'">
    <div :class="'checkbox-wrapper--' + (isChecked ? 'checked' : 'unchecked')">
      <a-checkbox
        v-model:checked="isChecked" 
        :disabled="disabled" ></a-checkbox>
      <span class="checkbox-label">
        {{ (pagination.current -1) * pagination.size + scope.index + 1}}
      </span>
    </div>
  </template>
  <!-- 封装操作列 -->
  <template v-if="dataIndex == 'actions'">
    <Action :scope="scope" :is-only-creator="isOnlyCreator" @refresh="emits('refresh')" @before-handler="emits('before-handler')"></Action>
  </template>
  <!-- 值为时间：格式化时间 -->
  <template v-else-if="isDateColumn(dataIndex)">
    {{ dataValue ? dayjs(dataValue).format(dataValue.length < 11 ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss') : '' }}
  </template>
  <!-- 值为对象：获取name -->
  <template v-else-if="isObject(dataValue)">
    {{ dataValue[column.apiField] || dataValue.name }}
  </template>
  <!-- 值为数组： 默认获取name值，可通过label指定字段 -->
  <template v-else-if="Array.isArray(dataValue)">
    <a-tooltip placement="topLeft" :title="dataValue.map((d: any) => d[column.apiField]|| d.name).join('  ')">
      <span v-for="label in dataValue" :key="label.id" class="label mr-2">
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
    <a-tooltip v-if="column.ellipsis" :title="dataValue" placement="topLeft">
      {{ dataValue }}
    </a-tooltip>
    <span v-else>{{ dataValue }}</span>
  </template>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { isObject } from '@/utils/validate'
import Action from './action.vue'

const user = store.user.user
const props = defineProps(['scope', 'isOnlyCreator', 'pagination', 'checkedAll'])
const emits = defineEmits(['refresh', 'select', 'before-handler'])

const column = computed(() => props.scope?.column)
const dataIndex = computed(() => props.scope?.column.dataIndex)
const record = computed(() => props.scope?.record)
const dataValue = computed(() => props.scope?.record[dataIndex.value])

const isDateColumn = (column: string) => {
  if(!column) return ''
  return column.indexOf('_time') > -1 || column.indexOf('Time') > -1 || column.indexOf('_date') > -1 || column.indexOf('Date') > -1 
}

// checkbox
// 注意：checkbox的状态（checked， disabled）分页或刷新时会被缓存下来
// 所以disable改为函数，checked由父组件强行重置
const disabled = computed(() => {
  let isDisabled = props.isOnlyCreator && (record.value.createUser || record.value.create_user || record.value.username) !== user.username

  const validator = props.scope.column.validator
  if(validator) {
    isDisabled = isDisabled || !validator(props.scope.record)
  }
  return isDisabled
})
const isChecked = ref(false)
// 监控全选按钮的触发
// 点击checkbox时，每一列都会触发watch
// disabled判断时需要的validator函数仅在checkbox列有
// 所以如果不是checkbox列，就不做处理
watch(() => props.checkedAll, (val: boolean) => {
  if(props.scope.column.dataIndex != 'checkbox') return
  if(disabled.value) {
    // 保证总是能触发外层select事件，用于控制全选checkbox
    emits('select', false, props.scope?.record)
  } else {
    isChecked.value = val
  }
})
// 同上
watch(isChecked, () => {
  if(props.scope.column.dataIndex != 'checkbox') return
  if(disabled.value) return
  emits('select', isChecked.value, props.scope?.record) 
})
  
</script>

<style lang="less" scoped>
.checkbox-wrapper--unchecked {
  text-align: center;
  .ant-checkbox-wrapper {
    display: none;
  }

  &:hover {
    .checkbox-label {
      display: none;
    }
    .ant-checkbox-wrapper {
      display: inline-flex;
    }
  }
}
.checkbox-wrapper--checked {
  text-align: center;
  .checkbox-label {
    display: none;
  }
}
</style>
