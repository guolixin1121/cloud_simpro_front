<template>
  <div class="breadcrumb">
    <router-link to="/mapset/">地图集管理</router-link>
    <span class="breadcrumb--current">{{ title }}</span>
  </div>
  <div class="min-main">
    <span class="title mb-5">{{ title }}</span>
    <a-spin :spinning="dataLoading">
      <a-form :model="formState" :labelCol ="{ style: { width: '100px' } }"  style="width: 550px;"
        @finish="add">
        <a-form-item label="地图集名称" name="name" :rules="[{ required: true, message: '请输入地图集名称'}, { min: 2, max: 50, message: '地图名称长度为2到50位'}]">
          <a-input v-model:value="formState.name" :maxlength="50" placeholder="请输入地图集名称"></a-input>
        </a-form-item>
        <a-form-item label="地图集类型" name="isLeaf" :rules="[{ required: true, message: '请选择地图集类型'}]">
          <a-radio-group v-model:value="formState.isLeaf">
            <a-radio value="0">地图目录</a-radio>
            <a-radio value="1">地图集</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="所属地图目录" name="parentId">
          <a-tree-select placeholder="请选择所属地图目录" 
            v-model:value="formState.parentId"
            :treeData="parentList" 
            treeDefaultExpandAll
            showSearch>
          </a-tree-select>
          <!-- <tree-select v-model:value="formState.parentId" :api="getSceneSet" :fieldNames="{label: 'name', value: 'baidu_id'}"></tree-select> -->
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
const { id } = useRoute().params
const { name } = useRoute().query
const isAdd = id === '0'
const actionText = isAdd ? '创建' : '修改'
const title =  actionText + '地图集'
const currentApi = api.mapsets
const getSceneSet = (args: object) => currentApi.getList({ tree: 1, ...args} )

const formState = reactive({
  name: undefined,
  parentId: undefined,
  isLeaf: undefined
})
const parentList = ref([])

const loading = ref(false)
const router = useRouter()
const goback = () => router.push('/mapset/')
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
      value: item.id,
      key: item.id,
      children: treeTransfer(item.children || [])
    }))
    return options
  }

  parentList.value = treeTransfer(res.results || res)
}
getParents()

/****** 获取编辑数据 */
const dataLoading = ref(false)
const getEditData = async () => {
  if(id !== '0') {
    dataLoading.value = true
    const data = await currentApi.get({ id, data:{ name }})
    dataLoading.value = false
    formState.name = data.name
    formState.parentId = data.parentId === -1 ? undefined : data.parentId
    formState.isLeaf = data.isLeaf.toString()
  }
}
getEditData()
</script>