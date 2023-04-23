<template>
 <div class="ant-transfer">
    <list  
      ref="leftListRef"
      :title="titles[0]"
      :dataSource="leftDataSource"
      @select="onLeftSelect"
      @search="onLeftSearch"
      @scroll="onScroll"></list>

    <div class="ant-transfer-operation">
       <button :disabled="!leftSelectedValues.length" v-on:click.prevent="addToRight"
         class="ant-btn ant-btn-primary ant-btn-sm ant-btn-icon-only">></button>
       <button :disabled="!rightSelectedValues.length" v-on:click.prevent="addToLeft"
         class="ant-btn ant-btn-primary ant-btn-sm ant-btn-icon-only">&lt;</button>
    </div>

    <list 
      ref="rightListRef"
      :title="titles[1]"
      :dataSource="rightDataSource" 
      @search="onRightSearch"
      @select="onRightSelect"></list>
 </div>
</template>
<script setup lang="ts">
import { watchOnce } from '@vueuse/core'
import List from './list.vue'

const emits = defineEmits(['update:targetKeys'])
const props = defineProps({
  titles: {
    type: Array<string>,
    default: () => ['', '']
  },
  api: {
    type: Function
  },
  targetKeys: {
    type: Array<String>
  },
  fieldNames: {
    type: Object as PropType<FieldNames>,
    default: () => ({ label: 'name', value: 'id'})
  }
})

let leftSearchText = ''
const leftListRef = ref()
const leftDataSource = ref<SelectOption[]>([ ]) // 左侧列表数据
const leftSelectedValues = ref<SelectOption[]>([])  // 左侧选中数据

const rightListRef = ref()
const rightDataSource = ref<SelectOption[]>([])
const rightSelectedValues = ref<SelectOption[]>([])

const rightDataSourceBackup = ref<SelectOption[]>([])
const dataSourceFromApi = ref<SelectOption[]>([]) // 左侧全部列表数据。从接口获取
const isValueFromParent = ref(true) // 记录下targetKeys首次赋值是从父组件还是从内部，解决从左向右添加时watchOnce多触发一次的问题

const onLeftSelect = (data: SelectOption[]) => leftSelectedValues.value = data
const onRightSelect = (data: SelectOption[]) => rightSelectedValues.value = data

const addToRight = () => {
   rightDataSource.value = [...leftSelectedValues.value, ...rightDataSource.value]
   rightDataSourceBackup.value = rightDataSource.value
 
   isValueFromParent.value = false
}
const addToLeft = () => {
   rightDataSource.value = removeOptions(rightDataSource.value, rightSelectedValues.value)  
   rightDataSourceBackup.value = rightDataSource.value
}

const removeOptions = (source: SelectOption[], removedData: SelectOption[] ) => {
   return source.filter((item: SelectOption) => !removedData.find(rItem => rItem.value === item.value))
}

// 分页获取数据
const page = ref(1)
const isAllLoaded = ref(false)
const getOptionsFromApi = async () => {
  if(props.api) {
    const res = await props.api({ page: page.value, [props.fieldNames.label]: leftSearchText })
    const { fieldNames } = props
    const newOptions = res.results.map((item: any) => ({ 
      label: item[fieldNames.label],
      value: item[fieldNames.value]
    }))

    dataSourceFromApi.value.push(...newOptions)
    isAllLoaded.value = dataSourceFromApi.value.length >= res.count 
  }
}

// 分页回写时，默认选中项可能不是第一页的数据
// 为每个默认value值调用接口获取{label，value}放到右侧列表
const setDefaultOptions = async() => {
  if(props.api && isValueFromParent.value) {
    const targetKeys = props.targetKeys || []
    const { label, value } = props.fieldNames

    targetKeys.forEach(async (key: String) => {
      if(props.api) {
        const res = await props.api( { [value]: key })

        const options: SelectOption[] = res.results.map((item: any) => ({ 
          label: item[label],
          value: item[value]
        }))
        // 右侧数据
        rightDataSource.value.push(...options)
        rightDataSourceBackup.value = rightDataSource.value

        // 左侧数据不够一屏，继续加载数据，确保滚动条出现
        if(rightDataSource.value.length === targetKeys.length && !isAllLoaded.value) {
          page.value++
          getOptionsFromApi()
        }
      }
    })
  }
}
// 仅用于回写
watchOnce(() => props.targetKeys, () => setDefaultOptions())

// 发送数据给父组件
watch(rightDataSource, () => {
  const newTargetKeys = rightDataSource.value.map((v: SelectOption) => v.value)
  emits('update:targetKeys', newTargetKeys)
})

watchEffect(() => {
  // 从所有数据中过滤出右侧数据
  const isInRightList = (item: SelectOption ) => rightDataSource.value.find(rItem => rItem.value === item.value)
  leftDataSource.value = dataSourceFromApi.value.filter((item: SelectOption) => !isInRightList(item))

  // clear data
  leftSelectedValues.value = []
  rightSelectedValues.value = []
  leftListRef.value?.clear()
  rightListRef.value?.clear()
})

const onScroll = (e: any) => {
  if(props.api && !isAllLoaded.value) {
    const { target } = e
    if(target.scrollTop + target.offsetHeight === target.scrollHeight) {
      page.value = page.value + 1
      getOptionsFromApi()
    }
  }
}

// 搜索查询数据
const onLeftSearch = (input: string) => {
  if(props.api) {
    leftSearchText = input
    page.value = 1
    dataSourceFromApi.value = []
    // leftDataSource.value = []
    getOptionsFromApi()
  }
}
// 右侧仅查询
const onRightSearch = (input: string) => {
  rightDataSource.value = rightDataSourceBackup.value.filter((v: SelectOption) => v.label.indexOf(input) > -1 )
}

getOptionsFromApi()
</script>