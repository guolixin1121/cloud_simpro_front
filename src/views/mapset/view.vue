<template>
  <div class="breadcrumb">
    <router-link to="/mapset/">地图集管理</router-link>
    <span class="breadcrumb--current">地图集详情</span>
  </div>
  <div class="min-main">
    <div class="cursor-pointer text-gray-400" @click="goback">
      <svg-icon icon="back" class="mr-2"></svg-icon>返回
    </div>
    <span class="title mb-5 mt-3">地图集详情</span>
    <a-spin :spinning="loading">
      <a-form :model="formState" :labelCol ="{ style: { width: '80px' } }"  style="width: 550px;">
        <a-form-item label="地图集ID">
          {{ formState.id }}
        </a-form-item>
        <a-form-item label="地图集名称">
          {{ formState.name }}
        </a-form-item>
        <a-form-item label="地图目录">
          {{ formState.parentName }}
        </a-form-item>
      </a-form>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
const { id } = useRoute().params
const { name } = useRoute().query

const formState = reactive({
  id: '',
  name: '',
  parentId: '',
  parentName: ''
})

const router = useRouter()
const goback = () => router.push('/mapset/')

const loading = ref(false)
const getEditData = async () => {
  if(id !== '0') {
    loading.value = true
    const data = await api.mapsets.get({id, data: {name}})
    loading.value = false
    for(const prop in formState) {
      formState[prop as keyof typeof formState] = data[prop]
    }
  }
}

getEditData()
</script>