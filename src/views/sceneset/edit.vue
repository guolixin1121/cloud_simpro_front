<template>
  <div class="breadcrumb">
    <router-link to="/sceneset/">场景集管理</router-link>
    <span class="breadcrumb--current">{{ title }}</span>
  </div>
  <div class="min-main">
    <span class="title mb-5">{{ title }}</span>
    <a-spin :spinning="dataLoading">
      <a-form :model="formState" :labelCol ="{ style: { width: '100px' } }"  style="width: 550px;"
        @finish="add">
        <a-form-item label="场景集类型"  name="isLeaf" :rules="[{ required: true, message: '请选择场景集类型'}]">
          <a-select v-if="isAdd" v-model:value="formState.isLeaf">
            <a-select-option value="0">场景目录</a-select-option>
            <a-select-option value="1">场景集</a-select-option>
          </a-select>
          <div v-else>{{ formState.isLeaf ? "场景集" : '场景目录' }}</div>
        </a-form-item>
        <a-form-item label="所属场景目录" name="parentId" 
          :rules="[{ required: true && formState.isLeaf == '1', message: '请选择所属场景目录'}]">
          <tree-select
            v-if="isAdd"
            placeholder="请选择所属场景目录"
            allowClear
            v-model:value="formState.parentId"
            v-model:selectNode="formState.parent"
            :api="baseApi.scenesets.getList"
            :api-filter="(item: any) => !item.isLeaf"
            :check-leaf="false"
          >
          </tree-select>
          <!-- <tree-select 
            v-if="isAdd"
            v-model:value="formState.parentId" 
            v-model:selectNode="formState.parent"
            placeholder="请选择所属场景目录"
            :show-search="false"
            :api="baseApi.scenesets.getList"
            :api-filter="(item: any) => !item.isLeaf"
            :query="{version: 2}"
            :lazy="true"
            :check-leaf="false"
            :fieldNames="{label: 'groupName', value: 'id'}"
            ></tree-select> -->
          <div v-else>{{ formState.parentName }}</div>
          <div v-if="error" class="ant-form-item-explain-error" style="">地图目录不能超过四级</div>
        </a-form-item>
        <a-form-item label="场景集名称" name="name" :rules="[{ required: true, message: '请输入场景集名称'}, { min: 2, max: 50, message: '场景名称长度为2到50位'}]">
          <a-input v-model:value="formState.name" :maxlength="50" placeholder="请输入场景集名称"></a-input>
        </a-form-item>
        <a-form-item label="场景集路径" name="path">
          <span>{{ path }}</span>
        </a-form-item>
        <a-form-item label="标签">
          <tree-transfer
            v-model:target-keys="formState.labels"
            :api="baseApi.tags.getList"
            :query="{ tag_type: 2, tree: 1 }"
            :fieldNames="{ label: 'display_name', value: 'name' }"
            :titles="['可选标签', '选中标签']"
          ></tree-transfer>
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
const id = useRoute().params.id
const isAdd = id === '0'
const actionText = isAdd ? '创建' : '修改'
const title =  actionText + '场景集'

const baseApi = api
const currentApi = api.scenesets

const formState = reactive({
  name: '',
  parentId: undefined,
  parent: null as any,
  parentName: '',
  labels: [],
  isLeaf: '1'
})

const path = computed(() => {
  return (formState.parent?.title || '') + '/' + formState.name
})

const loading = ref(false)
const router = useRouter()
const goback = () => router.push('/sceneset/')
const add = async () => {
  if(error.value) return
  loading.value = true

  const params = {
    name: formState.name,
    parentId: formState.parentId,
    labels: formState.labels?.map((item: any) => item.value || item.name),
    isLeaf:formState.isLeaf,
    path: path.value
  }
  
  try {
    isAdd 
      ? await currentApi.add(params)
      : await currentApi.edit({ id, data: params })

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
    if(isLeaf == '0' && parent?.level > 2) {
      error.value = true
    }
  }
)

/****** 获取编辑数据 */
const dataLoading = ref(false)
const getEditData = async () => {
  if(id !== '0') {
    try {
      dataLoading.value = true
      const data = await currentApi.get(id)
      formState.name = data.name
      formState.parentId = data.parentId
      formState.parentName = data.parentName
      // formState.parent = { label: data.parentName, value: data.parentId }
      formState.labels = data.labels_detail
      formState.isLeaf = data.isLeaf?.toString()
    } finally {
      dataLoading.value = false
    }
  }
}
getEditData()
</script>