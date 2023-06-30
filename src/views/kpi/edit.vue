<template>
  <div class="breadcrumb">
    <router-link to="/kpi/">评测指标管理</router-link>
    <span class="breadcrumb--current">{{ title }}</span>
  </div>
  <div class="min-main">
    <span class="title mb-5">{{ title }}</span>
    <a-form :model="formState" :labelCol="{ style: { width: '100px' } }" style="width: 55%" @finish="add">
      
      <a-form-item label="评测指标类型" name="category" :rules="[{ required: true, message: '请选择评测指标类型'}]">
        <tree-select 
          v-model:value="formState.category" 
          :api="currentApi.getTypes" 
          :check-leaf="false"
          :fieldNames="{ label: 'title', value: 'id' }"
          placeholder="请选择评测指标类型"></tree-select>
      </a-form-item>
      <a-form-item
        label="评测指标名称"
        name="name"
        :rules="[
          { required: true, message: '请输入评测指标名称'},
          { validator: () => checkChName(formState.name) }
        ]"
      >
        <ch-input v-model:value="formState.name" :maxlength="32" v-if="isAdd"
            placeholder="请输入评测指标名称"></ch-input>
        <div v-else>{{ formState.name }}</div>
      </a-form-item>
      <a-form-item label="评测指标文件" name="pyfile" :rules="[{ required: isAdd, message: '请上传评测指标文件'}]">
        <single-upload v-if="isAdd" accept=".py" v-model:value="formState.pyfile"></single-upload>
        {{ formState.py_url }}
      </a-form-item>
      <a-form-item label="描述">
        <ch-input type="textarea" v-model:value="formState.desc" placeholder="请输入描述" :maxlength="255" rows="10"></ch-input>
      </a-form-item>
      <a-form-item :wrapper-col="{ style: { paddingLeft: '100px' }}">
        <a-button type="primary" html-type="submit" :loading="loading">
          {{ actionText }}
        </a-button>
        <a-button @click="goback" class="ml-2">取消</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { checkChName } from '@/utils/tools';

const id = useRoute().params.id
const isAdd = id === '0'
const actionText = isAdd ? '创建' : '修改'
const title =  actionText + '评测指标'
const currentApi = api.kpi

const formState = reactive({
  name: '',
  desc: '',
  category: undefined,
  pyfile: undefined,
  py_url: ''
})

const loading = ref(false)
const router = useRouter()
const goback = () => router.push('/kpi')
const add = async () => {
  loading.value = true

  const data = {...formState}

  try {
    isAdd
      ? await currentApi.add( data)
      : await currentApi.edit({ id, data })

    message.info(`${actionText}成功`)
    goback()
  } finally {
    loading.value = false
  }
}

// 仅能用自定义的类别
// const typesOptions = ref([])
// const getTypes = async () => {
//   const res = await currentApi.getTypes()
//   const options = res.filter((d: RObject) => d.title === '自定义')
//   typesOptions.value = options?.[0].children?.map((d: RObject) => ({ label: d.title, value: d.id }))
// }
// getTypes()

/****** 获取编辑数据 */
const getEditData = async () => {
  if (id !== '0') {
    const res = await api.kpi.getList({id})
    const data = res.results?.[0]
    formState.name = data.name
    formState.category = data.category
    formState.desc = data.desc
    formState.py_url = data.py_url
  }
}
getEditData()
</script>
