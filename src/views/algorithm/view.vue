<template>
  <div class="breadcrumb">
    <router-link to="/algorithm/">算法管理</router-link>
    <span class="breadcrumb--current">查看</span>
  </div>
  <div class="min-main">
    <div class="cursor-pointer text-gray-400" @click="goback"><svg-icon icon="back" class="mr-2"></svg-icon>返回</div>
    <span class="title mb-5 mt-3">算法详情</span>
    <a-form :model="formState" :labelCol="{ style: { width: '90px' } }" style="width: 55%">
      <a-form-item label="算法名称：" name="name">
        <span>{{ formState.name }}</span>
      </a-form-item>
      <!-- <a-form-item label="算法版本：" name="name">
        <span>{{ formState.version }}</span>
      </a-form-item> -->
      <a-form-item label="算法镜像：" name="name">
        <span style="word-break: break-all;">{{ formState.docker_path }}</span>
      </a-form-item>
      <a-form-item label="控制在环" name="name">
        <span>{{ formState ? '是' : '否' }}</span>
      </a-form-item>
      <a-form-item label="描述" name="name">
        <span style="word-break: break-all;">{{ formState.desc }}</span>
      </a-form-item>
      <a-form-item label="创建时间："
        ><span>{{ formState.create_time }}</span></a-form-item
      >
      <a-form-item label="所属用户："
        ><span>{{ formState.create_user }}</span></a-form-item
      >
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '@/utils/tools'

const id = useRoute().params.id

const formState = reactive<any>({
  name: undefined,
  version: undefined,
  docker_path: undefined,
  desc: undefined,
  create_time: undefined,
  create_user: undefined,
  is_in_ring: undefined
})

const router = useRouter()
const goback = () => router.go(-1)

/****** 获取查看数据 */
const getLookData = async () => {
  const res = await api.algorithm.getList({ id })
  if(res.results?.length == 0 ) return 

  const data = res.results[0]
  formState.name = data.name
  formState.version = data.version
  formState.docker_path = data.docker_path
  formState.desc = data.desc
  formState.create_time = formatDate(data.create_time)
  formState.create_user = data.create_user
  formState.is_in_ring = data.is_in_ring
}
getLookData()
</script>
