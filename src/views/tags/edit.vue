<template>
  <div class="breadcrumb">
    <router-link to="/tags/">标签管理</router-link>
    <span class="breadcrumb--current">{{ title }}</span>
  </div>
  <div class="min-main">
    <span class="title mb-5">{{ title }}</span>
    <a-form :model="formState" :labelCol="{ style: { width: '100px' } }" style="width: 550px" @finish="add">
      <a-form-item v-if="isView" label="标签ID" name="id">
        <span>{{ formState.id }}</span>
      </a-form-item>
      <a-form-item label="标签名称：" name="display_name" :rules="[{ required: true, message: '请输入标签名称!' }]">
        <a-input :disabled="isView" v-model:value="formState.display_name" maxlength="50" placeholder="请输入标签名称"></a-input>
      </a-form-item>
      <a-form-item label="标签英文名称：" name="name" :rules="[{ required: true, message: '请输入标签英文名称!' }]">
        <a-input
          :disabled="isView"
          :value="formState.name"
          maxlength="50"
          placeholder="请输入标签英文名称"
          @change="onlyEnlishInput"
        ></a-input>
      </a-form-item>
      <a-form-item label="标签类型：" name="tag_type" :rules="[{ required: true, message: '请选择标签类型!' }]">
        <scroll-select
          :disabled="isView"
          allowClear
          style="width: 245px"
          v-model:value="formState.tag_type"
          :api="tagsApi.getType"
          :fieldNames="{ label: 'value', value: 'key' }"
          placeholder="请选择标签类型"
        />
      </a-form-item>
      <!-- <a-form-item label="上级标签：" name="tag_type">
        <tree-select
          :disabled="isView"
          allowClear
          style="width: 245px"
          v-model:value="formState.rr"
          :api="mapApi.getMapCatalog"
          :params="{ tree: 1 }"
          :fieldNames="{ title: 'name', id: 'id' }"
          placeholder="请选择上级标签"
        >
        </tree-select>
      </a-form-item> -->
      <a-form-item label="是否可打标签" name="isTag" :rules="[{ required: true, message: '请打标!' }]">
        <a-switch :disabled="isView" checked-children="是" un-checked-children="否" v-model:checked="formState.isTag" />
      </a-form-item>
      <a-form-item label="描述" name="desc">
        <a-textarea
          :disabled="isView"
          v-model:value="formState.desc"
          placeholder="请输入描述"
          rows="10"
          style="resize: none"
          maxlength="255"
        />
      </a-form-item>
      <template v-if="isView">
        <a-form-item label="创建时间"
          ><span>{{ formState.create_time }}</span></a-form-item
        >
        <a-form-item label="修改时间"
          ><span>{{ formState.update_time }}</span></a-form-item
        >
        <a-form-item label="所属用户"
          ><span>{{ formState.user }}</span></a-form-item
        >
      </template>
      <a-form-item class="ml-8" :wrapper-col="{ style: { paddingLeft: '80px' } }">
        <a-button @click="goback" class="mr-2">取消</a-button>
        <a-button v-if="!isView" type="primary" html-type="submit" :loading="loading">
          {{ isAdd ? '创建' : '修改' }}
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
const id = useRoute().params.id
const { type = '' } = useRoute().query || {}
const isView = type === '0' ? true : false // 查看
const isAdd = id === '0'
const title = isView ? '查看标签' : isAdd ? '创建标签' : '修改标签'
const tagsApi = api.tags

const formState = reactive<any>({
  id: null,
  name: undefined,
  display_name: null,
  desc: '',
  isTag: false,
  type: null,
  isClassify: false,
  create_time: '',
  update_time: '',
  create_user: ''
})

const loading = ref(false)
const router = useRouter()
const goback = () => router.go(-1)
const add = async () => {
  loading.value = true
  const params: any = {
    name: formState.name,
    display_name: formState.display_name,
    type: formState.tag_type,
    desc: formState.desc,
    isTag: formState.isTag,
    isClassify: formState.isClassify
  }
  for (const key in params) {
    if (key !== 'isTag') {
      if (!params[key]) delete params[key]
    }
  }
  try {
    isAdd ? await tagsApi.add({ ...params }) : await tagsApi.edit({ id, data: { ...params } })
    loading.value = false
    message.info(isAdd ? '创建成功' : '修改成功')
    goback()
  } catch {
    loading.value = false
  }
}

/****** 获取查看数据 */
const getLookData = async () => {
  // 非上传
  if (id !== '0') {
    const res = await tagsApi.get(id)
    formState.id = res.id
    formState.name = res.name
    formState.display_name = res.display_name
    formState.desc = res.desc
    formState.isTag = res.isTag
    formState.tag_type = res.tag_type
    formState.create_time = res.create_time
    formState.update_time = res.update_time
    formState.create_user = res.create_user
  }
}
const onlyEnlishInput = (e: { target: { value: string } }) => {
  formState.name = e.target.value.replace(/[^a-z]/g, '')
}
getLookData()
</script>
