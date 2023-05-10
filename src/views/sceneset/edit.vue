<template>
  <div class="breadcrumb">
    <router-link to="/sceneset/">场景集管理</router-link>
    <span class="breadcrumb--current">{{ title }}</span>
  </div>
  <div class="min-main">
    <span class="title mb-5">{{ title }}</span>
    <a-form :model="formState" :labelCol ="{ style: { width: '100px' } }"  style="width: 550px;"
      @finish="add">
      <a-form-item label="场景集名称" name="name" :rules="[{ required: true, message: '请输入场景集名称!'}, { min: 2, max: 50, message: '场景名称长度为2到50位'}]">
        <a-input v-model:value="formState.name" :maxlength="50" placeholder="请输入场景集名称"></a-input>
      </a-form-item>
      <a-form-item label="父场景集" name="parentId">
        <tree-select v-model:value="formState.parentId" :api="getSceneSet" :fieldNames="{label: 'name', value: 'baidu_id'}"></tree-select>
      </a-form-item>
      <a-form-item label="标签">
        <scroll-transfer v-model:target-keys="formState.labels" :api="getSceneTags" 
          :fieldNames="{label: 'display_name', value: 'id'}"
          :titles="['可选标签', '选中标签']"></scroll-transfer>
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
const id = useRoute().params.id
const isAdd = id === '0'
const actionText = isAdd ? '创建' : '修改'
const title =  actionText + '场景集'
const currentApi = api.scenesets
const getSceneSet = (args: object) => currentApi.getList({ tree: 1, ...args} )
const getSceneTags = (args: object) => api.tags.getList({ tag_type: 2, ...args })

const formState = reactive({
  name: undefined,
  parentId: undefined,
  labels: [],
})

const loading = ref(false)
const router = useRouter()
const goback = () => router.go(-1)
const add = async () => {
  loading.value = true
  
  try {
    isAdd 
      ? await currentApi.add(formState)
      : await currentApi.edit({ id, data: {...formState} })

    message.info(`${actionText}成功`)
    goback()
  } finally {
    loading.value = false
  }
}

/****** 获取编辑数据 */
const getEditData = async () => {
   if(id !== '0') {
     const data = await currentApi.get(id)
     formState.name = data.name
     formState.parentId = data.parentId === -1 ? undefined : data.parentId
     formState.labels = data.labels
   }
}
getEditData()
</script>