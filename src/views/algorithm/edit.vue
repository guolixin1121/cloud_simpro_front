<template>
  <div class="breadcrumb">
    <router-link to="/algorithm/">算法管理</router-link>
    <span class="breadcrumb--current">查看</span>
  </div>
  <div class="min-main">
    <span class="title mb-5">算法详情</span>
    <a-form :model="formState" :labelCol="{ style: { width: '90px' } }" style="width: 550px">
      <a-form-item label="算法名称：" name="name">
        <a-input :disabled="true" v-model:value="formState.name" maxlength="50" placeholder="请输入地图名称"></a-input>
      </a-form-item>
      <a-form-item label="算法版本：" name="name">
        <a-input :disabled="true" v-model:value="formState.version" maxlength="50" placeholder="请输入算法版本："></a-input>
      </a-form-item>
      <a-form-item label="算法镜像：" name="name">
        <a-input :disabled="true" v-model:value="formState.docker_path" maxlength="50" placeholder="请输入算法版本："></a-input>
      </a-form-item>
      <a-form-item label="描述" name="name">
        <a-textarea :disabled="true" v-model:value="formState.desc" placeholder="请输入描述" rows="10" style="resize: none" />
      </a-form-item>
      <a-form-item label="创建时间："
        ><span>{{ formState.create_time }}</span></a-form-item
      >
      <a-form-item label="所属用户："
        ><span>{{ formState.create_user }}</span></a-form-item
      >
      <a-form-item class="ml-8" :wrapper-col="{ style: { paddingLeft: '80px' } }">
        <a-button @click="goback" class="mr-2">取消</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '@/utils/tools'

const id = useRoute().params.id
const algorithmApi = api.algorithm

const formState = reactive<any>({
  name: undefined,
  version: undefined,
  docker_path: undefined,
  desc: undefined,
  create_time: undefined,
  create_user: undefined
})

const router = useRouter()
const goback = () => router.go(-1)

/****** 获取查看数据 */
const getLookData = async () => {
  const res = await algorithmApi.getList({ id })
  formState.name = res?.results[0].name
  formState.version = res?.results[0].version
  formState.docker_path = res?.results[0].docker_path
  formState.desc = res?.results[0].desc
  formState.create_time = formatDate(res?.results[0].create_time)
  formState.create_user = res?.results[0].create_user
}
getLookData()
</script>
