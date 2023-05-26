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
        <a-form-item label="场景集名称" name="name" :rules="[{ required: true, message: '请输入场景集名称'}, { min: 2, max: 50, message: '场景名称长度为2到50位'}]">
          <a-input v-model:value="formState.name" :maxlength="50" placeholder="请输入场景集名称"></a-input>
        </a-form-item>
        <a-form-item label="所属场景目录" name="parentId" :rules="[{ required: true, message: '请选择所属场景目录'}]">
          <a-tree-select placeholder="请选择所属场景目录" 
          v-model:value="formState.parentId"
            :treeData="parentScenesets" 
            treeDefaultExpandAll
            showSearch>
          </a-tree-select>
          <!-- <tree-select v-model:value="formState.parentId" :api="getSceneSet" :fieldNames="{label: 'name', value: 'baidu_id'}"></tree-select> -->
        </a-form-item>
        <a-form-item label="场景集类型" name="isLeaf" :rules="[{ required: true, message: '请选择场景集类型'}]">
          <a-radio-group v-model:value="formState.isLeaf">
            <a-radio value="0">场景目录</a-radio>
            <a-radio value="1">场景集</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="标签">
          <scroll-transfer v-model:target-keys="formState.labels" :api="getSceneTags" 
            :fieldNames="{label: 'display_name', value: 'name'}"
            :titles="['可选标签', '选中标签']"></scroll-transfer>
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
const currentApi = api.scenesets
const getSceneSet = (args: object) => currentApi.getList({ tree: 1, ...args} )
const getSceneTags = (args: object) => api.tags.getList({ tag_type: 2, ...args })

const formState = reactive({
  name: undefined,
  parentId: undefined,
  labels: [],
  isLeaf: undefined
})
const parentScenesets = ref([])

const loading = ref(false)
const router = useRouter()
const goback = () => router.go(-1)
const add = async () => {
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

const getParents = async () => {
  const res = await getSceneSet({})

  const treeTransfer = (data: any): [] => {
    const parents = data.filter((item: any) => item.isLeaf === 0)
    const options = parents.map((item: any) => ({
      title: item.name,
      value: item.baidu_id,
      key: item.baidu_id,
      children: treeTransfer(item.children || [])
    }))
    return options
  }

  parentScenesets.value = treeTransfer(res.results || res)
}
getParents()

/****** 获取编辑数据 */
const dataLoading = ref(false)
const getEditData = async () => {
  if(id !== '0') {
    dataLoading.value = true
    const data = await currentApi.get(id)
    dataLoading.value = false
    formState.name = data.name
    formState.parentId = data.parentId === -1 ? undefined : data.parentId
    formState.labels = data.labels_detail.map((item: any) => item.name)
    formState.isLeaf = data.isLeaf.toString()
  }
}
getEditData()
</script>