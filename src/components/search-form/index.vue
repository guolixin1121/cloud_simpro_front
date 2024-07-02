<template>
  <!-- top作为标记类，用于table计算自身高度以便填充满页面高度 -->
  <div class="white-block search-form" :class="{'opened': isOpened}">
    <a-form ref="form" :class="'col-' + colLimit"
      layout="inline" :model="formState" v-bind="$attrs">
      <template v-for="(item, index) in items" :key="item">
      <a-form-item
        :class="{'last-row': isLastRow(index), 'more-row': isMoreRow(index)}"
        :label="item.label"
        :name="item.key"
        style="margin-bottom: 10px"
        :rules="[{ required: item.required }]"
      >
        <scroll-select
          v-if="item.type == 'select'"
          allowClear
          v-model:value="formState[item.key]"
          v-bind="{ ...item, ...getDefaultStyle(item.type) }"
          v-on="item"
          @select="(value: string|string[]) => onSelectChange(item.key, value)"
        >
        </scroll-select>
        <tree-select
          v-else-if="item.type == 'tree-select'"
          v-model:value="formState[item.key]"
          v-bind="{ ...item, ...getDefaultStyle(item.type) }"
          v-on="item"
          @change="(value: string|string[]) => onTreeSelectChange(item.key, value)"
        >
        </tree-select>
        <component
          v-else
          :is="Ant[getComponent(item.type)]"
          allowClear
          v-model:value="formState[item.key]"
          v-bind="{ ...item, ...getDefaultStyle(item.type) }"
          v-on="item"
        ></component>
      </a-form-item>

      </template>
      <a-form-item class="last-row search-form-button" v-if="items.length < colLimit">
        <a-button @click="reset" class="marginR-8">重置</a-button>
        <a-button type="primary" @click="search">查询</a-button>
      </a-form-item>
    </a-form>
    <div class="search-form-button" v-if="items.length >= colLimit">
      <div>
        <a-button @click="reset" class="marginR-8">重置</a-button>
        <a-button type="primary" @click="search">查询</a-button>
      </div>
      <div class="show-more" @click="showMore" v-if="rowTotal > 2">
        <span>展开更多</span>
        <i class="icon down"></i>
        <i class="icon up"></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as Ant from 'ant-design-vue'
import { formatDate, isEmpty } from '@/utils/tools'
import { SStorage } from '@/utils/storage'
import 'ant-design-vue/es/date-picker/style/css' // 有些组件样式需单独引入
import { isString } from 'lodash'
import dayjs from 'dayjs'

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  query: {
    type: Object,
    default: () => ({})
  },
  manual:{
    // 是否手动触发首次搜索
    type: Boolean,
    default: ()=> false
  }
} as any)
const emits = defineEmits(['search', 'show-more'])

// form state, and get default value from props
const formState = reactive<Record<string, any>>({})
props.items.forEach((item: any) => {
  formState[item.key] = item.defaultValue
})

// 获取缓存的搜索项
// 从菜单进入时设置?menu来清空缓存
const route = useRoute()
const routeName = route.path //.replaceAll('/', '')
onMounted(() => {
  const clear = route.query.clear === null
  const isBrowserBack = window.history.state.forward // 是否是浏览器回退
  if (!clear || isBrowserBack) {
    const storage = SStorage.get(routeName)
    if(storage) {
      props.items.forEach((item: any) => {
        const key = item.key
        const isTimeKey = key.toLowerCase().indexOf('time') > -1 || key.toLowerCase().indexOf('date') > -1
        if (isTimeKey) {
          // 日期控件
          const timeValue = storage[key]
          if (timeValue && timeValue[0]) {
            formState[key] = [dayjs(timeValue[0]), dayjs(timeValue[1])]
          }
        } else {
          formState[key] = storage[key]
        }
      })
    }
    !props.manual && emitSearch(false)
  } else {
    SStorage.clear()
    !props.manual && emitSearch()
  }
})

// button events
const form = ref()
const search = () => emitSearch()
const reset = () => {
  // form.value.resetFields()
  // 页面跳转带默认参数的查询，重置时希望能置空而非默认参数，通过resetValue来设置
  props.items.forEach((item: any) => (formState[item.key] = item.resetValue != undefined ? item.resetValue : item.defaultValue))
  emitSearch()
}

// fromFirstPage: 初始化时从缓存中取查询参数, 点击按钮查询时从首页开始
const emitSearch = (fromFirstPage: boolean = true) => {
  const formValues = { ...formState }
  // '创建时间'字段转化
  let start_date = formatDate(formValues.create_time?.[0], 'YYYY-MM-DD')
  let end_date = formatDate(formValues.create_time?.[1], 'YYYY-MM-DD')

  for (let prop in formValues) {
    let value = formValues[prop]
    // 去除空格
    value = isString(value) ? value.trim() : value
    formValues[prop] = value

    // 删除空属性
    if (prop === 'create_time' || isEmpty(value)) {
      delete formValues[prop]
    }
  }
  const query = { ...formValues, start_date, end_date, page: null }
  if(fromFirstPage) {
    query.page = 1 as any
  }
  emits('search', query)
  // 缓存搜索项
  SStorage.set(routeName, formState)
}

/**
 * change 'range-picker to RangePicker'
 * @param name Ant Design component name, like: range-picker, input
 * @returns Ant Design component
 * */
const getComponent = (name: string) =>
  name
    .split('--')
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

const onTreeSelectChange = (key: string, value: string | string[]) => {
  const selectedValue = formState[key]
  const isMultiple = Array.isArray(selectedValue)
  if (isMultiple) {
    const isAllSelected = value.length == 0 || value.indexOf('') > 0
    formState[key] = isAllSelected ? [''] : selectedValue.filter(v => v)
  }
}
/***** 组件外部按钮重置table ? *****/
watch(
  () => props.query,
  newVal => {
    if (JSON.stringify(newVal) === '{}') {
      reset()
    }
  }
)

/**** 3列或4列布局 *****/
// 根据总共多少列计算每列width，css里使用
const colLimit = props.items.length > 4 ? 3 : props.items.length == 4 ? 4 : 3 // 每行几个
const rowTotal = computed(() => Math.ceil(props.items.length / colLimit)) // 总行数
// 当前显示总行数
const showRowTotal = computed(() => {
  const itemLength = props.items.length
  if(isOpened.value) {
    return Math.ceil(itemLength / colLimit)
  } else {
    return itemLength <= colLimit ? 1 : 2
  }
})
// 是否最后一行，最后一行padding bottom清空
const isLastRow = (itemIndex: number) => {
  const rowIndex = Math.floor(itemIndex / colLimit) + 1 
  return rowIndex == showRowTotal.value
}
// 是否为更多行
const isMoreRow =  (itemIndex: number) => {
  const rowIndex = Math.floor(itemIndex / colLimit) + 1 
  return rowIndex > 2
}
const isOpened = ref(false)
const showMore = () => {
  isOpened.value = !isOpened.value
  nextTick(() => {
    // 等展开后，重新计算
    emits('show-more', isOpened.value)
  })
}
// window.addEventListener('resize', () => colLimit.value = document.body.clientWidth < 1920 ? 3 : 4)
// onMounted(() => colLimit.value = document.body.clientWidth < 1920 ? 3 : 4 )
defineExpose({ reset })
</script>

<style lang="less" scoped>
.search-form {
  .search-form-button {
    display: flex;
    flex-direction: column;

    .show-more {
      cursor: pointer;
      margin-top: 22px;
      text-align: center;
      .icon {
        width: 8px;
        height: 8px;
        margin-left: 8px;
        border: 1px solid var(--text-second-color);
        border-top: 0px;
        border-left: 0px;
      }
      .up {
        transform: rotate(45deg);
        position: relative;
        top: -3px;
        display: inline-block;
      }
      .down {
        transform: rotate(-135deg);
        position: relative;
        top: 1px;
        display: none;
      }

      &:hover {
        color: var(--primary-color);
        .icon {
          border-color: var(--primary-color);
        }
      }
    }
  }

  .more-row {
    display: none;
  }

  &.opened {
    .more-row {
      display: flex;
    }
    .show-more {
      .up {
        display: none;
      }
      .down {
        display: inline-block;
      }
    }
  }
}
</style>
