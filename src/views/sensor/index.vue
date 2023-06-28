<template>
  <search-form :items="formItems" @search="onSearch"></search-form>

  <div class="main">
    <div class="flex justify-between items-center">
      <span class="title">传感器模型列表</span>
      <a-button type="primary" v-if="user.hasPermission('add')" @click="router.push('/sensor/edit/0')">创建传感器</a-button>
    </div>
    <Table :api="sensorApi.getList" :query="query" 
      :columns="columns" :scroll="{ x: 1000, y: 'auto' }"
      :isOnlyCreator="true"> </Table>
  </div>
</template>

<script setup lang="ts">
import { sensorType } from '@/utils/dict'
/****** api */
const user = store.user
const sensorApi = api.sensor
/****** 搜素区域 */
const formItems = ref<SearchFormItem[]>([
  { label: '名称', key: 'name', type: 'input', placeholder: '请输入传感器名称' },
  {
    label: '传感器类型',
    key: 'type',
    type: 'select',
    options: sensorType,
    placeholder: '请选择传感器类型',
    defaultValue: ''
  },
  { label: '创建时间', key: 'create_time', type: 'range-picker' }
])
const query: Query = ref({})
const onSearch = (data: Query) => {
  query.value = data
}
/****** 表格区域 */
const router = useRouter()
// const preRoute = router.currentRoute.value.path
const columns = [
  { title: '传感器ID', dataIndex: 'id', width: 110 },
  { title: '传感器名称', dataIndex: 'name', width: 150, ellipsis: true },
  { title: '传感器类型', dataIndex: 'type_name', ellipsis: true },
  { title: '创建时间', dataIndex: 'create_time', width: 180 },
  { title: '修改时间', dataIndex: 'update_time', width: 180 },
  { title: '所属用户', dataIndex: 'create_user', width: 130 },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 150,
    actions: {
      查看: (data: any) => router.push('/sensor/edit/' + data.id + '?type=0'),
      编辑: (data: any) => router.push('/sensor/edit/' + data.id),
      删除: async ({ id }: { id: string }) => await sensorApi.delete(id)
    }
  }
]
</script>
