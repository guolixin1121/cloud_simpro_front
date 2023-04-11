<template>
  <a-form ref="form" layout="inline" class="mb-5" :model="formState">
    <a-form-item v-for="item in items" :key="item"
      :label="item.label"
      :name="item.key">
        <a-input v-if="item.type === 'input'"  v-model:value="formState[item.key]" allowClear :placeholder="item.placeholder || ''"></a-input>
        <a-select v-if="item.type === 'select'" :style="{ width: item.width || '190px' }" v-model:value="formState[item.key]" allowClear>
          <a-select-option key="" value="">全部</a-select-option>
          <a-select-option v-for="option in item.options"
            :key="option" :value="option.value">{{ option.label }}</a-select-option>
        </a-select>
        <a-range-picker v-if="item.type === 'range-picker'" :name="item.key" v-model:value="formState[item.key]" value-format="YYYY-MM-DD" />
    </a-form-item>
    <a-form-item class=" ml-8">
      <a-button type="primary" @click="search" :loading="loading">搜索</a-button>
      <a-button @click="reset" class=" ml-2">重置</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

const props = defineProps({
  items: {
    // eslint-disable-next-line no-undef
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
const search = () => emitSeach()
const reset = () => {
  form.value.resetFields()
  emitSeach()
}

const emitSeach = () => {
  let start_date = formState.date?.[0]
  let end_date = formState.date?.[1]
  const formValues = {...formState}
  // delete useless prop
  for(let prop in formValues){
    if(prop === 'date' || !formValues[prop]) {
      delete formValues[prop]
    }
  }
  emits('onSearch', {...formValues, start_date, end_date } )
}
</script>