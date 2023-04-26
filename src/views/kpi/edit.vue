<template>
  <div class="breadcrumb">
    <router-link to="/kpi/">评测指标管理</router-link>
    <span class="breadcrumb--current">{{ title }}</span>
  </div>
  <div class="min-main">
    <span class="title mb-5">{{ title }}</span>
    <a-form :model="formState" :labelCol="{ style: { width: '100px' } }" style="width: 550px" @finish="add">
      <a-form-item
        label="评测指标名称"
        name="name"
        :rules="[
          { required: true, message: '请输入评测指标名称!' },
          { min: 2, max: 50, message: '场景名称长度为2到50位' }
        ]"
      >
        <a-input v-model:value="formState.name" :maxlength="50" placeholder="请输入评测指标名称"></a-input>
      </a-form-item>
      <a-form-item label="评测指标选择" name="pyfile" :rules="[{ required: true, message: '请上传评测指标文件!' }]">
        <single-upload accept=".py" v-model:value="formState.pyfile"></single-upload>
        <!-- <a-upload accept=".xosc" :fileList="fileList" :before-upload="beforeUpload" @remove="onRemove" @change="onFileChange">
          <a-button> 选择文件 </a-button>
        </a-upload> -->
      </a-form-item>
      <a-form-item label="评测指标类型" name="kpi_type" :rules="[{ required: true, message: '请选择评测指标类型!' }]">
        <tree-select v-model:value="formState.kpi_type" :api="currentApi.getTypes" :fieldNames="{label: 'title', value: 'id'}"></tree-select>
      </a-form-item>
      <a-form-item label="描述">
        <a-textarea v-model:value="formState.desc" :rows="6"></a-textarea>
      </a-form-item>
      <a-form-item class=" ml-8" :wrapper-col="{ style: { paddingLeft: '100px' }}">
        <a-button type="primary" html-type="submit" :loading="loading">
          {{ actionText }}
        </a-button>
        <a-button @click="goback" class="ml-2">取消</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
// import type { UploadChangeParam } from 'ant-design-vue'

const id = useRoute().params.id
const isAdd = id === '0'
const actionText = isAdd ? '创建' : '修改'
const title =  actionText + '评测指标'
const currentApi = api.kpi

// const fileList = ref()
const formState = reactive({
  name: '',
  desc: '',
  kpi_type: undefined,
  pyfile: undefined,
})

const loading = ref(false)
const router = useRouter()
const goback = () => router.go(-1)
const add = async () => {
  loading.value = true

  try {
    isAdd
      ? await currentApi.add({ ...formState, source: 0 })
      : await currentApi.edit({ id, data: { ...formState, source: 0 } })

    message.info(`${actionText}成功`)
    goback()
  } finally {
    loading.value = false
  }
}

/****** 获取编辑数据 */
const getEditData = async () => {
  if (id !== '0') {
    const res = await api.kpi.getList({id})
    const data = res.results?.[0]
    formState.name = data.name
    formState.kpi_type = data.kpi_type
    formState.desc = data.desc
    formState.pyfile = data.pyfile
  }
}
getEditData()
</script>
