<!-- 封装了 - 日期格式化、操作列（有操作权限时才展示操作按钮） -->
<template>
  <a-table class="ant-table-striped" v-bind="$attrs" v-on="$attrs" 
    :loading="loading" :dataSource="dataSource" :columns="columns" 
    :row-class-name="(_record: any, index: number) => (index % 2 === 1 ? 'table-striped' : null)" 
    :class="{'is-dragging': isMouseDragging}" :pagination="false" @change="onChange">
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
  <a-pagination v-model:current="current" :page-size="pagination.size" :total="pagination.total" :show-total="pagination['show-total']" @change="onChange"/>
</template>

<script setup lang="ts">
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
provide('enableCheckPermission', props.enableCheckPermission)
const route = useRoute()
const current = useSessionStorage(route.path + ':table-page', 1)  // 当前页码
const scroll = useSessionStorage(route.path + ':table-scroll', 0) // 滚动条位置
const isMouseDragging = ref(false)
const loading = ref(false)
const dataSource = ref([])  // table数据
const pagination = {
  size: 50,
  current: current.value,
  total: 0,
  'show-total': (total: number) => `共 ${total} 条`
}
// 自定义滚动条
let tableScrollbar: any = undefined
let tableBody: any = undefined

//#region 表格的数据获取
/**
 * 获取表格数据
 * @param query 
 * @param slient 是否静默加载，即
 */
const run = async (slient = false) => {
  try {
    loading.value = !slient
    const res = await props.api({ ...props.query, page: current.value, size: pagination.size })
    pagination.total = res.count
    dataSource.value = res.results || res.datalist

    nextTick(setScrollbarHeight)
  } finally {
    loading.value = false
  }
}

// 监听query变化
watch(() => props.query, () => 
  {
    // reset scrollbar
    tableScrollbar.style.height = '0px'
    tableBody?.scrollTo({ top: 0 })

    // reset checkbox
    clearCheckbox()
    
    // page默认使用缓存的数据；除非明确指定
    current.value = props.query?.page || current.value

    run()
  }
)
interface TableRefreshOption {
  slient?: boolean
  page?: number
  deletedRows?: number
  [key: string]: any
}
// 重新加载table
// option: { slient: boolean, page: number, deletedRows: number}
const refresh = (option: TableRefreshOption) => {
  loading.value = false
  clearCheckbox()
  current.value = option?.page || current.value
  // 单个删除或批量删除时判断是否为最后一页，删除成功后请求上一页
  const deletedRows = option?.deletedRows || 1 
  if (dataSource?.value?.length === deletedRows) {
    const page = current.value > 1 ? current.value - 1 : current.value
    current.value = page
  }
  run(option?.slient)
}
//#endregion

//#region checkbox
const indeterminate = ref(false)
const checkedAll = ref(false) // 控制header的checkbox
const isCheckedAll = ref(false) // 仅用于传给子组件
                                // 不能和header的checkbox使用一个，会引起checkbox样式和逻辑错误
const selectedRows = ref<any[]>([])
const onCheckAllChanged = () => {
  indeterminate.value = false

  // 部分选中到全选时，因isCheckedAll值不改变而无法触发onselect的trick
  isCheckedAll.value = !isCheckedAll.value
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
  if(selectedKeys.length === pagination.total || selectedKeys.length === pagination.size) {
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
//#endregion

//#region 页码切换
const onChange = (pageNumber: number) => {
  clearCheckbox()
  current.value = pageNumber
  run()
  emits('select', [], [])

  // 翻页后滚动到顶部
  tableBody?.scrollTo({ top: 0})
}
//#endregion

//#region 自定义滚动条
/**
 * 隐藏默认滚动条，自定义滚动条
 * 解决：ant table右侧滚动条位置有空白，UI要求让表格贴边
 */
const addScrollbar = () => {
  // scrollbar element
  const table = document.querySelector('.ant-table')
  const scrollbarContainer = document.createElement('div')
  scrollbarContainer.setAttribute('class', 'ant-table-scrollbar')
  tableScrollbar = document.createElement('div')
  tableScrollbar.setAttribute('class', 'ant-table-scrollbar-thumb')
  scrollbarContainer.appendChild(tableScrollbar)
  table?.appendChild(scrollbarContainer)

  // 内容区域滚动时，自定义滚动条跟着动
  tableBody = document.querySelector<HTMLElement>('.ant-table-body')
  tableBody?.addEventListener('scroll', updateScrollbar)

  // 点击滚动条时上下拖动的滚动
  tableScrollbar.addEventListener('mousedown', (event: any) => {
    isMouseDragging.value = true
    event.preventDefault()
  })
  document.addEventListener('mouseup', () => {
    isMouseDragging.value = false
  })
  document.addEventListener('mousemove', (event: any) => {
    if(isMouseDragging.value) {
      const scrollHeight = tableBody.scrollHeight - tableBody.clientHeight   // 未显示的需要滚动部分的总高度
      const offsetY = event.clientY - tableBody.getBoundingClientRect().top   // 鼠标移动的偏移量
      const scrollPercent = offsetY / tableBody.clientHeight
      tableBody.scrollTo({ top: scrollPercent * scrollHeight })
    }
  })
  // 点击自定义滚动条空白处，滚动到目标位置 
  scrollbarContainer.addEventListener('click', (event: any) => {
    if(event.target.className == 'ant-table-scrollbar-thumb') return
     
    const scrollHeight = tableBody.scrollHeight - tableBody.clientHeight // 未显示的需要滚动部分的总高度
    const scrollPercent = event.offsetY / tableBody.clientHeight // 点击的位置相对于滚动条顶部的百分比
    tableBody.scrollTo({ top: scrollPercent * scrollHeight })
  })
}
// 根据表格内容总高度，计算滚动条thumb的高度
const setScrollbarHeight = () => {
  const viewHeight = tableBody.clientHeight
  const contentHeight = tableBody.scrollHeight
  if(contentHeight > viewHeight) {
    tableScrollbar.style.height = viewHeight / contentHeight * viewHeight + "px"
  }

  tableBody?.scrollTo({ top: scroll.value }) // 移动到上次记录的位置
}
// 计算实际滚动条滚动时，自定义滚动条的同步滚动距离
const updateScrollbar = () => {
  scroll.value = tableBody?.scrollTop
  
  const scrollbarHeight = tableScrollbar.style.height.replace('px', '')
  const scrollHeight = tableBody.scrollHeight - tableBody.clientHeight   // 未显示的需要滚动部分的总高度
  const containerHeight = tableBody.clientHeight - scrollbarHeight  // scrollbar内可滚动的高度
  const newTop = tableBody.scrollTop / scrollHeight * containerHeight
  tableScrollbar.style.top = newTop + 'px'
}
//#endregion

//#region 辅助函数 
// 动态计算表格容器高度
const calcateHeight = () => { 
  let height = 0 // 其他元素占据的高度
  // 设置table父容器的高度
  const tableContainer = document.querySelector<HTMLElement>('.main')
  if (tableContainer) {
    // 计算父容器上方元素的总高度
    let siblingNode = tableContainer?.previousElementSibling
    while(siblingNode) {
      height += isNaN(siblingNode.clientHeight) ? 0 : (siblingNode.clientHeight + 16)
      siblingNode = siblingNode.previousElementSibling
    }
    // 父容器高度
    tableContainer.style.height = 'calc(100% - ' + height + 'px)'
  }
  
  // table上方所有区域的高度
  let tableHeight = height
  const tableTop = document.querySelectorAll('.main > div:not(.ant-table-wrapper):not(:last-child)')
  tableTop.forEach((top) => tableHeight += isNaN(top.clientHeight) ? 0 : (top.clientHeight + 16))
  
  if(document.body.scrollWidth <= 1440) {
    // App.vue定义的页面最小宽度1440
    // 小于这个宽度出现滚动条时，计算表格高度时要加上滚动条高度，以确保分页符离底部总是最小24px
    tableHeight += 8
  }
  // 表格内容区域的高度，
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  tableBody!.style.height = 'calc(100vh - ' + (tableHeight + 246) + 'px)'
}
// 操作时将table设置为loading，禁用一切用户操作
const onBeforeHandler = () => (loading.value = true)
//#endregion

//#region event handler
onMounted(() => {
  // nexttick保证获取筛选区域的最终高度
  nextTick(calcateHeight)
  addScrollbar()
  window.addEventListener('resize', calcateHeight )
})
onUnmounted(() => window.removeEventListener('resize', calcateHeight))
defineExpose({ refresh, calcateHeight })
//#endregion
</script>

<style scoped>
.ant-table-striped {
  position: relative;
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
<style lang="less">
.ant-table-body {
   &::-webkit-scrollbar { width: 0px; }
   scrollbar-width: none;
}
.ant-table-striped {
  .ant-table-scrollbar { display: none; }
  &:hover .ant-table-scrollbar { display: block; }
}
.ant-table-striped.is-dragging { 
  user-select: none; 
  .ant-table-scrollbar { display: block; }
}
.ant-table-scrollbar {
  position: absolute;
  right: 0px;
  top: 48px;
  width: 4px;
  height: calc(100% - 50px);
  z-index: 100;
  
  .ant-table-scrollbar-thumb {
    position: absolute;
    border-radius: 100px;
    background: rgba(96,102,110,0.5);
    width: 100%;
    height: 0px;
  }
}
</style>
