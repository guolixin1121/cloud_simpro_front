<template>
  <div class="breadcrumb">
    <router-link to="/map-manage/">地图管理</router-link>
    <span class="breadcrumb--current">{{ title }}</span>
  </div>
  <div class="min-main">
    <span class="title mb-5">{{ title }}</span>
    <a-spin :spinning="dataLoading">
      <a-form :model="formState" :labelCol ="{ style: { width: '100px' } }"  style="width: 55%"
        @finish="add">
        <a-form-item label="地图集类型" name="isLeaf" :rules="[{ required: true, message: '请选择地图集类型'}]">
          <a-select v-if="isAdd" v-model:value="formState.isLeaf" :disabled="!isAdd"
            placeholder="请选择地图集类型">
            <a-select-option value="0">地图目录</a-select-option>
            <a-select-option value="1">地图集</a-select-option>
          </a-select>
          <div v-else>{{ formState.isLeaf ? "地图集" : "地图目录" }}</div>
        </a-form-item>
        <a-form-item label="所属地图目录" name="parentId" :rules="[{ required: formState.isLeaf == '1', message: '请选择地图目录'}]">
          <tree-select
            v-if="isAdd"
            placeholder="请选择所属地图目录"
            allowClear
            v-model:value="formState.parentId"
            v-model:selectNode="formState.parent"
            :api="currentApi.getList"
            :api-filter="(item: any) => !item.isLeaf"
            :check-leaf="false"
          >
          </tree-select>
          <div v-if="error" class="ant-form-item-explain-error" style="">地图目录不能超过四级</div>
          <span v-else>{{ formState.parentName }}</span>
        </a-form-item>

        <a-form-item label="地图集名称" name="name" 
          :rules="[
            { required: true, message: '请输入地图集名称'}, 
            { validator: () => checkChName(formState.name) }
          ]">
          <ch-input v-model:value="formState.name" :maxlength="32"
            placeholder="请输入地图集名称"></ch-input>
        </a-form-item>
        <a-form-item class=" ml-8" :wrapper-col="{ style: { paddingLeft: '100px' }}">
          <a-button type="primary" html-type="submit" :loading="loading">
            {{ actionText }}
          </a-button>
          <a-button @click="goback" class="ml-2">取消</a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { checkChName } from '@/utils/tools';

const { id } = useRoute().params
const { name } = useRoute().query
const isAdd = id === '0'
const actionText = isAdd ? '创建' : '修改'
const title =  actionText + '地图集'
const currentApi = api.mapsets

const formState = reactive({
  name: '',
  parentId: undefined,
  parent: {level: -1},
  parentName: '',
  isLeaf: '1'
})

const loading = ref(false)
const router = useRouter()
const goback = () => router.push('/map-manage/')
const add = async () => {
  if(error.value) return

  loading.value = true
  
  try {
    isAdd 
      ? await currentApi.add(formState)
      : await currentApi.edit({ id, data: {...formState} })

    message.info(`${actionText}成功`)
    goback()
  } finally {
    loading.value = false
  }
}

const error = ref(false)
watch(
  () => formState.parentId,
  () => {
    const { isLeaf, parent } = formState
    error.value = false
    if(isLeaf == '0' && parent.level > 2) {
      error.value = true
    }
  }
)

/****** 获取编辑数据 */
const dataLoading = ref(false)
const getEditData = async () => {
  if(id !== '0') {
    dataLoading.value = true
    const data = await currentApi.get({ id, data:{ name }})
    dataLoading.value = false
    formState.name = data.name
    formState.parentName = data.parentName
    formState.parentId = data.parentId === -1 ? undefined : data.parentId
    formState.isLeaf = data.isLeaf.toString()
  }
}
getEditData()
</script>