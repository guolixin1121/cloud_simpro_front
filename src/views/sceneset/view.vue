<template>
  <div class="breadcrumb">
    <router-link to="/sceneset/">场景集管理</router-link>
    <span class="breadcrumb--current">场景集详情</span>
  </div>
  <div class="min-main">
    <div class="cursor-pointer text-gray-400" @click="goback">
      <svg-icon icon="back" class="mr-2"></svg-icon>返回
    </div>
    <span class="title mb-5 mt-3">场景集详情</span>
    <a-spin :spinning="loading">
      <a-form :model="formState" :labelCol ="{ style: { width: '80px' } }"  style="width: 550px;">
        <a-form-item label="场景集ID">
          {{ formState.id }}
        </a-form-item>
        <a-form-item label="场景集名称">
          {{ formState.name }}
        </a-form-item>
        <a-form-item label="父场景集">
          {{ formState.parentName }}
        </a-form-item>
        <a-form-item label="标签">
          <ul class="view-list">
            <li class="mb-2" v-for="item in formState.labels_detail as any" :key="item">
              {{ item.display_name }}
            </li>
          </ul>
        </a-form-item>
        <a-form-item label="创建时间">
          {{ formState.create_time }}
        </a-form-item>
        <!-- <a-form-item label="修改时间">
          {{ formState.updateTime }}
        </a-form-item> -->
      </a-form>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
const id = useRoute().params.id

const formState = reactive({
  id: '',
  name: '',
  parentId: '',
  parentName: '',
  labels_detail: [],
  create_time: ''
})

const router = useRouter()
const goback = () => router.go(-1)

const loading = ref(false)
const getEditData = async () => {
  if(id !== '0') {
    loading.value = true
    const data = await api.scenesets.get(id)
    loading.value = false
    for(const prop in formState) {
      formState[prop as keyof typeof formState] = data[prop]
    }
  }
}

getEditData()
</script>