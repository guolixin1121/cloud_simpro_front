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
      <a-form-item label="所属场景集" name="parentId" :rules="[{ required: true, message: '请选择场景集!' }]">
        <tree-select v-model:value="formState.parentId" :api="getSceneSet"></tree-select>
      </a-form-item>
      <a-form-item label="标签">
        <scroll-transfer v-model:target-keys="formState.labels" :api="getScennTags" 
          :fieldNames="{label: 'display_name', value: 'id'}"
          :titles="['可选标签', '选中标签']"></scroll-transfer>
      </a-form-item>
      <a-form-item class=" ml-8" :wrapper-col="{ style: { paddingLeft: '100px' }}">
        <a-button @click="goback" class="mr-2">取消</a-button>
        <a-button type="primary" html-type="submit" :loading="loading">
          {{ isAdd ? '上传' : '修改' }}
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
const id = useRoute().params.id
const isAdd = id === '0'
const title =  isAdd ? '创建场景集' : '修改场景集'
const getSceneSet = (args: object) => api.scenesets.getSceneSets({ tree: 1, ...args} )
const getScennTags = (args: object) => api.tags.getTags({ tag_type: 2, ...args })

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
  
  isAdd 
    ? await api.scenesets.addSceneset(formState)
    : await api.scenesets.editSceneset({ id, data: {...formState} })

  loading.value = false
  message.info( isAdd ? '创建成功' : '修改成功')
  goback()
}

/****** 获取编辑数据 */
const getEditData = async () => {
   if(id !== '0') {
     const scene = await api.scenesets.getSceneSet(id)
     formState.name = scene.name
     formState.parentId = scene.parentId
     formState.labels = scene.labels
   }
}
getEditData()
</script>