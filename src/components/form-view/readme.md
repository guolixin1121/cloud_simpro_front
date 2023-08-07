# 表单组件
详情页的封装，包含：页面顶部导航，详情内容，返回按钮

## title: string
详情页标题

## items: FormItem[]
数据详情

type FormItem =    
  {    
    label: String,  // 标签   
    value: String,  // 值   
    isBreak？: Boolean,  // 是否换行，默认‘true’   
    isShow？: Boolean // 是否显示的过滤条件，默认'true'   
  }   

## loading: Boolean
接口是否在加载中

## labelWidth: number
左侧标签宽度，默认：100

## slot: 页面父级菜单

```
<template>
  <form-view title="仿真任务详情" :items="formItems" :loading="loading">
    <router-link to="/simpro-task/">仿真任务</router-link>
  </form-view>
</template>
<script>
const formItems = ref<FormItem[]>([])
const loading = ref(false)

const getEditData = async () => {
  try {
    loading.value = true
    const data = await api.task.get(useRoute().params.id)
    formItems.value = [
        { label: '任务名称', value: data.name },
        { label: '任务来源', value: getTaskSourceName(data.source) },
        { label: '是否控制在环', value: data.is_in_ring ? '是' : '否'  },
        { label: '动力学挂载', value: data.mount == '1' ? '内部' : '外部', isShow: data.is_in_ring },
        { label: '车辆动力学', value: data.vehicle_detail?.name, isShow: data.mount == '1' },
        { label: '传感器', value: data.sensors_detail?.map((item: any) => item.name) },
      ]
  } finally {
    loading.value = false
  }
}
getEditData()
</script>
```
