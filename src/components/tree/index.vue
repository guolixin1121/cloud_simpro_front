<template>
  <div class="left-tree">
    <span class="sub-title">{{ title }}</span>
    <a-input-search
      allowClear
      v-model:value="searchValue"
      style="margin-bottom: 8px"
      @search="onSearch"
      />
    <div class="tree-container"> 
      <a-spin :spinning="loading" class=" w-full">
        <!-- 刷新数据需要重新渲染，否则展开节点会有bug -->
        <a-tree
          :show-icon="true"
          :loading="loading"
          :load-data="lazy ? loadData : null"
          :tree-data="treeData"
          :expandedKeys="expandRowKeys"
          :selectedKeys="selectedRowKeys"
          @expand="onExpand"
          @select="onSelect">
          <template #icon="{ isLeaf }">
            <svg-icon :icon="isLeaf ? 'leaf' : 'folder'"></svg-icon>
          </template>
        </a-tree>

      </a-spin>
    </div>
    <div class=" float-right mt-2">
      <svg-icon icon="add" class="cursor-pointer mr-1" @click="onClick('add')"></svg-icon>
      <svg-icon icon="edit" class="cursor-pointer mr-1"
        :class="isEmpty(selectedNode) || !selectedNode.isLeaf ? 'icon--disable' : ''"
         @click="onClick('edit')"></svg-icon>
      <svg-icon icon="delete" class="cursor-pointer mr-1" 
        :class="isEmpty(selectedNode) ? 'icon--disable' : ''"
        @click="onClick('delete')"></svg-icon>
    </div>
  </div>

  <a-modal v-model:visible="showDeleteConfirm" 
    :closable="false"
    :footer="null">
    <div>
      <svg-icon style="color: #faad14" icon="alert"></svg-icon>
      <span class="ml-4" style="font-size: 16px">是否删除？</span>
    </div>
    <div class=" text-right">
      <a-button @click="closeDeleteConfirm">否</a-button>
      <a-button @click="onDeleteConfirm" type="primary" class="ml-2">是</a-button>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { useSessionStorage } from '@vueuse/core';
import { isEmpty } from 'lodash';

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
    default: () => ({ label: 'name', value: 'id'})
  },
  lazy: {
    type: Boolean,
    default: () => false
  },
  buttonHandlers: {
    type: Object
  }
})
const emits = defineEmits(['select', 'btn-click'])

const routeName = useRoute().path.replaceAll('/', '')
const searchValue = useSessionStorage(routeName + ': tree-search', props.query.name || '') 
const searchQuery = ref()

const onSearch = () => {
  searchQuery.value = { ...props.query, name: searchValue.value,}
  delete searchQuery.value.baidu_id
}

onMounted(() => {
  searchQuery.value = {...props.query, name: searchValue.value}
  selectedRowKeys.value = [selectedNode.value?.id]
  if(!isEmpty(selectedNode.value) && selectedNode.value.isLeaf) {
    emits('select', selectedNode.value)
  }
})

const showDeleteConfirm = ref(false)
const onClick = (type: string) => {
  if(type != 'add' && isEmpty(selectedNode.value)) return

  const { buttonHandlers } = props
  if(type == 'add') buttonHandlers?.add()
  if(type == 'edit') buttonHandlers?.edit(selectedNode.value)
  if(type == 'delete') showDeleteConfirm.value = true
}

const closeDeleteConfirm = () => showDeleteConfirm.value = false
const onDeleteConfirm = async () => {
  closeDeleteConfirm()

  const handler = props.buttonHandlers?.delete
  if(handler) {
    // delete
    loading.value = true
    await handler(selectedNode.value.id)
    loading.value = false

    // clear and reset
    if(selectedNode.value.isLeaf) {
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
  try{
    loading.value = true
    const data = await getOptions()
    treeData.value = data
  } finally {
    loading.value = false
  }
}

const getOptions = async (query: any = {}) => {
  const res = await props.api({
    ...searchQuery.value, 
    ...query
  } )
  return transformData(res.results)
}

const transformData = (data: any = []) => {
  const { label, value } = props.filedNames
  return data.map((item: any) => ({
    id: item[value],
    key: item[value],
    title: item[label],
    name: item[label],
    isLeaf: item.isLeaf === 1,
    children: props.lazy ? null : transformData(item.children)
  }))
}

const loadData = async (treeNode: any) => {
  return new Promise((resolve: (value?: unknown) => void) => {
    if (treeNode.dataRef.children) {
      resolve();
      return;
    }
    getOptions({parent: treeNode.key}).then((res) => {
      treeNode.dataRef.children = res 
      treeData.value = [...treeData.value]
      resolve()
    })
  })
}

// 选中的树节点
const selectedNode = useSessionStorage(routeName + ': tree-select', {} as any)
const selectedRowKeys = ref()

const onSelect = (keys: string[], {selected, selectedNodes}: any) => {
  const node = selected ? selectedNodes[0] : selectedNode.value
  if(!node) return

  // toggle expand
  const expanded = expandRowKeys.value.find((val: string) => val == node.id)
  if(!expanded) {
    expandRowKeys.value.push(node.id)
  } else {
    expandRowKeys.value = expandRowKeys.value.filter((val: any) => val != node.id)
  }

  // 触发叶子结点
  if(node.isLeaf && node.id != selectedNode.value.id) {
    emits('select', node)
  }

  selectedNode.value = node
  selectedRowKeys.value = [node.id]
}

const expandRowKeys = useSessionStorage<string[]>(routeName + ': tree-expand', [])
const onExpand = (expandedKeys: string[]) => {
  expandRowKeys.value = expandedKeys
}

watch(searchQuery, () => {
  refresh()
})
</script>

<style lang="less" scoped>
.icon--disable {
  color: #d9d9d9
}
</style>