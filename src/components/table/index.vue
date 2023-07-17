<!-- 封装了 - 日期格式化、操作列（有操作权限时才展示操作按钮） -->
<!-- tree table默认展开只支持首次赋值，所以增加v-if="$attrs['tree-default-expand-all'] != '' || dataSource?.length" -->
<template>
  <a-table
    class="ant-table-striped"
    v-bind="$attrs"
    v-on="$attrs"
    :loading="loading"
    :dataSource="dataSource"
    :columns="columns"
    :row-class-name="(_record: any, index: number) => (index % 2 === 1 ? 'table-striped' : null)"
    :rowSelection="
      isSelectable
        ? {
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
            ...rowSelection
          }
        : null
    "
    :defaultExpandAllRows="true"
    :pagination="pagination"
    @change="onChange"
  >
    <template #emptyText>
      <!-- loading时不显示暂无数据 -->
      <div v-if="loading" style="height: 100px"></div>
      <div v-if="!loading" class="ant-empty ant-empty-normal">
        <div class="ant-empty-image">
          <svg class="ant-empty-img-simple" width="64" height="41" viewBox="0 0 64 41">
            <g transform="translate(0 1)" fill="none" fill-rule="evenodd">
              <ellipse class="ant-empty-img-simple-ellipse" fill="#F5F5F5" cx="32" cy="33" rx="32" ry="7"></ellipse>
              <g class="ant-empty-img-simple-g" fill-rule="nonzero" stroke="#D9D9D9">
                <path
                  d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"
                ></path>
                <path
                  d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
                  fill="#FAFAFA"
                  class="ant-empty-img-simple-path"
                ></path>
              </g>
            </g>
          </svg>
        </div>
        <p class="ant-empty-description">暂无数据</p>
        <!---->
      </div>
    </template>
    <template v-slot:[item]="scope" v-for="item in Object.keys($slots)">
      <slot v-if="item !== 'bodyCell'" :name="item" :scope="scope" v-bind="scope || {}"></slot>
      <slot v-else :name="item" :scope="scope" v-bind="scope || {}">
        <column :scope="scope" :pagination="pagination" :is-only-creator="isOnlyCreator" @refresh="refresh" />
      </slot>
    </template>
    <!-- 父组件中没有指定bodyCell时使用此模板 -->
    <template #bodyCell="scope">
      <column :scope="scope" :pagination="pagination" :is-only-creator="isOnlyCreator" @refresh="refresh" />
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { isEmpty } from 'lodash'
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
  }
})
const emits = defineEmits(['select'])
const rowSelection: any = useAttrs()['row-selection'] || {}

const route = useRoute()
// const routeName = route.path.replaceAll('/', '')
const current = useSessionStorage(route.path + ':table-page', 1)
const loading = ref(false)
const data = ref()

const run = async (query: any, slient = false) => {
  try {
    if (!slient) {
      loading.value = true
    }
    const res = await props.api(query)
    data.value = res
  } finally {
    loading.value = false
  }
}
const dataSource: any = computed(() => {
  const results = data.value?.results || data.value?.datalist
  addKeysToData(results)
  return results
})
const pagination = computed(() => ({
  size: 10,
  current: current.value,
  total: data.value?.count,
  'show-total': (total: number) => `共 ${total} 条`
}))
const size = pagination.value.size

// selection handler
const selectedRowKeys = ref<string[]>([])
const onSelectChange = (selectedKeys: string[], selectedRows: any) => {
  selectedRowKeys.value = selectedKeys
  emits('select', selectedKeys, selectedRows)
}

// 页面切换 event handler
const onChange = (params: any) => {
  current.value = params.current
  run({ ...props.query, page: current.value, size })
}
watch(
  () => props.query,
  newVal => {
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
onMounted(() => {
  // 搜索框高度
  let height = document.getElementsByClassName('top')?.[0]?.clientHeight
  height = isNaN(height) ? 0 : height + 16 // + 16的padding高度

  // 场景集地图集标题区高度
  let titleHeight = document.getElementsByClassName('right-title')?.[0]?.clientHeight
  titleHeight = isNaN(titleHeight) ? 0 : height
  height += titleHeight

  // 表格内容区域
  const tableScrollBody = document.getElementsByClassName('ant-table-body')?.[0] as HTMLElement
  if (tableScrollBody) {
    tableScrollBody.style.maxHeight = 'calc(100vh - ' + (height + 300) + 'px)'
  }

  const mainContent = document.getElementsByClassName('main')?.[0] as HTMLElement
  if (mainContent) {
    mainContent.style.height = 'calc(100% - ' + height + 'px)'
  }
})

// 用于删除等操作后，重新加载table
// slient: 是否显示loading
const refresh = (option: any) => {
  // 判断是否还剩一条，剩一条删除成功后请求上一页
  const slient = option?.slient
  if (dataSource?.value?.length === 1) {
    const page = current.value > 1 ? current.value - 1 : current.value
    run({ ...props.query, page, size }, slient)
    return
  }
  run({ ...props.query, page: current.value, size }, slient)
}

// 为了兼容树状的table，为每个数据增加key
const addKeysToData = (data: any) => {
  if (!Array.isArray(data)) return
  data.forEach(item => {
    item.key = item.id
    if (isEmpty(item.children)) {
      delete item.children
    } else {
      addKeysToData(item.children)
    }
  })
}
defineExpose({ refresh })
</script>

<style scoped>
.ant-table-striped {
  margin-top: 16px;
}
.ant-table-striped :deep(.ant-table-pagination.ant-pagination) {
  margin: 16px 0 0 0 !important;
}
.ant-table-striped :deep(.table-striped) td {
  background: #f7f8fa;
}

.ant-table-striped :deep(.ant-table) {
  border: 1px solid #f0f0f0;
}
:global(.ant-table-tbody > tr.ant-table-row-selected > td) {
  background: transparent;
}
:global(.ant-table-tbody > tr.ant-table-row-selected:hover > td) {
  background: #fafafa;
}
</style>
