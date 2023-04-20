<template>
  <div class="main" >
    <search-form :items="formItems" @on-search="onSearch"></search-form>

    <div class="flex justify-between items-center">
      <span class="title">场景管理</span>
      <a-button type="primary" v-if="user.hasPermission('add')" @click=" router.push('/scene/edit/0')">上传场景</a-button>
    </div>
    
    <Table 
      :api="sceneApi.getScenes" 
      :query="query" 
      :columns="columns"
      :scroll="{ x: 1200, y: 420 }">
      <template #bodyCell="{column, record}">
          <template v-if="column.dataIndex == 'labels_detail'">
            <a-tooltip :title="record.labels_detail.map((d: any) => d.display_name).join('  ')">
              <span v-for="label in record.labels_detail" :key="label.id" class="text-blue mr-2">
                {{ label.display_name }}
              </span>
            </a-tooltip>
          </template>

          <template v-else-if="column.dataIndex == 'adsSource'">
            {{ getSceneSourceName(record.adsSource)}}
          </template>
      </template>
    </Table>
  </div>
</template>
 
<script setup lang="ts">
import { SceneSourceOptions, getSceneSourceName } from '@/utils/dict'
// store、api、useRouter等通过auto import自动导入的，直接在template、自定义函数等使用时无效，为undefined
/****** api */
const user = store.user
const sceneApi = api.scene
const tagsApi = (args: object) => api.tags.getTags({ tag_type: 3, ...args })

/****** 搜素区域 */
type Query = Record<string, any> 
const query: Query = ref({})
const formItems = ref<SearchFormItem[]>([
  { label: '名称', key: 'adsName', type: 'input', placeholder: '请输入场景名称或ID'},
  { label: '场景来源', key: 'adsSource', type: 'select', options: SceneSourceOptions, defaultValue: ''},
  { label: '标签', key: 'labels', type: 'select', mode: 'multiple', api: tagsApi, fieldNames: { label: 'display_name', value: 'name'}, defaultValue: ['']},
  { label: '创建时间', key: 'date', type: 'range-picker' }
])
const onSearch = (data: Query) => query.value = data

/****** 表格区域 */
const router = useRouter()
const columns = [
  { title: '场景ID', dataIndex: 'id', width: 90 },
  { title: '场景名称', dataIndex: 'adsName', width: 150, ellipsis: true},
  { title: '场景来源', dataIndex: 'adsSource', width: 90 },
  { title: '标签', dataIndex: 'labels_detail', ellipsis: true },
  { title: '创建时间', dataIndex: 'createTime', width: 180 },
  { title: '修改时间', dataIndex: 'updateTime', width: 180 },
  { title: '所属用户', dataIndex: 'createUser', width: 150, ellipsis: true },
  {
    title: '操作', dataIndex: 'actions', fixed: 'right', width: 150,
    actions: {
      '查看': ( data: any ) => router.push('/scene/view/' + data.id) ,
      '编辑': ( data: any ) => router.push('/scene/edit/' + data.id) ,
      '删除': async ({ id }: { id: string} ) => await api.scene.deleteScene(id)
    }
  }
]
 </script>
 