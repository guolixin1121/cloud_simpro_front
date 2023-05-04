<template>
  <a-form ref="form" layout="inline" class="white-block mb-5" :model="formState" v-bind="$attrs">
    <a-form-item v-for="item in items" :key="item" :label="item.label" :name="item.key" style="margin-bottom: 10px">
      <scroll-select
        v-if="item.type == 'select'"
        allowClear
        style="width: 245px"
        v-model:value="formState[item.key]"
        v-bind="{ ...item, ...getDefaultStyle(item.type) }"
        v-on="item"
        @select="(value: string|string[]) => onSelectChange(item.key, value)"
      >
      </scroll-select>
      <tree-select
        v-else-if="item.type == 'tree-select'"
        allowClear
        style="width: 245px"
        v-model:value="formState[item.key]"
        v-bind="{ ...item, ...getDefaultStyle(item.type) }"
        v-on="item"
      >
      </tree-select>
      <component
        v-else
        :is="Ant[getComponent(item.type)]"
        allowClear
        style="width: 245px"
        v-model:value="formState[item.key]"
        v-bind="{ ...item, ...getDefaultStyle(item.type) }"
        v-on="item"
      ></component>
    </a-form-item>
    <a-form-item class="ml-8">
      <a-button type="primary" @click="search" :loading="loading">搜索</a-button>
      <a-button @click="reset" class="ml-2">重置</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import * as Ant from 'ant-design-vue'
import { formatDate } from '@/utils/tools'
import { SStorage } from '@/utils/storage'
import 'ant-design-vue/es/date-picker/style/css' // 有些组件样式需单独引入
import dayjs from 'dayjs'

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: () => false
  },
  query: {
    type: Object,
    default: () => ({})
  }
} as any)
const emits = defineEmits(['onSearch'])

// form state, and get default value from props
const formState = reactive<Record<string, any>>({})
props.items.forEach((item: any) => formState[item.key] = item.defaultValue)

// 获取缓存的搜索项
// 从菜单进入时设置?menu来清空缓存
const route = useRoute()
onMounted(() => {
  const storage = SStorage.get(route.path)
  const isFromCache = route.query.clear !== null && storage
  if(isFromCache) {
    props.items.forEach((item: any) => {
      const key = item.key
      const isTimeKey = key.toLowerCase().indexOf('time') > -1 || key.toLowerCase().indexOf('date') > -1
      if(isTimeKey) {
        // 日期控件
        const timeValue = storage[key]
        if(timeValue && timeValue[0]) {
          formState[key] = [dayjs(timeValue[0]), dayjs(timeValue[1])]
        }
      } else {
        formState[key] = storage[key]
      }
    })
    emitSearch()
  } else {
    SStorage.clear()
  }
})

// button events
const form = ref()
const search = () => emitSearch()
const reset = () => {
  form.value.resetFields()
  emitSearch()
}

const emitSearch = () => {
  let start_date = formatDate(formState.date?.[0], 'YYYY-MM-DD')
  let end_date = formatDate(formState.date?.[1], 'YYYY-MM-DD')
  const formValues = { ...formState }
  // 删除空值的属性
  for (let prop in formValues) {
    const value = formValues[prop]
    if (prop === 'date' || value === '' || value === null || value === undefined) {
      delete formValues[prop]
    }
    if (Array.isArray(value) && !value.join('')) {
      delete formValues[prop]
    }
  }
  emits('onSearch', { ...formValues, start_date, end_date })
  // 缓存搜索项
  SStorage.set(route.path, formState)
}

/**
 * change 'range-picker to RangePicker'
 * @param name Ant Design component name, like: range-picker, input
 * @returns Ant Design component
 * */
const getComponent = (name: string) =>
  name
    .split('-')
    .map(n => n.substring(0, 1).toUpperCase() + n.substring(1))
    .join('') as keyof typeof Ant

/**
 * get custom style form component
 * @param name Ant Design component name, like: range-picker, input
 */
const getDefaultStyle = (name: string) => {
  const styleMap = {
    'range-picker': {
      // 'value-format': 'YYYY-MM-DD'  // 重置时组件会出现invalid date的bug，换成取值时自己转换
    },
    select: {
      'max-tag-count': 1,
      'max-tag-text-length': 4
    }
  }
  return styleMap[name as keyof typeof styleMap] || {}
}

/*********** a-select的配置 ****************/
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
  if (isMultiple) {
    const isAllSelected = value == ''
    formState[key] = isAllSelected ? [''] : selectedValue.filter(v => v)
  }
}
/***** 组件外部按钮重置table *****/
watch(
  () => props.query,
  newVal => {
    if (JSON.stringify(newVal) === '{}') {
      reset()
    }
  }
)
</script>

<style></style>
