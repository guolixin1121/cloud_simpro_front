<template>
  <a-tree :expandedKeys="expandedKeys" :auto-expand-parent="autoExpandParent" :tree-data="gData" @expand="onExpand">
    <template #title="{ title }">
      <span v-if="title.indexOf(searchValue) > -1">
        {{ title.substr(0, title.indexOf(searchValue)) }}
        <span style="color: #f50">{{ searchValue }}</span>
        {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
      </span>
      <span v-else>{{ title }}</span>
    </template>
  </a-tree>
</template>

<script setup lang="ts">
import { TreeDataItem } from 'ant-design-vue/es/tree/Tree'
// const mapsApi = api.maps
const props = defineProps({
  searchValue: {
    type: String,
    default: ''
  },
  api: {
    type: Function
  }
})
const gData = ref<TreeDataItem[]>([])
const dataList: TreeDataItem[] = []
const expandedKeys = ref<string[]>([])
// const searchValue = ref<string>('')
const autoExpandParent = ref<boolean>(true)

const getMapCatalog = async () => {
  if (props.api) {
    const res = await props.api()
    generateData(res.results)
    gData.value = res.results
    generateList(res.results)
  }
}
const generateData = (val: any[], _preKey?: string) => {
  const preKey = _preKey || '0'
  val.forEach((item: any, i: number) => {
    item.title = item.name
    item.key = `${preKey}-${i}`
    if (item.children && item.children.length > 0) {
      generateData(item.children, item.key)
      item.selectable = false
    } else {
      item.selectable = true
    }
  })
}
const generateList = (data: TreeDataItem[]) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i]
    const key = node.key
    dataList.push({ key, title: node.name as string })
    if (node.children) {
      generateList(node.children)
    }
  }
}

getMapCatalog()

const getParentKey = (key: string, tree: TreeDataItem[]): string | number | undefined => {
  let parentKey
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }
  return parentKey
}

const onExpand = (keys: string[]) => {
  expandedKeys.value = keys
  autoExpandParent.value = false
}

watch(
  () => props.searchValue,
  value => {
    const expanded = dataList
      .map((item: TreeDataItem) => {
        if ((item.title as string).indexOf(value) > -1) {
          return getParentKey(item.key as string, gData.value)
        }
        return null
      })
      .filter((item, i, self) => item && self.indexOf(item) === i)
    expandedKeys.value = expanded as string[]
    // searchValue.value = value
    autoExpandParent.value = true
  }
)
</script>
