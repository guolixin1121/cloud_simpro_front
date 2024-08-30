<template>
  <div class="breadcrumb">
    <a @click="goback()">具体场景</a>
    <span>{{ title }}</span>
  </div>
  <div class="min-main">
    <span class="title mb-5">{{ title }}</span>
    <a-spin :spinning="dataLoading">
      <a-form :model="formState" :labelCol ="{ style: { width: '100px' } }"  style="width: 55%"
        @finish="add">
        <a-form-item label="场景集名称" name="name" 
          :rules="[{ required: true, message: '请输入场景集名称'},
            { min: 2, max: 160, message: '场景集名称长度为2到160' }
          ]">
          <ch-input v-model:value="formState.name" :maxlength="160" placeholder="请输入场景集名称"></ch-input>
        </a-form-item>
        <a-form-item label="宣传图片" name="poster" 
          :rules="[{ required: isAdd, message: '请选择宣传图片'}]">
          <single-upload accept=".jpg,.png" :max-size="2" text="选择图片" v-model:value="formState.poster"></single-upload>
          <span class="ml-4" v-if="!formState.poster">{{ formState.poster_name }}</span>
        </a-form-item>
        <a-form-item label="场景集描述" name="desc">
          <ch-input type="textarea" v-model:value="formState.desc" placeholder="请输入场景集描述" :maxlength="1000" rows="5"></ch-input>
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
        <a-form-item :wrapper-col="{ style: { paddingLeft: '100px' }}" v-if="formState.can_edit">
          <a-button class="marginR-16" type="primary" html-type="submit" :loading="loading">
            {{ actionText }}
          </a-button>
          <a-button @click="goback()">取消</a-button>
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
const router = useRouter()
const goback = () => router.push('/resource-sceneset/')
const baseApi = api
const currentApi = api.sceneResource
const formState = reactive({
  name: '',
  desc: '',
  poster: '',
  poster_name: '',
  labels: [],
  can_edit: true
})

const loading = ref(false)

const add = async () => {
  loading.value = true

  const params: any = {
    name: formState.name,
    desc: formState.desc,
    poster: formState.poster,
    labels: formState.labels?.map((item: any) => item.value || item.name)
  }
  if(typeof(params.poster) == 'string') {
    delete params['poster']
  }
  
  try {
    isAdd ? await currentApi.addSceneset(params) : await currentApi.editSceneset({ id, data: params })

    message.info(`${actionText}成功`)
    goback()
  } finally {
    loading.value = false
  }
}

/****** 获取编辑数据 */
const dataLoading = ref(false)
const getEditData = async () => {
  if(!isAdd) {
    try {
      dataLoading.value = true
      const data = await currentApi.getSceneset(id)
      formState.name = data.name
      formState.desc = data.desc || ''
      formState.labels = data.labels_detail
      formState.can_edit = data.edit_enable

      const poster = data.poster.split('/')
      if(poster) {
        formState.poster_name = poster[poster.length - 1]
      }
    } finally {
      dataLoading.value = false
    }
  }
}
getEditData()
</script>