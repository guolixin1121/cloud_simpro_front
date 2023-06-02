<template>
  <search-form :items="formItems" @on-search="onSearch"></search-form>

  <div class="main">
    <div class="flex justify-between items-center">
      <span class="title">标签管理</span>
      <a-button type="primary" v-if="user.hasPermission('add')" @click="router.push('/tags/edit/0')">创建标签</a-button>
    </div>
    <Table :api="tagsApi.getList" :query="query" :columns="columns" :scroll="{ x: 1200, y: 'auto' }">
      <template #bodyCell="data">
        <template v-if="data.column.dataIndex == 'isTag'">
          <a-switch
            checked-children="ON"
            un-checked-children="OFF"
            :checked="data.record.isTag"
            :loading="data.index === active ? true : false"
            @change="(checked: boolean)=>changeIsTag(checked, data)"
          />
        </template>
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
// import { IsTag } from '@/utils/dict'
/****** api */
const user = store.user
const tagsApi = api.tags
/****** 搜素区域 */
type Query = Record<string, any>
const query: Query = ref({})
const active = ref(-1)
const formItems = ref<SearchFormItem[]>([
  { label: '名称', key: 'name', type: 'input', placeholder: '请输入标签名称' },
  {
    label: '标签类型',
    key: 'tag_type',
    type: 'select',
    mode: 'multiple',
    // api: tagsApi.getType,
    api: () => tagsApi.getType({ tree: 1 }),
    fieldNames: { label: 'value', value: 'key' },
    defaultValue: ['']
  },
  // { label: '打标', key: 'isTag', type: 'select', options: IsTag, defaultValue: '' },
  { label: '创建时间', key: 'create_time', type: 'range-picker' }
])
const onSearch = (data: Query) => {
  query.value = data
}
/****** 表格区域 */
const router = useRouter()
const columns = [
  { title: '标签ID', dataIndex: 'id', width: 60 },
  { title: '标签名称', dataIndex: 'display_name', width: 90, ellipsis: true },
  { title: '标签英文名称', dataIndex: 'name', width: 120 },
  { title: '标签类型', dataIndex: 'tag_type_name', width: 80, ellipsis: true },
  { title: '是否可打标', dataIndex: 'isTag', width: 80, ellipsis: true },
  { title: '创建时间', dataIndex: 'create_time', width: 140 },
  { title: '修改时间', dataIndex: 'update_time', width: 140 },
  { title: '所属用户', dataIndex: 'create_user', width: 80, ellipsis: true },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 120,
    actions: {
      查看: (data: any) => router.push('/tags/edit/' + data.id + '?type=0'),
      编辑: (data: any) => router.push('/tags/edit/' + data.id),
      删除: async ({ id }: { id: string }) => await tagsApi.delete(id)
    }
  }
]
const changeIsTag = async (checked: boolean, data: any) => {
  try {
    active.value = data.index
    await tagsApi.edit({ id: data.record.id, data: { isTag: checked ? 1 : 0 } })
    active.value = -1
    data.record.isTag = checked
  } catch {
    active.value = -1
  }
}
</script>
