<template>
  <search-form :items="formItems" @on-search="onSearch"></search-form>

  <div class="main">
    <div class="flex justify-between items-center">
      <span class="title">评测指标管理</span>
      <a-button type="primary" v-if="user.hasPermission('add')" @click=" router.push('/kpi/edit/0')">创建评测指标</a-button>
    </div>
    
    <Table 
      :api="currentApi.getList" 
      :query="query" 
      :columns="columns"
      :scroll="{ x: 1100 }">
      <template #bodyCell="{column, record}">
          <template v-if="column.dataIndex == 'labels_detail'">
            <a-tooltip :title="record.labels_detail.map((d: any) => d.display_name).join('  ')">
              <span v-for="label in record.labels_detail" :key="label.id" class="text-blue mr-2">
                {{ label.display_name }}
              </span>
            </a-tooltip>
          </template>

          <!-- <template v-else-if="column.dataIndex == 'type'">
            {{ getKpiTypeName(record.type)}}
          </template> -->
      </template>
    </Table>
  </div>
</template>
 
<script setup lang="ts">
// import { KpiTypeOptions, getKpiTypeName } from '@/utils/dict'
// store、api、useRouter等通过auto import自动导入的，直接在template、自定义函数等使用时无效，为undefined
/****** api */
const user = store.user
const currentApi = api.kpi

/****** 搜素区域 */
type Query = Record<string, any> 
const query: Query = ref({})
const formItems = ref<SearchFormItem[]>([
  { label: '名称', key: 'name', type: 'input', placeholder: '请输入评测指标名称'},
  { label: '类别', key: 'category', type: 'tree-select', api: currentApi.getTypes, fieldNames: { label: 'title', value: 'id'}, defaultValue: ''},
  { label: '创建时间', key: 'date', type: 'range-picker' }
])
const onSearch = (data: Query) => query.value = data

/****** 表格区域 */
const router = useRouter()
const columns = [
  { title: '评测指标ID', dataIndex: 'id', width: 120 },
  { title: '评测指标名称', dataIndex: 'name', ellipsis: true},
  { title: '指标类型', dataIndex: 'category_name', width: 150 },
  { title: '创建时间', dataIndex: 'create_date', width: 180 },
  { title: '修改时间', dataIndex: 'update_date', width: 180 },
  { title: '所属用户', dataIndex: 'create_user', width: 100, ellipsis: true },
  {
    title: '操作', dataIndex: 'actions', fixed: 'right', width: 150,
    actions: {
      '查看': ( data: RObject ) => router.push('/kpi/view/' + data.id) ,
      '编辑': {
        validate: ( data: RObject) => data.custom != 0,
        handler: ( data: RObject ) => router.push('/kpi/edit/' + data.id)
      },
      '删除': {
        validate: ( data: RObject) => data.custom !== 0,
        handler: async ({ id }: RObject ) => await currentApi.delete(id)
      }
    }
  }
]
 </script>
 