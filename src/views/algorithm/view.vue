<template>
  <div class="breadcrumb">
    <router-link to="/algorithm/">算法管理</router-link>
    <span class="breadcrumb--current">查看</span>
  </div>
  <div class="min-main">
    <span class="title mb-5">算法详情</span>
    <a-form :model="formState" :labelCol="{ style: { width: '80px' } }" style="width: 55%">
      <a-form-item label="算法名称：">
        <span>{{ formState.name }}</span>
      </a-form-item>
      <!-- <a-form-item label="算法版本：">
        <span>{{ formState.version }}</span>
      </a-form-item> -->
      <a-form-item label="算法镜像：">
        <span style="word-break: break-all; white-space: break-spaces;">{{ formState.docker_path }}</span>
      </a-form-item>
      <a-form-item label="启动命令">
        <span style="word-break: break-all; white-space: break-spaces;">{{ formState.cmd }}</span>
      </a-form-item>
      <a-form-item label="控制在环">
        <span>{{ formState.is_in_ring }}</span>
      </a-form-item>
      <a-form-item label="描述">
        <span style="word-break: break-all; white-space: break-spaces;">{{ formState.desc }}</span>
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
  cmd: '',
  desc: undefined,
  create_time: undefined,
  create_user: undefined,
  is_in_ring: undefined
})

/****** 获取查看数据 */
const getLookData = async () => {
  const res = await api.algorithm.getList({ id })
  if(res.results?.length == 0 ) return 

  const data = res.results[0]
  for(const prop in formState) {
    formState[prop as keyof typeof formState] = data[prop]
  }
  formState.create_time = formatDate(data.create_time)
  formState.is_in_ring = data.is_in_ring ? '是' : '否'
}
getLookData()
</script>
