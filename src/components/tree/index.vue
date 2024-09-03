<template>
  <div class="left-tree">
    <span class="sub-title">{{ title }}</span>
    <a-input-search allowClear v-model:value="searchText" 
      style="margin-bottom: 8px" :placeholder="'请输入' + title + '名称'"
      @search="onSearch" />
    <div class="tree-container">
      <a-spin :spinning="loading" style="min-height: 50px">
        <!-- 视觉占位 -->
        <a-tree v-if="loading" :show-icon="true" :load-data="lazy ? loadData : null" :tree-data="treeData" :expandedKeys="expandRowKeys" :selectedKeys="selectedRowKeys" @expand="onExpand" @select="onSelect">
          <template #icon="{ isLeaf }">
            <svg-icon :icon="isLeaf ? 'leaf' : 'folder'"></svg-icon>
          </template>
        </a-tree>
      </a-spin>
      <!-- 刷新数据需要重新渲染，否则展开节点会有bug -->
      <a-tree v-if="!loading" :show-icon="true" :load-data="lazy ? loadData : null" :tree-data="treeData" :expandedKeys="expandRowKeys" :selectedKeys="selectedRowKeys" @expand="onExpand" @select="onSelect">
        <template #icon="{ isLeaf }">
          <svg-icon :icon="isLeaf ? 'leaf' : 'folder'"></svg-icon>
        </template>
        <template #switcherIcon="{ switcherCls }">
          <down-outlined :class="switcherCls" />
        </template>
      </a-tree>
    </div>

    <!-- 底部buttons -->
    <div class="bottom-btns">
      <svg-icon icon="add" title="创建" v-if="user.hasPermission('addSet')" @click="onButtonClick('add')"></svg-icon>
      <svg-icon icon="edit" title="编辑" v-if="user.hasPermission('editSet')" :class="isDisabled('edit') ? 'icon--disable' : ''" @click="onButtonClick('edit')"></svg-icon>
      <svg-icon icon="saveas" title="另存为" v-if="user.hasPermission('saveAsSet')" :class="isDisabled('saveAs') ? 'icon--disable' : ''" @click="onButtonClick('saveAs')"></svg-icon>
      <svg-icon icon="delete" title="删除" v-if="user.hasPermission('deleteSet')" :class="isDisabled('delete') ? 'icon--disable' : ''" @click="onButtonClick('delete')"></svg-icon>
    </div>
    <!-- 调整组件大小 -->
    <div class="resize-handler" @mousedown="onResizeStart"></div>
  </div>

  <!-- 删除确认弹窗 -->
  <a-modal v-model:visible="showDeleteConfirm" :closable="false" :footer="null">
    <div class="modal-content">
      <span style="font-size: 16px" v-if="title=='地图集'">地图集删除后，关联数据（场景、地图等）将会一起删除，是否删除？</span>
      <span style="font-size: 16px" v-else>场景集删除后，关联数据将会一起删除，是否删除？</span>
    </div>
    <div class="modal-buttons">
      <a-button @click="closeDeleteConfirm">取消</a-button>
      <a-button @click="onDeleteConfirm" type="primary">确定</a-button>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { DownOutlined } from '@ant-design/icons-vue'
import { useSessionStorage } from '@vueuse/core'
import { isEmpty } from 'lodash'
import { SStorage } from '@/utils/storage'

const user = store.user
const props = defineProps({
  api: {
    type: Function,
    required: true
  },
  buttonHandlers: {
    type: Object
  },
  defaultValue: {
    type: Object,
    default: () => null
  },
  filedNames: {
    type: Object,
    default: () => ({ label: 'name', value: 'id' })
  },
  lazy: {
    type: Boolean,
    default: () => false
  },
  query: {
    type: Object,
    default: () => ({})
  },
  // isRecurse: {
  //   type: Boolean,
  //   default: () => false
  // },
  isFolderSelectable: {
    type: Boolean,
    default: () => false
  },
  title: {
    type: String
  }
})
const emits = defineEmits(['select', 'btn-click'])
const routeName = useRoute().path.replaceAll('/', '')
// 缓存节点选中：展开或触发外部选中事件
const selectedNode = useSessionStorage(routeName + ':tree-select', {} as any)
const selectedRowKeys = computed(() => [selectedNode.value?.id])
// 缓存节点展开数据
const expandRowKeys = useSessionStorage<string[]>(routeName + ':tree-expand', [])
// 缓存数据用于从二级页面返回时

// 搜索变量
const searchText = useSessionStorage(routeName + ':tree-search', '') // 搜索框里显示
const searchQuery = ref() // 实际执行搜索的搜索条件

const loading = ref(false)
const treeData = ref([])
let page = 1
let isDataAllLoaded = false

onMounted(async () => {
  // 恢复缓存的搜索
  // const query = { ...props.query, name: searchText.value } as any
  // if(searchText.value) {
  //   // 如果有了搜索条件，表示从二级页面返回的，则清空指定场景集的查询条件
  //   delete query.id
  // } else {
  //   // 直接访问或跳转到该页面，直接获取父节点的查询条件
  //   searchText.value = props.query.name
  // }

  // if(selectedNode.value) {
  //   selecteNode.value
  // }
  //
  const isAccruate = !!useRoute().query.id
  // !isAccruate && refresh()
  searchQuery.value = selectedNode.value?.isAccruate && isAccruate ? 
    { ...props.query, id: selectedNode.value.id } :
    { ...props.query, name: selectedNode.value.name }
  
  // 调整树宽度
  document.addEventListener('mouseup', onResizeEnd)
  document.addEventListener('mousemove', onResize)

  // 滚动分页
  const treeContainer = document.querySelector('.tree-container')
  treeContainer?.addEventListener('scroll', async (e: any)=> {
      if(isDataAllLoaded) return
      const { target } = e
      
      // 触发翻页
      if (target.scrollTop + target.offsetHeight >= (target.scrollHeight - 50) && !loading.value) {
        page += 1
        refresh()
      }
    })
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
const isDisabled = (type: string) => {
  if(!selectedNode.value || isEmpty(selectedNode.value)) return true
  const func = props.buttonHandlers?.[type]
  const isInvalid = func?.validator ? !func.validator(selectedNode.value) : false
  return isInvalid  // user.hasPermission(type + 'Set')
}
const showDeleteConfirm = ref(false)
const onButtonClick = (type: string) => {
  if (type != 'add' && isEmpty(selectedNode.value) ) return
  if (type != 'add' && isDisabled(type)) return 

  const func = props.buttonHandlers?.[type]
  if(!func) return
  
  cacheScrollTop()

  if (type == 'delete') {
    showDeleteConfirm.value = true
  } else {
    const handler = func.handler || func
    handler(selectedNode.value)
  }
}

const closeDeleteConfirm = () => (showDeleteConfirm.value = false)
const onDeleteConfirm = async () => {
  closeDeleteConfirm()
  const func = props.buttonHandlers?.delete
  const handler = func.handler || func
  if (handler) {
    // delete
    loading.value = true
    await handler(selectedNode.value.id)
    loading.value = false

    // clear and reset
    expandRowKeys.value = expandRowKeys.value.filter((key: string) => key != selectedNode.value.id)
    if (props.isFolderSelectable || selectedNode.value.isLeaf) {
      emits('select', {})
    }
    expandRowKeys.value = expandRowKeys.value.filter((item: any) => item.id != selectedNode.value?.id)
    selectedNode.value = {}
    refresh()
  }
}

const refresh = async () => {
  try {
    loading.value = true

    const { data, count } = await getOptions()
    treeData.value = page == 1 ? data : treeData.value.concat(data)
    isDataAllLoaded = treeData.value.length >= count

    nextTick(() => {
      const scrollTop = SStorage.get(routeName + ':tree-scroll')
      if(!scrollTop) return 

      const treeContainer = document.querySelector('.tree-container')
      treeContainer!.scrollTop = scrollTop
    })
    

    // 只有一个根节点，默认展开并选中
    if (data.length == 1 && expandRowKeys.value.length == 0) {
      expandRowKeys.value = [data[0].id]
      if (props.isFolderSelectable) {
        selectedNode.value = data[0]
        emits('select', selectedNode.value)
      }
    }
  } finally {
    loading.value = false
  }
}

const getOptions = async (query: any = {}) => {
  const res = await props.api({
    ...searchQuery.value,
    ...query,
    page,
    size: 50
  })
  // recurse(res.results)
  const data = transformData(res.results)

  // 更新缓存的选中节点数据
  emits('select', selectedNode.value)
  // refreshSelectedNode(data)

  return { data, count: res.count }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const refreshSelectedNode = (data: any = treeData.value) => {
  const selectedId = selectedNode.value?.id
  if (!selectedId) return
  let result = null
  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    if (item.id == selectedId) {
      result = item
    } else if (item.children) {
      refreshSelectedNode(item.children)
    }
    if (!isEmpty(result)) {
      break
    }
  }
  if (result) {
    selectedNode.value = result
    if (props.isFolderSelectable || selectedNode.value.isLeaf) {
      emits('select', selectedNode.value)
    }
  }
}

const transformData = (data: any = []) => {
  const { label, value } = props.filedNames
  return data.map((item: any) => ({
    ...item,
    id: item[value],
    key: item[value],
    title: item[label],
    name: item[label],
    isLeaf: item.isLeaf == undefined ? true : item.isLeaf,
    children: props.lazy ? null : transformData(item.children),
  }))
}

// 含id的精确搜索，自动循环展开各级
// const isRecurse = ref(props.isRecurse)
// const recurse = (results: any) => {
//   if (isRecurse.value && searchText.value && results.length) {
//     const firstChild = results[0]
//     expandRowKeys.value.push(firstChild.id)
//     if (firstChild.isLeaf) {
//       selectedNode.value = firstChild
//       emits('select', selectedNode.value)
//     }
//   }
// }

// 动态获取子节点
const loadData = async (treeNode: any) => {
  return new Promise((resolve: (value?: unknown) => void) => {
    if (treeNode.dataRef.children) {
      resolve()
      return
    }
    getOptions({ parent: treeNode.key }).then(res => {
      treeNode.dataRef.children = res.data
      treeData.value = [...treeData.value]
      resolve()
    })
  })
}

const onSearch = () => {
  page = 1
  selectedNode.value = {}
  // clear tree
  expandRowKeys.value = []
  // isRecurse.value = false
  // reset query
  searchQuery.value = { ...props.query, name: searchText.value }
  // delete searchQuery.value.id // 仅跳转过来时支持精确搜索，手动搜索时需要删掉
}

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

  if ((props.isFolderSelectable || node.isLeaf) && node.id != selectedNode.value?.id) {
    emits('select', node)
  }

  selectedNode.value = node
}

// 节点展开
const onExpand = (expandedKeys: string[]) => (expandRowKeys.value = expandedKeys)

const cacheScrollTop = () => {
  // 缓存滚动条位置，刷新页面时恢复滚动条
  const treeContainer = document.querySelector('.tree-container')
  SStorage.set(routeName + ':tree-scroll', treeContainer!.scrollTop + 50)
}
watch(searchQuery, () => 
  refresh()
)

// 监控默认选中值的变化
watch(() => props.defaultValue, (val: any) => {
  if(isEmpty(val)) return
  selectedNode.value = val
  // 是否为通过id进行精确搜索
  if(val.isAccurate) {
    searchText.value = val.name
    searchQuery.value = {...props.query, id: val.id}
  }
})

defineExpose({ refresh: () => {
  page = 1
  refresh()
} })

onBeforeUnmount(cacheScrollTop)
</script>

<style lang="less" scoped>
@import '../../assets/styles/variable.less';
.left-tree {
  position: relative;

  .bottom-btns {
    float: right;
    margin-top: 8px;
    .icon {
      cursor: pointer;
    }
  }

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
    //   background-color: var(--primary-color);
    //   opacity: 0.5;
    // }
  }
}
</style>
