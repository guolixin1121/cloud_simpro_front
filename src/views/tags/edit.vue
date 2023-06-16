<template>
  <div class="breadcrumb">
    <router-link to="/tags/">标签管理</router-link>
    <span class="breadcrumb--current">{{ title }}</span>
  </div>
  <div class="min-main">
    <div v-if="isView" class="cursor-pointer text-gray-400" @click="goback">
      <svg-icon icon="back" class="mr-2"></svg-icon>返回
    </div>
    <span class="title mb-5 mt-3">{{ title }}</span>
    <a-spin :spinning="dataLoading">
      <a-form :model="formState" :labelCol="{ style: { width: '100px' } }" style="width: 55%" @finish="add">
        <a-form-item v-if="isView" label="标签ID" name="id">
          {{ formState.id }}
        </a-form-item>
        <a-form-item label="标签类型：" name="tag_type" :rules="[{ required: isView ? false : true, message: '请选择标签类型'}]">
          <scroll-select
            v-if="isAdd"
            v-model:value="formState.tag_type"
            :api="tagsApi.getType"
            :fieldNames="{ label: 'value', value: 'key' }"
            placeholder="请选择标签类型"
          />
          <template v-else>{{ formState.tag_type_name }}</template>
        </a-form-item>
        <a-form-item
          label="标签英文名称："
          name="name"
          :rules="[
            { required: !isView, message: '请输入标签英文名称'},
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
        <a-form-item
          label="标签中文名称："
          name="display_name"
          :rules="[
            { required: isView ? false : true, message: '请输入标签中文名称' },
            { validator: () => checkChName(formState.name), trigger: 'change' }
          ]"
        >
          <template v-if="!isView">
            <chInput
              v-model:value="formState.display_name"
              maxlength="64"
              placeholder="请输入标签中文名称"
              @change="(val: string)=>{formState.display_name=val}"
            />
          </template>
          <template v-else>{{ formState.display_name }}</template>
        </a-form-item>
        <a-form-item v-if="isAdd" label="上级标签：" name="tag_type">
          <tree-select
            placeholder="请选择上级标签"
            :disabled="isView"
            allowClear
            style="width: 245px"
            v-model:value="formState.parentId"
            v-model:selectNode="formState.parentNode"
            :api="tagsList"
            :api-filter="(item: any) => !item.isTag"
            :check-leaf="false"
            :fieldNames="{ label: 'display_name', value: 'name' }"
          >
          </tree-select>
        </a-form-item>
        <a-form-item label="描述" name="desc" :rules="[{required: !isView , message: '请输入标签描述' }]">
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
        <a-form-item v-if="!isView" class="ml-8" :wrapper-col="{ style: { paddingLeft: '80px' } }">
          <a-button class="mr-2" type="primary" html-type="submit" :loading="loading">
            {{ isAdd ? '创建' : '修改' }}
          </a-button>
          <a-button @click="goback">取消</a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { checkChName } from '@/utils/tools'

const id = useRoute().params.id
const { type = '', tag_type = '' } = useRoute().query || {}
const isView = type === '0' ? true : false // 查看
const isAdd = id === '0'
const title = isView ? '查看标签' : isAdd ? '创建标签' : '修改标签'
const tagsApi = api.tags

const formState = reactive<any>({
  id: null,
  name: undefined,
  display_name: null,
  desc: '',
  tag_type: parseInt(tag_type as string),
  parentId: null,
  parentNode: null,
  create_time: '',
  update_time: '',
  create_user: ''
})

const tagsList = ref()
watchEffect(() => {
  const tag_type = formState.tag_type
  tagsList.value = (args: any) => api.tags.getList({ tag_type: tag_type,  tree: 1, ...args })
})

const loading = ref(false)
const router = useRouter()
const goback = () => router.go(-1)
const add = async () => {
  const { parentId, parentNode } = formState
  // 没有父节点或者父节点为第一级，则当前标签为目录
  // 否则为标签
  const params: any = {
    name: formState.name,
    display_name: formState.display_name,
    type: formState.tag_type,
    desc: formState.desc,
    isTag: !parentId || parentNode.level == 0 ? false : true,
    parentId: parentId ? parentNode.id : null
  }
  for (const key in params) {
    if (key === 'isTag' || key === 'desc') {
      console.log()
    } else {
      if (!params[key]) delete params[key]
    }
  }
  try {
     loading.value = true
    isAdd ? await tagsApi.add({ ...params }) : await tagsApi.edit({ id, data: { ...params } })
    loading.value = false
    message.info(isAdd ? '创建成功' : '修改成功')
    goback()
  } catch {
    loading.value = false
  }
}

/****** 获取查看数据 */
const dataLoading = ref(false)
const getLookData = async () => {
  // 非上传
  if (id !== '0') {
    try {
      dataLoading.value = true
      const res = await tagsApi.get(id)
      formState.id = res.id
      formState.name = res.name
      formState.display_name = res.display_name
      formState.desc = res.desc
      formState.tag_type = res.tag_type
      formState.tag_type_name = res.tag_type_name
      formState.parentNode = res.parentList
      formState.create_time = res.create_time
      formState.update_time = res.update_time
      formState.create_user = res.create_user
    } finally {
      dataLoading.value = false
    }
  }
}
const onlyEnlishInput = (e: { target: { value: string } }) => {
  formState.name = e.target.value.replace(/[^a-z_]/g, '')
}

getLookData()
</script>
