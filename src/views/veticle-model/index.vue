<template>
  <search-form class="reactive-form" :items="formItems" @search="onSearch" :query="query"></search-form>

  <div class="main">
    <div class="flex justify-between items-center">
      <div class="flex items-center">
        <span class="title mr-4">动力学模型列表</span>
        <a-checkbox v-model:checked="checked" class="table_model" @change="() => selectModel(checked)">我的模型</a-checkbox>
      </div>
      <div>
        <a-button style="margin-right: 16px" v-if="user.hasPermission('add')" @click="() => (importVisible = true)">导入外部模型</a-button>
        <a-button type="primary" v-if="user.hasPermission('add')" @click="() => add('')">创建模型</a-button>
      </div>
    </div>
    <Table
      ref="table"
      :api="veticleModelApi.getList"
      :query="query"
      :columns="columns"
      :scroll="{ x: 1500, y: 'auto' }"
    >
      <template #bodyCell="{ column, record, index }">
        <!-- <template v-if="column.dataIndex == 'type'">
          <span v-if="record.type === 1">导入</span><span v-else-if="record.type === 2">创建</span> <span v-else>全部</span>
        </template> -->
        <template v-if="column.dataIndex == 'direct'">
          <span v-if="record.direct === 1">简单转向模型</span>
          <span v-else-if="record.direct === 2">C-EPS模型</span>
          <span v-else-if="record.direct === 3">R-EPS模型</span>
          <span v-else>全部</span>
        </template>
        <template v-if="column.dataIndex == 'version_count'">
          <a class="text-blue inline-block w-full" @click="gotoVersion(record)">
            {{ record.version_count }}
          </a>
        </template>
        <template v-if="column.dataIndex === 'power'">
          <span v-if="record.power === 1">燃油车</span>
          <span v-else>电动车</span>
        </template>
        <template v-if="column.dataIndex === 'is_share'">
          <a-switch
            checked-children="ON"
            un-checked-children="OFF"
            :disabled="record.username !== user.user.username"
            :checked="record.is_share"
            :loading="index === active ? true : false"
            @change="(checked: boolean)=>changeShare(checked, record, index)"
          />
        </template>
      </template>
    </Table>
    <a-modal
      v-model:visible="importVisible"
      title="导入外部模型"
      :footer="null"
      @cancel="cancelModal"
    >
      <div class="modal-content">
        <span class="select-doc">选择模型文件</span>
        <single-upload class="ml-2" accept=".par" v-model:value="fileList" :text="'点击上传'"></single-upload>
        <div class="desc mt-2">支持格式：.par，单个文件不能超过50MB。</div>
      </div>
      <div class="modal-buttons">
        <a-button @click="cancelModal" class="marginR-16">取消</a-button>
        <a-button @click="confirmModal" :loading="loading" type="primary">确定</a-button>
      </div>
    </a-modal>
    <a-modal v-model:visible="visible" 
      title="复制模型"
      :footer="null" :mask-closable="false">
      <div class="modal-content">
        模型名称：
        <a-input
          v-model:value="copyVal.name"
          :maxlength="100"
          :style="{ width: '70%' }"
          placeholder="模型名称"
        />
          <!-- onkeyup="value=value.replace(/[^\w\u4E00-\u9FA5,]/g, '').replaceAll('_','')" -->
        <span v-if="copyVal.name === '' && showTip" class="error">模型名称不能为空</span>
      </div>
      <div class="modal-buttons">
        <a-button @click="visible = false" class="marginR-16">取消</a-button>
        <a-button @click="confirmCopy" :loading="loading" type="primary">确定</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
// import type { UploadChangeParam } from 'ant-design-vue'
// import { typeList } from '@/utils/dict'
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
  // {
  //   label: '类型',
  //   key: 'type',
  //   type: 'select',
  //   options: typeList,
  //   defaultValue: ''
  // },
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
  { title: '模型ID', dataIndex: 'vehicle_no', width: 180 },
  { title: '模型名称', dataIndex: 'name', width: 200 },
  { title: '版本数量', dataIndex: 'version_count', width: 120 },
  // { title: '类型', dataIndex: 'type', width: 80, ellipsis: true },
  { title: '转向模型', dataIndex: 'direct_name', width: 200 },
  { title: '动力形式', dataIndex: 'power_name', width: 90 },
  { title: '是否共享', dataIndex: 'is_share', width: 100},
  { title: '创建时间', dataIndex: 'create_date', width: 180 },
  // { title: '修改时间', dataIndex: 'update_date', width: 180, ellipsis: true },
  { title: '所属用户', dataIndex: 'username', width: 150 },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 180,
    actions: {
      查看: (data: any) => gotoVeticlePro(data.latest_dynamic_vehicle_id, '?type=look'),
      编辑: (data: any) => gotoVeticlePro(data.latest_dynamic_vehicle_id, '?type=edit'),
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
    await veticleModelApi.editShare({ id: val.id, data: { is_share: checked } })
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

const table = ref()
const gotoVeticlePro = (id: string | number, params?: string) => {
  const modelWindow = window.open('/vehicle_front/model/carBody/' + id + params)
  const timer = setInterval(() => {
    if(modelWindow?.closed) {
      clearInterval(timer)
      table?.value.refresh()
    }
  }, 500)
}

const loading = ref(false)
const confirmModal = async () => {
  if (!fileList.value) {
    message.warning('请先选择文件再上传')
    return
  }
  try{
    loading.value = true
    await veticleModelApi.upload({ file: fileList.value, name: fileList.value.name })
    message.success('上传成功')
    importVisible.value = false
    loading.value = false
    fileList.value = []
    onSearch({})
  } finally {
    loading.value = false
  }
}

// import { SStorage } from '../../utils/storage'
const router = useRouter()
const preRoute = router.currentRoute.value.path
const gotoVersion = (record: any) => {
  const versionUrlPath = '/veticle-model/version/' + record.id
  // SStorage.remove(versionUrlPath + ':table-page')
  router.push({ path: versionUrlPath, query: { preRoute } })
}

const cancelModal = () => {
  fileList.value = []
  importVisible.value = false
}

const copy = (record: RObject) => {
  visible.value = true
  copyVal.value = { ...record }
}
const confirmCopy = async () => {
  if (copyVal.value.name !== '') {
    try {
      loading.value = true
      await veticleModelApi.add({ template_id: copyVal.value.id, name: copyVal.value.name })
      visible.value = false
      loading.value = false
      onSearch({ ...query.value, page: 1 })
    } finally {
      loading.value = false
    }
  } else {
    showTip.value = true
  }
}
</script>
