<template>
  <a-form ref="form" layout="inline" class="mb-5" :model="formState" v-bind="$attrs">
    <a-form-item v-for="item in items" :key="item"
      :label="item.label"
      :name="item.key"
      style="margin-bottom: 10px;">
        <a-select v-if="item.type == 'select'" allowClear style="width: 245px;"
          v-model:value="formState[item.key]"
          v-bind="{ ...item, ...getDefaultStyle(item.type) }"
          v-on="item"
          :options="mergeOption(item.options)"
          @select="(value: string|string[]) => onSelectChange(item.key, value)">
        </a-select>
        <component v-else :is="Ant[getComponent(item.type)]" allowClear style="width: 245px;"
          v-model:value="formState[item.key]"
          v-bind="{ ...item, ...getDefaultStyle(item.type) }" 
          v-on="item"></component>
    </a-form-item>
    <a-form-item class=" ml-8">
      <a-button type="primary" @click="search" :loading="loading">搜索</a-button>
      <a-button @click="reset" class=" ml-2">重置</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import * as Ant from 'ant-design-vue'
import 'ant-design-vue/es/date-picker/style/css' // 有些组件样式需单独引入

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
props.items.forEach(item => formState[item.key] = item.defaultValue)

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
  
/** 
 * change 'range-picker to RangePicker'
 * @param name Ant Design component name, like: range-picker, input
 * @returns Ant Design component
 * */
type AntComponent = keyof typeof Ant
const getComponent = (name: string) => name.split('-').map(n => n.substring(0, 1).toUpperCase() + n.substring(1)).join('') as AntComponent

/**
 * get custom style form component
 * @param name Ant Design component name, like: range-picker, input
 */
const getDefaultStyle = (name: string) => {
   const styleMap = {
    'range-picker': {
      'value-format': "YYYY-MM-DD" 
    },
    'select': {
      'max-tag-count': 1,
      'max-tag-text-length': 4
    }
   } 
   return styleMap[name as keyof typeof styleMap] || {}
}

const mergeOption = (options = []) => [{ label: '全部', value: '' }].concat(options)
/**
 * 多选时的排他处理：
 * 选中'全部'，则清空其他项；
 * 选中其他项时，清除'全部'
 * @param key 控件在state中对应的key
 * @param value 选中的项
 */
const onSelectChange = (key: string, value: string | string[]) => {
  const selectedValue = formState[key]
  const isMultiple = Array.isArray(selectedValue)
  if(isMultiple) {
    const isAllSelected = value == ''
    formState[key] = isAllSelected ? [''] : selectedValue.filter(v => v)
  }
}
</script>

<style>
.ant-form-item-label > label::after {
  content: ''
}
</style>