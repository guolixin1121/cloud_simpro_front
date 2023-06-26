<template>
  <div class="breadcrumb">
    <router-link to="/algorithm/">算法管理</router-link>
    <span class="breadcrumb--current">{{ title }}</span>
  </div>
  <div class="min-main">
    <div class="cursor-pointer text-gray-400" @click="goback"><svg-icon icon="back" class="mr-2"></svg-icon>返回</div>
    <span class="title mb-5 mt-3">算法详情</span>
    <a-form :model="formState" :labelCol="{ style: { width: '90px' } }" style="width: 55%" @finish="add">
      <a-form-item
        label="算法名称"
        name="name"
        :rules="[
          { required: true, message: '请输入算法名称' },
          { validator: () => checkChName(formState.name, 50) }
        ]"
      >
        <ch-input v-if="isAdd" v-model:value="formState.name" :maxlength="50" placeholder="请输入算法名称"></ch-input>
        <span v-else>{{ formState.name }}</span>
      </a-form-item>
      <!-- <a-form-item
        label="算法版本"
        name="name"
        :rules="[
          { required: true, message: '请输入算法版本' }
        ]"
      >
        <a-input v-model:value="formState.version" placeholder="请输入算法版本"></a-input>
      </a-form-item> -->
      <a-form-item
        label="镜像地址"
        name="docker_path"
        :rules="[
          { required: true, message: '请输入算法镜像地址' },
          { min: 1, max: 255, message: '镜像地址长度为1到255位' }
        ]"
      >
      <ch-input v-model:value="formState.docker_path" placeholder="请输入算法镜像" :maxlength="255"></ch-input>
      </a-form-item>
      <a-form-item label="控制在环" name="is_in_ring" :rules="[{ required: true, message: '请选择控制在环' }]">
        <a-select v-model:value="formState.is_in_ring" placeholder="请选择控制在环">
          <a-select-option key="1" value="1">是</a-select-option>
          <a-select-option key="0" value="0">否</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="算法描述" name="desc">
        <ch-input type="textarea" v-model:value="formState.desc" placeholder="请输入描述" :maxlength="255" rows="10"></ch-input>
      </a-form-item>
      <a-form-item class="ml-8" :wrapper-col="{ style: { paddingLeft: '80px' } }">
          <a-button class="mr-2" type="primary" html-type="submit" :loading="loading">
            {{ isAdd ? '创建' : '修改' }}
          </a-button>
          <a-button @click="goback">取消</a-button>
        </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { formatDate, checkChName } from '@/utils/tools'

const id = useRoute().params.id
const isAdd = id === '0'
const title = isAdd ? '创建算法' : '修改算法'

const formState = reactive<any>({
  name: undefined,
  version: '1',
  docker_path: undefined,
  desc: undefined,
  create_time: undefined,
  create_user: undefined,
  is_in_ring: undefined
})

const router = useRouter()
const goback = () => router.push('/algorithm')
const currentApi = api.algorithm
const loading = ref(false)
const add = async () => {
  try {
     loading.value = true
    isAdd ? await currentApi.add({ ...formState }) : await currentApi.edit({ id, data: { ...formState } })
    loading.value = false
    message.info(isAdd ? '创建成功' : '修改成功')
    goback()
  } catch {
    loading.value = false
  }
}

/****** 获取查看数据 */
const getLookData = async () => {
  if(id != '0') {
    const res = await api.algorithm.getList({ id })
    if(res.results?.length == 0 ) return 

    const data = res.results[0]
    formState.name = data.name
    formState.version = data.version
    formState.docker_path = data.docker_path
    formState.desc = data.desc
    formState.create_time = formatDate(data.create_time)
    formState.create_user = data.create_user
    formState.is_in_ring = data.is_in_ring ? '1' : '0'
  }
}
getLookData()
</script>
