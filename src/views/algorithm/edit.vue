<template>
  <div class="breadcrumb">
    <router-link to="/algorithm/">算法管理</router-link>
    <span class="breadcrumb--current">查看</span>
  </div>
  <div class="min-main">
    <div class="cursor-pointer" @click="goback"><svg-icon icon="back" class="mr-2"></svg-icon>返回</div>
    <span class="title mb-5 mt-3">算法详情</span>
    <a-form :model="formState" :labelCol="{ style: { width: '90px' } }" style="width: 550px">
      <a-form-item label="算法名称：" name="name">
        <span>{{ formState.name }}</span>
      </a-form-item>
      <a-form-item label="算法版本：" name="name">
        <span>{{ formState.version }}</span>
      </a-form-item>
      <a-form-item label="算法镜像：" name="name">
        <span>{{ formState.docker_path }}</span>
      </a-form-item>
      <a-form-item label="描述" name="name">
        <span>{{ formState.desc }}</span>
      </a-form-item>
      <a-form-item label="创建时间："
        ><span>{{ formState.create_time }}</span></a-form-item
      >
      <a-form-item label="所属用户："
        ><span>{{ formState.create_user }}</span></a-form-item
      >
      <!-- <a-form-item class="ml-8" :wrapper-col="{ style: { paddingLeft: '80px' } }">
        <a-button @click="goback" class="mr-2">取消</a-button>
      </a-form-item> -->
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
