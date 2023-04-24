<template>
  <div class="main">
    <search-form :items="formItems" @on-search="onSearch"></search-form>
    <div class="flex justify-between items-center">
      <span class="title">标签管理</span>
      <a-button type="primary" v-if="user.hasPermission('add')" @click="router.push('/tags/edit/0')">创建标签</a-button>
    </div>
    <Table :api="tagsApi.getTags" :query="query" :columns="columns" :scroll="{ x: 1200, y: 420 }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex == 'isTag'">
          <a-tooltip :title="record.isTag">
            <a class="text-blue">
              {{ record.isTag }}
            </a>
          </a-tooltip>
        </template>
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { SceneSourceOptions } from '@/utils/dict'
/****** api */
const user = store.user
const tagsApi = api.tags
/****** 搜素区域 */
type Query = Record<string, any>
const query: Query = ref({})
const formItems = ref<SearchFormItem[]>([
  { label: '名称', key: 'id', type: 'input', placeholder: '请输入标签名称或ID' },
  { label: '标签类型', key: 'tag_type', type: 'select', options: SceneSourceOptions, defaultValue: '' },
  { label: '打标', key: 'isTag', type: 'select', options: SceneSourceOptions, defaultValue: '' },
  { label: '创建时间', key: 'create_date', type: 'range-picker' }
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
  { title: '标签类型', dataIndex: 'tag_type', width: 80, ellipsis: true },
  { title: '是否可打标', dataIndex: 'isTag', width: 80, ellipsis: true },
  { title: '创建时间', dataIndex: 'create_date', width: 140 },
  { title: '修改时间', dataIndex: 'update_date', width: 140 },
  { title: '所属用户', dataIndex: 'user', width: 80, ellipsis: true },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 120,
    actions: {
      查看: (data: any) => router.push('/tags/edit/' + data.id + '?type=0'),
      编辑: (data: any) => router.push('/tags/edit/' + data.id),
      删除: async ({ id }: { id: string }) => await tagsApi.deleteTags(id)
    }
  }
]
</script>
