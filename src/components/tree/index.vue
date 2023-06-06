<template>
  <div class="v-tree-containter">
    <a-spin v-if="loading" class="v-spin"/>
    <VirTree
      ref="virTree"
      :show-checkbox="showCheckbox"
      :source="list"
      :default-checked-keys="defaultCheckedKeys"
      :default-expanded-keys="defaultExpandKeys"
      :render-node="renderNode"
      @expandChange="toggleExpand"
      @checkChange="checkChange"
      @selectChange="selectChange"
    />
  </div>
</template>
<script setup lang="tsx">
// const sceneApi = api.scenesets
import { TreeNodeOptions, VirTree, NodeKey } from '@ysx-libs/vue-virtual-tree'
import '../../../node_modules/@ysx-libs/vue-virtual-tree/dist/style.css'
import { SStorage } from '@/utils/storage';
import { useSessionStorage } from '@vueuse/core';
const props = defineProps({
  searchValue: {
    type: String,
    default: ''
  },
  treeSelectId: {
    type: String,
    default: ''
  },
  api: {
    type: Function
  },
  showCheckbox: {
    type: Boolean,
    default: false
  },
  onSelect: {
    type: Function
  }
})
// const emits = defineEmits(['onSelect'])
const route = useRoute()
const routeName = route.path.replaceAll('/', '')

const list = useSessionStorage<any>( routeName + '-tree-catalog', [])
const { showCheckbox } = toRefs(props)
const searchKey = ref('')
const gData = ref([])
const defaultCheckedKeys = ref<string[]>([])
const defaultExpandKeys = ref<NodeKey[]>([])
const loading = ref<boolean>(false)
const virTree = ref<any>()
let curData: any = {}
let curCheckData: any = ''
let selectedId = ''

const setDefaultValue = () => {
  defaultExpandKeys.value = SStorage.get(routeName + '-tree-catalog-expand') || []

  const defaultSelected = SStorage.get(routeName + '-tree-catalog-selected')
  if(defaultSelected) {
    const obj: any = {
      node: {
        key: defaultSelected.id
      }
    }
    selectChange(obj)
  }

  // resetRender(defaultSelected.name)
}

const getData = async () => {
  if (props.api && list.value.length == 0) {
    try {
      loading.value = true
      const res = await props.api()
      gData.value = JSON.parse(JSON.stringify(res.results))
      loading.value = false
      if (props.searchValue) {
        // 初始化状态 search  有数据
        resetRender(props.searchValue)
        const obj: any = {}
        obj.node = {}
        obj.node.key = props.treeSelectId
        selectChange(obj)
        selectedId = props.treeSelectId
      } else {
        // 初始化状态 search  为空
        const data = recursion(res.results)
        list.value = data
      }
    } catch {
      loading.value = false
    }
  }
  setDefaultValue()
}
const recursion = (val: any[]) => {
  const nodes = [] as any[]
  val.forEach((item: any) => {
    let children = recursion(item.children || [])
    if(item.isLeaf == 1 || children?.length) {
      nodes.push({
        ...item,
        nodeKey: item.id,
        sourceName: item.name,
        name: item.name + (item.count ? `（${item.count}）` : ''),
        children
      })
    }
  })
  return nodes
}

const renderNode = (node: any) => {
  // console.log(node)
  const wrapValue = node.name.replace(searchKey.value, `<span class="node-highlight">${searchKey.value}</span>`)
  return (
    <div
      class={`node-title ${+selectedId === +node.key ? 'selected' : ''}`}
      innerHTML={wrapValue}
      onClick={e => onclick(e, node)}
    ></div>
  )
}
const onclick = (e: any, node: any, data = list.value) => {
  let cur: any = {}
  // 单选
  if (!showCheckbox.value) {
    // 根据key 查出点击的数据
    for (let i = 0; i < data.length; i++) {
      if (node?.key === data[i].nodeKey) {
        cur = data[i]
        break
      } else {
        if (data[i].children && data[i].children.length > 0) {
          onclick(e, node, data[i].children)
        }
      }
    }
    if (!cur.isLeaf) {
      return
    }
    const d = document.getElementsByClassName('node-title selected')
    if (d && d[0]) {
      d[0].className = 'node-title'
    }
    selectedId = node?.key
    if (e.target.className === 'node-highlight') {
      e.target.parentNode.className = 'node-title selected'
    } else {
      e.target.className = 'node-title selected'
    }
  }
}
function searchData(origin: TreeNodeOptions[], keyword: string) {
  const loop = (data: TreeNodeOptions[]) => {
    const result: TreeNodeOptions[] = []
    data.forEach(item => {
      if (item.name.toLowerCase().includes(keyword.toLowerCase())) {
        result.push({ ...item })
        defaultExpandKeys.value.push(item.nodeKey)
        if (item.children) {
          const filterData = loop(item.children)
          if (filterData.length) {
            defaultExpandKeys.value.push(item.nodeKey)
          }
        }
      } else if (item.children) {
        const filterData = loop(item.children)
        if (filterData.length) {
          defaultExpandKeys.value.push(item.nodeKey)
          result.push({
            ...item,
            children: filterData
          })
        }
      }
    })
    return result
  }
  return loop(origin)
}

const toggleExpand = (EventParams: any) => {
  const index = defaultExpandKeys.value.findIndex(item => item === EventParams.node.key)
  if (index >= 0) {
    const index = defaultExpandKeys.value.findIndex(item => item === EventParams.node.key)
    defaultExpandKeys.value.splice(index, 1)
    defaultExpandKeys.value = [...defaultExpandKeys.value]
  } else {
    defaultExpandKeys.value.push(EventParams.node.key)
    defaultExpandKeys.value = [...new Set(defaultExpandKeys.value)]
  }
  SStorage.set(routeName + '-tree-catalog-expand', defaultExpandKeys.value)
}
// 多选
const checkChange = () => {
  if (!showCheckbox.value) return
  curCheckData = ''
  // console.log(val)
  const getCheckedNodes = virTree.value.getCheckedNodes()
  const getKeys = (data: string | any[]) => {
    for (let i = 0; i < data.length; i++) {
      curCheckData += data[i].key + ','
    }
  }
  getKeys(getCheckedNodes)
  if (props.onSelect) props.onSelect(curCheckData)
}
// 单选
const selectChange = (val: any, data = list.value) => {
  curData = {}
  if (showCheckbox.value) return
  if (!val || !val.node) return
  for (let i = 0; i < data.length; i++) {
    if (+val?.node?.key === +data[i].nodeKey) {
      curData = data[i]
      break
    } else {
      if (data[i].children && data[i].children.length > 0) {
        selectChange(val, data[i].children)
      }
    }
  }
  if (curData.isLeaf) {
    SStorage.set(routeName + '-tree-catalog-selected', curData)
    if (props.onSelect) props.onSelect(curData)
  }
}
watch(
  () => props.searchValue,
  newVal => resetRender(newVal)
)

const resetRender = (newVal: string) => {
  searchKey.value = newVal
  defaultExpandKeys.value = []
  list.value = searchData(recursion(JSON.parse(JSON.stringify(gData.value))), newVal)
  defaultExpandKeys.value = [...new Set(defaultExpandKeys.value)]
}

getData()
</script>

<style scoped lang="less">
.v-tree-containter {
  height: 100%;
  position: relative;
  .v-spin {
    position: absolute;
    left: 50%;
    top: 50px;
  }
}
/deep/.node-highlight {
  color: #1890ff;
}
/deep/.vir-checkbox .inner {
  margin-bottom: 2px;
}
.vir-tree {
  width: auto;
  min-width: 100%;
}
/deep/.vir-tree-node {
  text-overflow: ellipsis;
  white-space: nowrap;
}
/deep/.vir-checkbox .content {
  width: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
}
// /deep/.vir-tree-node .node-content .node-title.selected {
//   background-color: #1890ff;
// }
</style>
