<template>
  <div class="breadcrumb">
    <span>我的场景</span>
    <a @click="goback()">具体场景</a>
    <span class="breadcrumb--current">场景集详情</span>
  </div>
  <div class="min-main">
    <span class="title mb-5">场景集详情</span>
    <a-spin :spinning="loading">
      <a-form :model="formState" :labelCol ="{ style: { width: '80px' } }"  style="width: 55%">
        <a-form-item label="场景集名称">
          {{ formState.name }}
        </a-form-item>
        <a-form-item label="场景集描述">
          <span class="break-text">{{ formState.desc }}</span>
        </a-form-item>
        <a-form-item label="标签">
          <ul class="view-list"  v-if="formState.labels_detail?.length > 0">
            <li class="mb-2" v-for="item in formState.labels_detail as any" :key="item">
              {{ item.display_name }}
            </li>
          </ul>
          <span v-else>无</span>
        </a-form-item>
        <a-form-item label="创建时间">
          {{ formState.create_time }}
        </a-form-item>
      </a-form>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { goback } from '@/utils/tools'

const id = useRoute().params.id

const formState = reactive({
  id: '',
  name: '',
  desc: '',
  labels_detail: [],
  create_time: ''
})

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