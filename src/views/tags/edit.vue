<template>
  <div class="breadcrumb">
    <router-link to="/tags/">标签管理</router-link>
    <span class="breadcrumb--current">{{ title }}</span>
  </div>
  <div class="min-main">
    <span class="title mb-5">{{ title }}</span>
    <a-form :model="formState" :labelCol="{ style: { width: '100px' } }" style="width: 550px" @finish="add">
      <a-form-item v-if="isView" label="标签ID" name="id">
        {{ formState.id }}
      </a-form-item>
      <a-form-item
        label="标签名称："
        name="display_name"
        :rules="[
          { required: isView ? false : true, message: '请输入标签名称!' },
          { min: 1, max: 64, message: '标签名称长度为1到32位' }
        ]"
      >
        <a-input v-if="!isView" v-model:value="formState.display_name" maxlength="32" placeholder="请输入标签名称"></a-input>
        <template v-else>{{ formState.display_name }}</template>
      </a-form-item>
      <a-form-item
        label="标签英文名称："
        name="name"
        :rules="[
          { required: isAdd ? true : false, message: '请输入标签英文名称!' },
          { min: 1, max: 64, message: '标签英文名称长度为1到64位' }
        ]"
      >
        <a-input
          v-if="isAdd"
          :value="formState.name"
          maxlength="64"
          placeholder="请输入标签英文名称"
          @change="onlyEnlishInput"
        ></a-input>
        <template v-else>{{ formState.name }}</template>
      </a-form-item>
      <a-form-item label="标签类型：" name="tag_type" :rules="[{ required: isView ? false : true, message: '请选择标签类型!' }]">
        <scroll-select
          v-if="!isView"
          allowClear
          style="width: 245px"
          v-model:value="formState.tag_type"
          :api="tagsApi.getType"
          :fieldNames="{ label: 'value', value: 'key' }"
          placeholder="请选择标签类型"
        />
        <template v-else>{{ formState.tag_type }}</template>
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
      <a-form-item label="是否可打标签" name="isTag" :rules="[{ required: isView ? false : true, message: '请打标!' }]">
        <a-switch v-if="!isView" checked-children="是" un-checked-children="否" v-model:checked="formState.isTag" />
      </a-form-item>
      <a-form-item label="描述" name="desc">
        <a-textarea
          v-if="!isView"
          v-model:value="formState.desc"
          placeholder="请输入描述"
          rows="10"
          style="resize: none"
          maxlength="255"
        />
        <template v-else>{{ formState.desc }}</template>
      </a-form-item>
      <template v-if="isView">
        <a-form-item label="创建时间"
          ><span>{{ formState.create_time }}</span></a-form-item
        >
        <a-form-item label="修改时间"
          ><span>{{ formState.update_time }}</span></a-form-item
        >
        <a-form-item label="所属用户"
          ><span>{{ formState.create_user }}</span></a-form-item
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
  formState.name = e.target.value.replace(/[^a-z_]/g, '')
}
getLookData()
</script>
