<template>
  <div class="breadcrumb">
    <router-link to="/my-sceneset/">具体场景</router-link>
    <span>场景集详情</span>
  </div>
  <div class="min-main">
    <span class="title mb-5">场景集详情</span>
    <a-spin :spinning="loading">
      <a-form :model="formState" :labelCol ="{ style: { width: '80px' } }"  style="width: 55%">
        <a-form-item label="场景集名称">
          {{ formState.name }}
        </a-form-item>
        <a-form-item label="场景集描述">
          <span class="break-text">{{ formState.desc || '--' }}</span>
        </a-form-item>
        <a-form-item label="标签">
          <ul class="view-list"  v-if="formState.labels_detail?.length > 0">
            <li v-for="item in formState.labels_detail as any" :key="item">
              {{ item.display_name }}
            </li>
          </ul>
          <span v-else>--</span>
        </a-form-item>
        <a-form-item label="创建时间">
          {{ formState.create_time }}
        </a-form-item>
      </a-form>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import useSetData from '@/hooks/useSetdata'
const id = useRoute().params.id

const formState = reactive({
  name: '',
  desc: '',
  labels_detail: [],
  create_time: ''
})

const { loading, setData } = useSetData()

setData(formState, api.scenesets.get, id)
</script>