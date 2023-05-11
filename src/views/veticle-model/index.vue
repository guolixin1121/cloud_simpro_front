<template>
  <search-form :items="formItems" @on-search="onSearch" :query="query"></search-form>

  <div class="main">
    <div class="flex justify-between items-center">
      <!-- <span class="title">地图管理</span> -->
      <div>
        <a-button type="primary" class="mr-2" v-if="user.hasPermission('add')" @click="() => add('')">新建</a-button>
        <a-button v-if="user.hasPermission('add')" @click="() => (importVisible = true)">导入外部模型</a-button>
      </div>
      <a-checkbox v-model:checked="checked" class="table_model" @change="() => selectModel(checked)">我的模型</a-checkbox>
    </div>
    <Table :api="veticleModelApi.getList" :query="query" :columns="columns" :scroll="{ x: 1200, y: 'auto' }">
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex == 'type'">
          <span v-if="record.type === 1">导入</span><span v-else-if="record.type === 2">新建</span> <span v-else>全部</span>
        </template>
        <template v-if="column.dataIndex == 'direct'">
          <span v-if="record.direct === 1">简单转向模型</span>
          <span v-else-if="record.direct === 2">C-EPS模型</span>
          <span v-else-if="record.direct === 3">R-EPS模型</span>
          <span v-else>全部</span>
        </template>
        <template v-if="column.dataIndex === 'power'">
          <span v-if="record.power === 1">燃油车</span>
          <span v-else>电动车</span>
        </template>
        <template v-if="column.dataIndex === 'is_share'">
          <a-switch
            :disabled="record.user !== user.user.userId"
            :checked="record.is_share"
            :loading="index === active ? true : false"
            @change="(checked: boolean)=>changeShare(checked, record, index)"
          />
        </template>
      </template>
    </Table>
    <a-modal
      v-model:visible="importVisible"
      class="importOutModel-containter"
      title="导入外部模型"
      @cancel="cancleMadol"
      @ok="sureMadol"
    >
      <span class="select-doc">选择模型文件</span>
      <single-upload class="ml-2" accept=".par" v-model:value="fileList" :desc="'点击上传'"></single-upload>
      <div class="desc mt-2">支持格式：.par，单个文件不能超过50MB。</div>
    </a-modal>
    <a-modal v-model:visible="visible" title="复制模型" :mask-closable="false" @ok="handleOk">
      <p>
        模型名称：
        <a-input
          v-model:value="copyVal.name"
          :maxlength="100"
          :style="{ width: '176px' }"
          placeholder="模型名称"
          onkeyup="value=value.replace(/[^\w\u4E00-\u9FA5,]/g, '').replaceAll('_','')"
        />
        <span v-if="copyVal.name === '' && showTip" class="error">模型名称不能为空</span>
      </p>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
// import type { UploadChangeParam } from 'ant-design-vue'
import { typeList } from '@/utils/dict'
// store、api、useRouter等通过auto import自动导入的，直接在template、自定义函数等使用时无效，为undefined
/****** api */
const user = store.user
const veticleModelApi: any = api.veticleModel
/****** 搜素区域 */
const copyVal = ref<any>('')
const showTip = ref(false)
const fileList = ref<any>()
const importVisible = ref(false)
const visible = ref(false)
const active = ref(-1)
type Query = Record<string, any>
const query: Query = ref({})
const checked = ref(false)
const formItems = ref<SearchFormItem[]>([
  { label: '名称', key: 'name', type: 'input', maxlength: '100', placeholder: '请输入模型或用户名称' },
  {
    label: '类型',
    key: 'type',
    type: 'select',
    options: typeList,
    defaultValue: ''
  },
  {
    label: '转向模型',
    key: 'direct',
    type: 'select',
    api: () => veticleModelApi.getTurnModel({ query: ['direct_model'] }),
    fieldNames: { label: 'name', value: 'key', apiField: 'direct_model' },
    defaultValue: ''
  },
  {
    label: '动力形式',
    key: 'power',
    type: 'select',
    api: () => veticleModelApi.getTurnModel({ query: ['power_type'] }),
    fieldNames: { label: 'name', value: 'key', apiField: 'power_type' },
    defaultValue: ''
  },
  { label: '创建时间', key: 'create_time', type: 'range-picker' }
])
const onSearch = (data: Query) => {
  query.value = { ...data, owner: checked.value ? 1 : 0 }
}
/****** 表格区域 */
const columns = [
  { title: '模型ID', dataIndex: 'id', width: 90 },
  { title: '模型名称', dataIndex: 'name', width: 150, ellipsis: true },
  { title: '用户名', dataIndex: 'username', width: 130 },
  { title: '类型', dataIndex: 'type', width: 80, ellipsis: true },
  { title: '转向模型', dataIndex: 'direct', width: 120, ellipsis: true },
  { title: '动力形式', dataIndex: 'power', width: 90, ellipsis: true },
  { title: '是否共享', dataIndex: 'is_share', width: 90, ellipsis: true },
  { title: '创建时间', dataIndex: 'create_date', width: 180 },
  { title: '修改时间', dataIndex: 'update_date', width: 180, ellipsis: true },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 200,
    actions: {
      查看: (data: any) => gotoVeticlePro(data.id, '?type=look'),
      编辑: (data: any) => gotoVeticlePro(data.id, '?type=edit'),
      复制: (data: any) => copy(data),
      删除: async ({ id }: { id: string }) => await veticleModelApi.delete(id)
    }
  }
]
// 我的模型选择
const selectModel = async (val: boolean) => {
  query.value = { ...query.value, owner: val ? 1 : 0 }
}
const changeShare = async (checked: boolean, val: any, index: number) => {
  try {
    active.value = index
    await veticleModelApi.edit({ id: val.id, data: { is_share: checked } })
    active.value = -1
    val.is_share = checked
  } catch {
    active.value = -1
  }
}
const add = async (template_id = '') => {
  const res = await veticleModelApi.add({ template_id })
  gotoVeticlePro(res.id, '?type=add')
}
const gotoVeticlePro = (id: string | number, params?: string) => {
  window.open('/vehicle_front/model/carBody/' + id + params, '_blank')
}
const cancleMadol = () => {
  fileList.value = []
  importVisible.value = false
}
const sureMadol = async () => {
  if (!fileList.value) {
    message.warning('请先选择文件再上传')
    return
  }
  importVisible.value = false
  await veticleModelApi.upload({ file: fileList.value })
  message.success('上传成功')
  fileList.value = []
  onSearch({})
}
const copy = (record: string) => {
  visible.value = true
  copyVal.value = record
}
const handleOk = async () => {
  if (copyVal.value.name !== '') {
    await veticleModelApi.add({ template_id: copyVal.value.id, name: copyVal.value.name })
    visible.value = false
    onSearch({ ...query.value, page: 1 })
  } else {
    showTip.value = true
  }
}
</script>
