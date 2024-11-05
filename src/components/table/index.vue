<!-- 封装了 - 日期格式化、操作列（有操作权限时才展示操作按钮） -->
<template>
  <a-table class="ant-table-striped" v-bind="$attrs" v-on="$attrs" :loading="loading" :dataSource="dataSource" :columns="columns" :row-class-name="(_record: any, index: number) => (index % 2 === 1 ? 'table-striped' : null)" :defaultExpandAllRows="true" :pagination="false" @change="onChange">
    <template #emptyText>
      <!-- loading时不显示暂无数据 -->
      <div v-if="loading" style="height: 100px"></div>
      <empty v-else/>
    </template>
    <template v-slot:[item]="scope" v-for="item in Object.keys($slots)">
      <slot v-if="item !== 'bodyCell'" :name="item" :scope="scope" v-bind="scope || {}"> </slot>
      <slot v-else :name="item" :scope="scope" v-bind="scope || {}">
        <column :scope="scope" :pagination="pagination" :checkedAll="isCheckedAll" :is-only-creator="isOnlyCreator" @refresh="refresh" @select="onSelect" @before-handler="onBeforeHandler" />
      </slot>
    </template>
    <!-- 父组件中没有指定bodyCell时使用此模板 -->
    <template #bodyCell="scope">
      <column :scope="scope" :pagination="pagination" :checkedAll="isCheckedAll" :is-only-creator="isOnlyCreator" @refresh="refresh" @select="onSelect" @before-handler="onBeforeHandler" />
    </template>
    <template #headerCell="{ column }">
      <template v-if="column.dataIndex == 'checkbox'">
        <a-checkbox v-model:checked="checkedAll" :indeterminate="indeterminate" @change="onCheckAllChanged"></a-checkbox>
      </template>
      <template v-else>
        {{ column.title }}
      </template>
    </template>
  </a-table>
  <a-pagination v-model:current="pagination.current" :page-size="pagination.size" :total="pagination.total" :show-total="pagination['show-total']" @change="onChange"/>
</template>

<script setup lang="ts">
// import { isEmpty } from 'lodash'
import Column from './column.vue'
import { useSessionStorage } from '@vueuse/core'
const props = defineProps({
  api: {
    type: Function,
    required: true
  },
  query: {
    type: Object
  },
  columns: {
    type: Array,
    required: true
  },
  isSelectable: {
    type: Boolean,
    default: () => false
  },
  isOnlyCreator: {
    // 是否只允许创建者编辑，删除
    type: Boolean,
    default: () => false
  },
  // 操作列是否做权限校验
  enableCheckPermission: {
    type: Boolean,
    default: () => true
  }
})
const emits = defineEmits(['select'])
const route = useRoute()
const routeName = route.path // .replaceAll('/', '')
const current = useSessionStorage(routeName + ':table-page', 1)
const loading = ref(false)
const data = ref()
provide('enableCheckPermission', props.enableCheckPermission)

const run = async (query: any, slient = false) => {
  try {
    if (!slient) {
      loading.value = true
    }
    const res = await props.api(query)
    data.value = res
    const results = data.value?.results || data.value?.datalist
    // addKeysToData(results)
    dataSource.value = results
  } finally {
    loading.value = false
  }
}
const dataSource = ref([])
const pagination = computed(() => ({
  size: 50,
  current: current.value,
  total: data.value?.count,
  'show-total': (total: number) => `共 ${total} 条`
}))
const size = pagination.value.size

// selection handler
const indeterminate = ref(false)
const checkedAll = ref(false) // 控制header的checkbox
const isCheckedAll = ref(false) // 仅用于传给子组件
                                // 不能和header的checkbox使用一个，会引起checkbox样式和逻辑错误
const selectedRows = ref<any[]>([])
const onCheckAllChanged = () => {
  indeterminate.value = false

  // 部分选中到全选时，因isCheckedAll值不改变而无法触发onselect的trick
  isCheckedAll.value = !isCheckedAll.value
  // nextTick(() => {
  //   isCheckedAll.value = e.target.checked
  // })
}
const onSelect = (isChecked: boolean, row: any) => {
  const existRow = selectedRows.value.find((item: any) => item.id == row.id)

  if (isChecked) {
    !existRow && selectedRows.value.push(row)
  } else {
    checkedAll.value = false
    if (existRow) {
      selectedRows.value = selectedRows.value.filter((item: any) => item.id != row.id)
    }
  }
  indeterminate.value = checkedAll.value ? false : selectedRows.value.length > 0
  const selectedKeys = selectedRows.value.map((item: any) => item.id)

  // 重新设置全选（一页不够size时根据total判断）
  if(selectedKeys.length === pagination.value.total || selectedKeys.length === size) {
    checkedAll.value = true
    isCheckedAll.value = true
    indeterminate.value = false
  }
  emits('select', selectedKeys, selectedRows.value)
}
const clearCheckbox = () => {
  indeterminate.value = false
  checkedAll.value = false
  // isCheckedAll.value = false
  // 1. 批量删除时需要清空已有选项
  // 2. column组件中checkbox会被缓存，通过这个trick强迫checkbox刷新状态
  isCheckedAll.value = !isCheckedAll.value
  nextTick(() => {
    isCheckedAll.value = false
  })
}

// 页面切换 event handler
const onChange = (pageNumber: number) => {
  clearCheckbox()
  current.value = pageNumber
  run({ ...props.query, page: current.value, size })
  emits('select', [], [])
  const tableBody = document.querySelector<HTMLElement>('.ant-table-body')
  tableBody!.scrollTo({ top: 0})
}

// 查询
watch(
  () => props.query,
  newVal => {
    clearCheckbox()
    // page默认使用session里缓存的数据，
    // 除非明确指定
    if (props.query?.page) {
      current.value = props.query.page
    }
    run({ ...newVal, page: current.value, size })
  }
)
// watch(current, newVal => run({ ...props.query, page: newVal, size }))

// 动态计算表格父容器高度
const calcateHeight = () => { 
  // table父容器上方所有区域的高度
  let height = 0
  let tops = document.querySelectorAll('.table-container > div:not(:last-child)')
  if(tops.length == 0) {
    tops = document.querySelectorAll('.ant-layout-content > div:not(:last-child)')
  }
  tops.forEach((top) => height += isNaN(top.clientHeight) ? 0 : (top.clientHeight + 16))

  // table父容器高度
  const mainContent = document.querySelector<HTMLElement>('.main')
  if (mainContent) {
    mainContent.style.height = 'calc(100% - ' + height + 'px)'
  }
  
  // table上方所有区域的高度
  let tableHeight = height
  const tableTop = document.querySelectorAll('.main > div:not(.ant-table-wrapper):not(:last-child)')
  tableTop.forEach((top) => tableHeight += isNaN(top.clientHeight) ? 0 : (top.clientHeight + 16))
  
  tableHeight = tableHeight + 246
  if(document.body.scrollWidth <= 1440) {
    // App.vue定义的页面最小宽度1440
    // 小于这个宽度出现滚动条时，计算表格高度时要加上滚动条高度，以确保分页符离底部总是最小24px
    tableHeight += 8
  }

  // 表格内容区域
  const tableScrollBody = document.querySelector<HTMLElement>('.ant-table-body')
  if (tableScrollBody) {
    tableScrollBody.style.maxHeight = 'calc(100vh - ' + tableHeight + 'px)'
  }
}
onMounted(() => {
  // form筛选区域为单行时，因为有默认的padding，有时会一开始计算成两行
  // nexttick保证获取筛选区域的最终高度
  nextTick(calcateHeight)
  window.addEventListener('resize', calcateHeight )
})
onUnmounted(() => window.removeEventListener('resize', calcateHeight))

// 用于删除等操作后，重新加载table
// slient: 是否显示loading
// option: { slient: boolean, page: number, deletedRows: number}
const refresh = (option: any) => {
  loading.value = false
  clearCheckbox()
  if (option?.page) {
    current.value = option.page
  }
  const slient = option?.slient
  // 单个删除或批量删除时判断是否为最后一页，删除成功后请求上一页
  const deletedRows = option?.deletedRows || 1 
  if (dataSource?.value?.length === deletedRows) {
    const page = current.value > 1 ? current.value - 1 : current.value
    current.value = page
    run({ ...props.query, page, size }, slient)
    return
  }
  run({ ...props.query, page: current.value, size }, slient)
}

// 操作时将table设置为loading，避免重复操作
const onBeforeHandler = () => (loading.value = true)

// 为了兼容树状的table，为每个数据增加key
// const addKeysToData = (data: any) => {
//   if (!Array.isArray(data)) return
//   data.forEach(item => {
//     item.key = item.id
//     if (isEmpty(item.children)) {
//       delete item.children
//     } else {
//       addKeysToData(item.children)
//     }
//   })
// }
defineExpose({ refresh, calcateHeight })
</script>

<style scoped>
.ant-table-striped {
  margin-top: 16px;
}
.ant-table-striped :deep(.ant-table-pagination.ant-pagination) {
  margin: 16px 0 0 0 !important;
}
.ant-table-striped :deep(.table-striped) td {
  background: var(--table-stripe-color);
}

.ant-table-striped :deep(.ant-table) {
  border: 1px solid #E6E7EB;
}
:global(.ant-table-tbody > tr.ant-table-row-selected > td) {
  background: transparent;
}
:global(.ant-table-tbody > tr.ant-table-row-selected:hover > td) {
  background: #fafafa;
}
</style>
