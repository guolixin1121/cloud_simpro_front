<template>
  <a-form ref="form" layout="inline" class="mb-5" :model="formState">
    <a-form-item v-for="item in items" :key="item"
      :label="item.label"
      :name="item.key">
        <a-input v-if="item.type === 'input'"  v-model:value="formState[item.key]" allowClear></a-input>
        <a-select v-if="item.type === 'select'" :style="{ width: item.width || '190px' }" v-model:value="formState[item.key]" allowClear>
          <a-select-option key="" value="">全部</a-select-option>
          <a-select-option v-for="option in item.options"
            :key="option" :value="option">{{ option }}</a-select-option>
        </a-select>
        <a-range-picker v-if="item.type === 'range-picker'" :name="item.key" v-model:value="formState[item.key]"/>
    </a-form-item>
    <a-form-item class=" ml-8">
      <a-button type="primary" @click="search" :loading="loading">搜索</a-button>
      <a-button @click="reset" class=" ml-5">重置</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

interface SearchFormItem {
  label: string, // 显示标签
  key: string, // 用于获取数据的字段
  type: string,  // antd的组件类型，a-xx的xx
  width?: string, // 组件宽度
  default?: string, // default value
  options?: Object[] // when type == select
}

const props = defineProps({
  items: {
    type: Array<SearchFormItem>,
    required: true
  },
  loading: {
    type: Boolean,
    default: () => false
  }
})
const emits = defineEmits(['onSearch'])

// form state, and get key&value from props
const formState = reactive<Record<string, any>>({})
props.items.forEach(item => formState[item.key] = item.default)

// button events
const form = ref();
const reset = () => form.value.resetFields();
const search = () => emits('onSearch', formState)
</script>