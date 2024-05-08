<template>
  <div class="breadcrumb">
    <router-link to="/dll/">动力学动态库</router-link>
    <span class="breadcrumb--current">{{ title }}</span>
  </div>
  <div class="min-main">
    <span class="title mb-5">{{ title }}</span>
    <a-form :model="formState" :labelCol="{ style: { width: '90px' } }" style="width: 55%" @finish="add">
      <a-form-item label="动态库名称：" name="name"
        :rules="[{ required: true, message: '请输入动态库名称'}]"
      >
        <ch-input v-if="isAdd" v-model:value="formState.name" :maxlength="50" placeholder="请输入动态库名称"></ch-input>
        <template v-else>{{ formState.name }}</template>
      </a-form-item>
      <a-form-item label="动态库文件：" name="file" :rules="[{ required: isAdd, message: '请上传动态库文件'}]">
        <single-upload
          class="inline-block pr-2"
          accept=".so"
          v-model:value="formState.file"
          :desc="'选择文件'"
        ></single-upload>
        <template v-if="!formState.file">{{ formState.so_url }}</template>
      </a-form-item>
     <a-form-item label="描述" name="name">
        <ch-input type="textarea" v-model:value="formState.desc" placeholder="请输入描述" :maxlength="255" rows="10"></ch-input>
      </a-form-item>
      <a-form-item :wrapper-col="{ style: { paddingLeft: '90px' } }">
        <a-button class="marginR-16" type="primary" html-type="submit" :loading="loading">
          {{ isAdd ? '上传' : '修改' }}
        </a-button>
        <a-button @click="goback">取消</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
const id = useRoute().params.id
const isAdd = id === '0'
const title = isAdd ? '上传动态库' : '修改动态库'
const dllApi = api.dll

const formState = reactive<any>({
  name: undefined,
  file: null,
  so_url: '',
  desc: ''
})

const loading = ref(false)
const router = useRouter()
const goback = () => router.push('/dll')
const add = async () => {
  loading.value = true
  const params: any = {
    name: formState.name,
    file: formState.file,
    desc: formState.desc
  }

  if(!params.file) delete params.file

  try {
    isAdd ? await dllApi.add({ ...params }) : await dllApi.edit({ id, data: { ...params } })
    loading.value = false
    message.info(isAdd ? '新建成功' : '修改成功')
    goback()
  } catch {
    loading.value = false
  }
}

/****** 获取查看数据 */
const getLookData = async () => {
  // 非上传
  if (id !== '0') {
    const res = await dllApi.get(id)
    formState.name = res.name
    formState.desc = res.desc
    formState.so_url = res.so_url
  }
}
getLookData()
</script>
