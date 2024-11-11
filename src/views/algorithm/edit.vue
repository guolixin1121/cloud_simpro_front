<template>
  <div class="breadcrumb">
    <router-link to="/algorithm/">算法管理</router-link>
    <span class="breadcrumb--current">{{ title }}</span>
  </div>
  <div class="min-main">
    <span class="title mb-5">{{ title }}</span>
    <a-form :model="formState" :labelCol="{ style: { width: '100px' } }" style="width: 55%" @finish="add">
      <a-form-item label="算法名称" name="name"
        :rules="[{ required: true, message: '请输入算法名称' }]"
      >
        <ch-input v-if="isAdd" v-model:value="formState.name" :maxlength="50" placeholder="请输入算法名称"></ch-input>
        <span v-else>{{ formState.name }}</span>
      </a-form-item>
      <a-form-item label="联仿接口类型" name="interface" :rules="[{ required: true, message: '请选择联仿接口类型' }]">
        <a-select v-model:value="formState.interface" placeholder="请选择联仿接口类型">
          <a-select-option key="1" value="CAPI">CAPI</a-select-option>
          <a-select-option key="0" value="OSI">OSI</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="镜像地址"
        name="docker_path"
        :rules="[
          { required: true, message: '请输入算法镜像地址' },
          { min: 1, max: 255, message: '镜像地址长度为1到255位' },
          { validator: () => checkEmpty(formState.docker_path) }
        ]"
      >
      <ch-input v-model:value="formState.docker_path" placeholder="镜像地址结构：harbor.saimo.com:20080/ad/********" :maxlength="255"></ch-input>
      </a-form-item>
      <a-form-item
        label="启动命令"
        name="cmd"
        :rules="[
          { required: true, message: '请输入启动命令' },
          { min: 1, max: 255, message: '镜像地址长度为1到255位' },
          { validator: () => checkEmpty(formState.cmd) }
        ]"
      >
      <ch-input v-model:value="formState.cmd" placeholder="请输入启动命令" :maxlength="255"></ch-input>
      </a-form-item>
      <a-form-item label="控制在环" name="is_in_ring" :rules="[{ required: true, message: '请选择控制在环' }]">
        <a-select v-model:value="formState.is_in_ring" placeholder="请选择控制在环">
          <a-select-option key="1" value="1">是</a-select-option>
          <a-select-option key="0" value="0">否</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="感知在环" name="perception" :rules="[{ required: true, message: '请选择感知在环' }]">
        <a-select v-model:value="formState.perception" placeholder="请选择感知在环">
          <a-select-option key="1" value="1">是</a-select-option>
          <a-select-option key="0" value="0">否</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="算法描述" name="desc">
        <ch-input type="textarea" v-model:value="formState.desc" placeholder="请输入描述" :maxlength="255" rows="10"></ch-input>
      </a-form-item>
      <a-form-item :wrapper-col="{ style: { paddingLeft: '100px' } }">
        <a-button class="marginR-16" type="primary" html-type="submit" :loading="loading">
          {{ isAdd ? '创建' : '修改' }}
        </a-button>
        <a-button @click="goback">取消</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { formatDate, checkEmpty } from '@/utils/tools'

const id = useRoute().params.id
const isAdd = !id || id === '0'
const title = isAdd ? '创建算法' : '修改算法'

const formState = reactive<any>({
  name: undefined,
  interface: undefined,
  version: '1',
  docker_path: undefined,
  cmd: undefined,
  desc: undefined,
  perception: undefined,
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
    message.success(isAdd ? '创建成功' : '修改成功')
    goback()
  } catch {
    loading.value = false
  }
}

/****** 获取查看数据 */
const getLookData = async () => {
  if(!isAdd) {
    const data = await api.algorithm.get(id)
    // if(res.results?.length == 0 ) return 

    // const data = res.results[0]
    for(const prop in formState) {
      formState[prop as keyof typeof formState] = data[prop]
    }
    formState.create_time = formatDate(data.create_time)
    formState.is_in_ring = data.is_in_ring ? '1' : '0'
    formState.perception = data.perception ? '1' : '0'
  }
}
getLookData()
</script>
