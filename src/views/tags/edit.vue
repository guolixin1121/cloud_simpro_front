<template>
  <div class="breadcrumb">
    <router-link to="/tags/manage/">标签管理</router-link>
    <span class="breadcrumb--current">{{ title }}</span>
  </div>
  <div class="min-main">
    <span class="title mb-5">{{ title }}</span>
    <a-form :model="formState" :labelCol="{ style: { width: '100px' } }" style="width: 550px" @finish="add">
      <a-form-item v-if="isView" label="标签ID" name="id">
        <span>{{ formState.id }}</span>
      </a-form-item>
      <a-form-item label="标签名称：" name="display_name" :rules="[{ required: true, message: '请输入标签名称!' }]">
        <a-input
          :disabled="isView || !isAdd"
          v-model:value="formState.display_name"
          maxlength="50"
          placeholder="请输入标签名称"
        ></a-input>
      </a-form-item>
      <a-form-item label="标签英文名称：" name="name" :rules="[{ required: true, message: '请输入标签英文名称!' }]">
        <a-input
          :disabled="isView || !isAdd"
          v-model:value="formState.name"
          maxlength="50"
          placeholder="请输入标签英文名称"
        ></a-input>
      </a-form-item>
      <a-form-item label="标签类型：" name="tag_type" :rules="[{ required: true, message: '请选择标签类型!' }]">
        <scroll-select
          :disabled="isView || !isAdd"
          allowClear
          style="width: 245px"
          v-model:value="formState.tag_type"
          placeholder="请选择标签类型"
        />
      </a-form-item>
      <a-form-item label="上级标签：" name="tag_type" :rules="[{ required: true, message: '请选择上级标签!' }]">
        <tree-select
          :disabled="isView || !isAdd"
          allowClear
          style="width: 245px"
          v-model:value="formState.tag_type"
          :api="mapApi.getMapCatalog"
          :params="{ tree: 1 }"
          :fieldNames="{ title: 'name', id: 'id' }"
          placeholder="请选择上级标签"
        >
        </tree-select>
        <!-- <a-form-item label="标签类型：" name="tag_type" :rules="[{ required: true, message: '请选择标签类型!' }]">
        <tree-select
          :disabled="isView || !isAdd"
          allowClear
          style="width: 245px"
          v-model:value="formState.tag_type"
          :api="mapApi.getMapCatalog"
          :params="{ tree: 1 }"
          :fieldNames="{ title: 'name', id: 'id' }"
          placeholder="请选择标签类型"
        >
        </tree-select> -->
      </a-form-item>
      <a-form-item v-if="!isAdd" label="是否可打标签" name="isTag">
        <a-switch v-model:checked="formState.isTag" />
      </a-form-item>
      <a-form-item label="描述" name="desc">
        <a-textarea :disabled="isView" v-model:value="formState.desc" placeholder="请输入描述" rows="10" style="resize: none" />
      </a-form-item>
      <template v-if="isView">
        <a-form-item label="创建时间"
          ><span>{{ formState.create_date }}</span></a-form-item
        >
        <a-form-item label="修改时间"
          ><span>{{ formState.update_date }}</span></a-form-item
        >
        <a-form-item label="所属用户"
          ><span>{{ formState.user }}</span></a-form-item
        >
      </template>
      <a-form-item class="ml-8" :wrapper-col="{ style: { paddingLeft: '80px' } }">
        <a-button @click="goback" class="mr-2">取消</a-button>
        <a-button v-if="!isView" type="primary" html-type="submit" :loading="loading">
          {{ isAdd ? '上传' : '修改' }}
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
const title = isView ? '查看' : isAdd ? '创建' : '取消'
const mapApi = api.maps

const formState = reactive<any>({
  id: null,
  name: undefined,
  display_name: null,
  desc: '',
  isTag: '',
  tag_type: '',
  create_date: '',
  update_date: '',
  user: ''
})

const loading = ref(false)
const router = useRouter()
const goback = () => router.go(-1)
const add = async () => {
  loading.value = true
  const params: any = {
    name: formState.name,
    display_name: formState.display_name,
    tag_type: formState.tag_type,
    desc: formState.desc,
    isTag: formState.isTag
  }
  for (const key in params) {
    if (!params[key]) delete params[key]
  }
  console.log(params, formState)
  isAdd ? await mapApi.addMaps({ ...params }) : await mapApi.editMaps({ id, data: { ...params } })
  loading.value = false
  message.info(isAdd ? '创建成功' : '修改成功')
  goback()
}

/****** 获取查看数据 */
const getLookData = async () => {
  // 非上传
  if (id !== '0') {
    const res = await mapApi.lookMaps(id)
    formState.id = res.id
    formState.name = res.name
    formState.display_name = res.display_name
    formState.desc = res.desc
    formState.isTag = res.isTag
    formState.tag_type = res.tag_type
    formState.create_date = res.create_date
    formState.update_date = res.update_date
    formState.user = res.user
  }
}
getLookData()
</script>
