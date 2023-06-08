<template>
  <div class="v-tree-containter">
    <a-spin v-if="loading" class="v-spin"/>
    <VirTree
      ref="virTree"
      :source="list"
      :default-expanded-keys="defaultExpandKeys"
      :render-node="renderNode"
      @expandChange="toggleExpand"
      @selectChange="selectChange"
    />
  </div>
</template>
<script setup lang="tsx">
import { TreeNodeOptions, VirTree, NodeKey } from '@ysx-libs/vue-virtual-tree'
import '../../../node_modules/@ysx-libs/vue-virtual-tree/dist/style.css'
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
  onSelect: {
    type: Function
  }
})
// const emits = defineEmits(['onSelect'])
const route = useRoute()
const routeName = route.path.replaceAll('/', '')

const list = useSessionStorage<any>( routeName + ': tree', [])
const defaultSelectedKey = useSessionStorage<NodeKey>(routeName + ': tree-select', '')
const defaultExpandKeys = useSessionStorage<NodeKey[]>(routeName + ': tree-expand', [])

const searchKey = ref('')
const gData = ref([])
const loading = ref<boolean>(false)
const virTree = ref<any>()

const setDefaultValue = () => {
  if(defaultSelectedKey.value) {
    const obj: any = {
      node: {
        key: defaultSelectedKey.value
      }
    }
    selectChange(obj)
  }
}

const getData = async () => {
  if (props.api && list.value.length == 0) {
    try {
      loading.value = true
      const res = await props.api()
      gData.value = JSON.parse(JSON.stringify(res.results))
      if (props.searchValue) {
        // 初始化状态 search  有数据
        resetRender(props.searchValue)
        const obj: any = {}
        obj.node = {}
        obj.node.key = props.treeSelectId
        selectChange(obj)
        defaultSelectedKey.value = props.treeSelectId
      } else {
        // 初始化状态 search  为空
        const data = recursion(res.results)
        list.value = data
      }
    } finally {
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
  const wrapValue = node.name.replace(searchKey.value, `<span class="node-highlight">${searchKey.value}</span>`)
  return (
    <div
      class={`node-title ${+ defaultSelectedKey.value == +node.key ? 'selected' : ''}`}
      innerHTML={wrapValue}
      onClick={e => onclick(e, node)}
    ></div>
  )
}

// set selected node style
const onclick = ({ target }: any, node: any, data = list.value) => {
  const selectedData = getSelectedData(node.key, data)
  if(!selectedData.isLeaf) return

  const d = document.getElementsByClassName('node-title selected')
  if (d && d[0]) {
    d[0].className = 'node-title'
  }

  const targetNode = target.className === 'node-highlight' ? target.parentNode : target
  targetNode.className = 'node-title selected'
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

const toggleExpand = ({ node }: any) => {
  const expandedValues = defaultExpandKeys.value
  const isExpanded = expandedValues.find(item => item === node.key)
  if(isExpanded) {
    defaultExpandKeys.value = expandedValues.filter(item => item != node.key)
  } else {
    defaultExpandKeys.value.push(node.key)
  }
}

// 单选
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const selectChange = (val: any, data = list.value) => {
  if (!val || !val.node) return

  const selectedData = getSelectedData(val.node.key, data)  
  if (selectedData.isLeaf) {
    defaultSelectedKey.value = +selectedData.id
    if (props.onSelect) props.onSelect(selectedData)
  }
}

// 从树节点值获取源数据
const getSelectedData = (key: string, data = list.value): any => {
  let result = null
  for (let i = 0; i < data.length; i++) {
    if (key == data[i].id) {
      result = data[i]
      break
    } else {
      if (data[i].children && data[i].children.length > 0) {
        result = getSelectedData(key, data[i].children)
        if(result) {
          break
        }
      }
    }
  }
  return result
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

<style lang="less" scoped>
.v-spin {
  width: 100;
  display: block;
  margin-top: 10%
}
</style>
<style>
.vir-tree {
  width: auto;
  min-width: 100%;
}
</style>


