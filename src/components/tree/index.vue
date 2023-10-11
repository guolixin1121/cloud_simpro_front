<template>
  <div class="left-tree">
    <span class="sub-title">{{ title }}</span>
    <a-input-search allowClear v-model:value="searchValue" style="margin-bottom: 8px" @search="onSearch" />
    <div class="tree-container">
      <a-spin :spinning="loading" style="min-height: 50px">
        <!-- 视觉占位 -->
        <a-tree
          v-if="loading"
          :show-icon="true"
          :load-data="lazy ? loadData : null"
          :tree-data="treeData"
          :expandedKeys="expandRowKeys"
          :selectedKeys="selectedRowKeys"
          @expand="onExpand"
          @select="onSelect"
        >
          <template #icon="{ isLeaf }">
            <svg-icon :icon="isLeaf ? 'leaf' : 'folder'"></svg-icon>
          </template>
        </a-tree>
      </a-spin>
      <!-- 刷新数据需要重新渲染，否则展开节点会有bug -->
      <a-tree
        v-if="!loading"
        :show-icon="true"
        :load-data="lazy ? loadData : null"
        :tree-data="treeData"
        :expandedKeys="expandRowKeys"
        :selectedKeys="selectedRowKeys"
        @expand="onExpand"
        @select="onSelect"
      >
        <template #icon="{ isLeaf }">
          <svg-icon :icon="isLeaf ? 'leaf' : 'folder'"></svg-icon>
        </template>
        <template #switcherIcon="{ switcherCls }">
          <down-outlined :class="switcherCls" />
        </template>
      </a-tree>
    </div>

    <!-- 底部buttons -->
    <div class="float-right mt-2">
      <svg-icon title="创建" icon="add" class="cursor-pointer mr-1" 
        v-if="user.hasPermission('add')"
        @click="onButtonClick('add')"></svg-icon>
      <svg-icon
        icon="edit"
        title="编辑"
        class="cursor-pointer mr-1"
        v-if="user.hasPermission('edit')"
        :class="isEmpty(selectedNode) ? 'icon--disable' : ''"
        @click="onButtonClick('edit')"
      ></svg-icon>
      <svg-icon
        icon="delete"
        title="删除"
        class="cursor-pointer mr-1"
        v-if="user.hasPermission('delete')"
        :class="isEmpty(selectedNode) ? 'icon--disable' : ''"
        @click="onButtonClick('delete')"
      ></svg-icon>
    </div>
    <!-- 调整组件大小 -->
    <div class="resize-handler" @mousedown="onResizeStart"></div>
  </div>

  <!-- 删除确认弹窗 -->
  <a-modal v-model:visible="showDeleteConfirm" :closable="false" :footer="null">
    <div>
      <svg-icon style="color: #faad14" icon="alert"></svg-icon>
      <span class="ml-4" style="font-size: 16px">删除后，关联数据(场景、地图等)将会一起删除，是否删除？</span>
    </div>
    <div class="text-right mt-4 pt-4" style="border-top: 1px solid #f0f0f0">
      <a-button @click="closeDeleteConfirm">否</a-button>
      <a-button @click="onDeleteConfirm" type="primary" class="ml-2">是</a-button>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { DownOutlined } from '@ant-design/icons-vue'
import { useSessionStorage } from '@vueuse/core'
import { isEmpty } from 'lodash'

const user = store.user

const props = defineProps({
  title: {
    type: String
  },
  api: {
    type: Function,
    required: true
  },
  query: {
    type: Object,
    default: () => ({})
  },
  filedNames: {
    type: Object,
    default: () => ({ label: 'name', value: 'id' })
  },
  lazy: {
    type: Boolean,
    default: () => false
  },
  buttonHandlers: {
    type: Object
  },
  isRecurse: {
    type: Boolean,
    default: () => false
  }
})
const emits = defineEmits(['select', 'btn-click'])

const routeName = useRoute().path.replaceAll('/', '')
const searchValue = useSessionStorage(routeName + ': tree-search', '')
const searchQuery = ref()

onMounted(async () => {
  // 恢复缓存的搜索、选中数据
  searchValue.value = props.query.name
  searchQuery.value = { ...props.query, name: searchValue.value }
  selectedRowKeys.value = [selectedNode.value?.id]

  document.addEventListener('mouseup', onResizeEnd)
  document.addEventListener('mousemove', onResize)
})

// 更改树宽度
let startX = 0
let startSize = 0
let isMouseDown = false
const onResizeStart = (event: any) => {
  const treeDom = document.querySelector('.left-tree') as HTMLElement
  startSize = treeDom.clientWidth
  startX = event.clientX
  isMouseDown = true
}
const onResize = (event: any) => {
  if (!isMouseDown) return

  const minWidth = 235
  const maxWidth = 600
  let newWidth = startSize + (event.clientX - startX)
  if (newWidth < minWidth || newWidth > maxWidth) return

  const treeDom = document.querySelector('.left-tree') as HTMLElement
  const rightDom = document.querySelector('.main-right') as HTMLElement
  treeDom.style.width = newWidth + 'px'
  rightDom.style.width = `calc(100% - ${newWidth}px - 16px)`
}
const onResizeEnd = () => (isMouseDown = false)

// 底部按钮的click
const showDeleteConfirm = ref(false)
const onButtonClick = (type: string) => {
  if (type != 'add' && isEmpty(selectedNode.value)) return

  const { buttonHandlers } = props
  if (!buttonHandlers) return

  if (type == 'add') buttonHandlers.add()
  if (type == 'edit') buttonHandlers.edit(selectedNode.value)
  if (type == 'delete') showDeleteConfirm.value = true
}

const closeDeleteConfirm = () => (showDeleteConfirm.value = false)
const onDeleteConfirm = async () => {
  closeDeleteConfirm()

  const handler = props.buttonHandlers?.delete
  if (handler) {
    // delete
    loading.value = true
    await handler(selectedNode.value.id)
    loading.value = false

    // clear and reset
    expandRowKeys.value = expandRowKeys.value.filter((key: string) => key != selectedNode.value.id)
    if (selectedNode.value.isLeaf) {
      emits('select', {})
    }
    expandRowKeys.value = expandRowKeys.value.filter((item: any) => item.id != selectedNode.value?.id)
    selectedNode.value = null
    refresh()
  }
}

/******* table ******/
const loading = ref(false)
const treeData = ref([])

const refresh = async () => {
  try {
    loading.value = true
    const data = await getOptions()
    treeData.value = data

    // 只有一个根节点，默认展开
    if(data.length == 1) {
      expandRowKeys.value = [data[0].id]
    }
  } finally {
    loading.value = false
  }
}

const getOptions = async (query: any = {}) => {
  const res = await props.api({
    ...searchQuery.value,
    ...query
  })
  recurse(res.results)
  const data = transformData(res.results)

  // 更新缓存的选中节点数据
  refreshSelectedNode(data)

  return data
}

const refreshSelectedNode = (data: any = treeData.value) => {
  const selectedId = selectedNode.value?.id
  if(!selectedId) return
  let result = null
  for(let i = 0; i < data.length; i++) {
    const item = data[i]
    if(item.id == selectedId) {
      result = item
    } else if(item.children) {
      refreshSelectedNode(item.children)
    }
    if(!isEmpty(result)) {
      break
    }
  }
  if(result) {
    console.log(11111)
    selectedNode.value = result
    if (selectedNode.value.isLeaf) {
      emits('select', selectedNode.value)
    }
  }
}

const transformData = (data: any = []) => {
  const { label, value } = props.filedNames
  return data.map((item: any) => ({
    id: item[value],
    key: item[value],
    title: item[label],
    name: item[label],
    isLeaf: item.isLeaf == 1,
    children: props.lazy ? null : transformData(item.children)
  }))
}

// 含id的精确搜索，自动循环展开各级
const isRecurse = ref(props.isRecurse)
const recurse = (results: any) => {
  if(isRecurse.value && searchValue.value && results.length) {
    const firstChild = results[0]
    expandRowKeys.value.push(firstChild.id)
    if(firstChild.isLeaf) {
      selectedRowKeys.value = [firstChild.id]
      selectedNode.value = firstChild
      emits('select', selectedNode.value)
    }
  }
}

// 动态获取子节点
const loadData = async (treeNode: any) => {
  return new Promise((resolve: (value?: unknown) => void) => {
    if (treeNode.dataRef.children) {
      resolve()
      return
    }
    getOptions({ parent: treeNode.key }).then(res => {
      treeNode.dataRef.children = res
      treeData.value = [...treeData.value]
      resolve()
    })
  })
}

const onSearch = () => {
  // clear tree 
  expandRowKeys.value = []
  isRecurse.value = false
  // reset query
  searchQuery.value = { ...props.query, name: searchValue.value }
  delete searchQuery.value.baidu_id // 仅跳转过来时支持紧缺搜索，手动搜索时需要删掉
}

watch(searchQuery, refresh)

// 节点选中：展开或触发外部选中事件
const selectedNode = useSessionStorage(routeName + ': tree-select', {} as any)
const selectedRowKeys = ref()

const onSelect = (keys: string[], { selected, selectedNodes }: any) => {
  const node = selected ? selectedNodes[0] : selectedNode.value
  if (!node) return

  // toggle expand
  const expanded = expandRowKeys.value.find((val: string) => val == node.id)
  if (!expanded) {
    expandRowKeys.value.push(node.id)
  } else {
    expandRowKeys.value = expandRowKeys.value.filter((val: any) => val != node.id)
  }

  // 触发叶子结点
  if (node.isLeaf && node.id != selectedNode.value?.id) {
    emits('select', node)
  }

  selectedNode.value = node
  selectedRowKeys.value = [node.id]
}

// 节点展开
const expandRowKeys = useSessionStorage<string[]>(routeName + ': tree-expand', [])
const onExpand = (expandedKeys: string[]) => (expandRowKeys.value = expandedKeys)
</script>

<style lang="less" scoped>
@import '../../assets/styles/variable.less';
.left-tree {
  position: relative;

  .icon--disable {
    color: #d9d9d9;
  }

  .resize-handler {
    cursor: col-resize;
    position: absolute;
    right: 0;
    top: 0;
    width: 16px;
    height: 100%;
    // &:hover {
    //   background-color: @blue-color;
    //   opacity: 0.5;
    // }
  }
}
</style>
