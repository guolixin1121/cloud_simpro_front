<template>
  <div class="breadcrumb">
    <router-link to="/map-manage/">地图管理</router-link>
    <span class="breadcrumb--current">{{ title }}</span>
  </div>
  <div class="min-main">
    <span class="title mb-5">{{ title }}</span>
    <a-spin :spinning="dataLoading"> 
      <a-form :model="formState" :labelCol="{ style: { width: '100px' } }" style="width: 55%" @finish="add">
        <a-form-item label="所属地图集：" name="catalog" :rules="[{ required: isAdd, message: '请选择地图集'}]">
          <tree-select
            v-if="isAdd"
            allowClear
            label-in-value
            v-model:value="formState.catalog"
            :api="baseApi.maps.getMapCatalog"
            placeholder="请选择地图集"
          >
          </tree-select>
          <template v-else>{{ formState.catalog.label }}</template>
        </a-form-item>
        <a-form-item v-if="isView"
          label="地图ID：" >
          {{ formState.id }}
        </a-form-item>
        <a-form-item
          label="地图名称："
          name="name"
          :rules="[
            { required: isAdd ? true : false, message: '请输入地图名称'},
            { validator: () => checkChName(formState.name) }
          ]"
        >
          <ch-input v-if="isAdd" v-model:value="formState.name" :maxlength="32" placeholder="请输入地图名称"></ch-input>
          <template v-else>{{ formState.name }}</template>
        </a-form-item>
        <a-form-item label="地图类型：" name="mapType" :rules="[{ required: isAdd ? true : false, message: '请选择地图类型'}]">
          <scroll-select
            v-if="isAdd"
            allowClear
            v-model:value="formState.mapType"
            :options="MapManageSourceOptions"
            placeholder="请选择地图类型"
          >
          </scroll-select>
          <template v-else>{{ formState.mapTypeName }}</template>
        </a-form-item>
        <a-form-item v-if="!isView" label="地图文件：" name="xodr" :rules="[{ required: isAdd, message: '请上传地图文件'}]">
          <div class="flex">
            <single-upload
              accept=".xodr"
              class="inline-block pr-2"
              v-model:value="formState.xodr"
              :desc="'选择文件'"
            ></single-upload>
            <span style="white-space: break-spaces; word-break: break-word;" v-if="!formState.xodr">{{ formState.mapFileName }}</span>
          </div>
        </a-form-item>
        <a-form-item v-if="!isAdd" label="地图文件：">
          <div style="white-space: break-spaces; word-break: break-word;">{{ formState.latestVersionUrl }}</div>
        </a-form-item>
        <a-form-item v-if="!isAdd" label="地图版本：" name="name">
          <span>{{ formState.latestVersion }}</span>
        </a-form-item>
        <a-form-item label="标签">
          <tree-transfer v-if="isAdd"
            v-model:target-keys="formState.labels"
            :api="baseApi.tags.getList"
            :query="{ tag_type: 4, tree: 1 }"
            :fieldNames="{ label: 'display_name', value: 'name' }"
            :titles="['可选标签', '选中标签']"
          ></tree-transfer>
          <template v-else>
            <ul class="view-list" v-if="formState.labels?.length > 0">
              <li class="mb-2" v-for="item in formState.labels as any" :key="item.name">
                {{ item.display_name }}
              </li>
            </ul>
            <span v-else>无</span>
          </template>
        </a-form-item>
        <a-form-item label="描述" name="desc">
          <ch-input v-if="!isView" type="textarea" v-model:value="formState.desc" placeholder="请输入描述" :maxlength="160" rows="10"></ch-input>
          <template v-else>
            <span style="word-wrap: break-word; white-space: break-spaces;">{{ formState.desc }}</span>
          </template>
        </a-form-item>
        <template v-if="isView">
          <a-form-item label="最新上传时间："
            ><span>{{ formState.create_time }}</span></a-form-item
          >
          <a-form-item label="所属用户："
            ><span>{{ formState.create_user }}</span></a-form-item
          >
        </template>
        <a-form-item v-if="!isView" :wrapper-col="{ style: { paddingLeft: '100px' } }">
          <a-button class="marginR-16" type="primary" html-type="submit" :loading="loading">
            {{ isAdd ? '上传' : '修改' }}
          </a-button>
          <a-button @click="goback">取消</a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '@/utils/tools'
import { MapManageSourceOptions, getMapManageSourceOptions } from '@/utils/dict'
import { checkChName } from '@/utils/tools';

// import { SStorage } from '@/utils/storage'
const mapCatalog = store.catalog.mapCatalog as any
const route = useRoute()
const { id } = route.params
const { type = '', name = ''} = route.query || {}
const isView = type === '0' ? true : false // 查看
const isAdd = id === '0'
const title = isView ? '查看地图' : isAdd ? '上传地图' : '修改地图'
const baseApi = api
const mapApi = api.maps

const formState = reactive<any>({
  id: '',
  name: '',
  catalog: (mapCatalog.id && mapCatalog.id != '') ? { label: mapCatalog?.name, value: mapCatalog?.id} : null,
  xodr: null,
  desc: '',
  latestVersion: '',
  latestVersionUrl: '',
  create_time: '',
  update_time: '',
  create_user: '',
  mapType: null,
  labels: [],
})

const loading = ref(false)
const router = useRouter()
const goback = () => router.push('/map-manage')
const add = async () => {
  loading.value = true
  const params: any = {
    name: formState.name,
    catalog: formState.catalog?.value,
    xodr: formState.xodr,
    desc: formState.desc,
    mapType: formState.mapType,
    labels: formState.labels?.map((item: any) => item.name)
  }
  for (const key in params) {
    if (key !== 'desc') {
      if (params[key] === null || params[key] === undefined || params[key] === '') delete params[key]
    }
  }
  try {
    isAdd ? await mapApi.addMaps({ ...params }) : await mapApi.editMaps({ id, data: { ...params } })
    loading.value = false
    message.info(isAdd ? '上传成功' : '修改成功')
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
    try{
      dataLoading.value = true
      const res = await mapApi.lookMaps({ id, data: { name } })
      formState.id = res.id
      formState.name = res.name
      formState.catalog = { label: mapCatalog?.name, value: mapCatalog?.id }
      formState.xodr = null
      formState.desc = res.desc
      formState.latestVersion = res.latestVersion
      formState.latestVersionUrl = res.latestVersionUrl
      formState.create_time = formatDate(res.create_time)
      formState.update_time = formatDate(res.update_time)
      formState.create_user = res.create_user
      formState.mapFileName = res.mapFileName
      formState.mapType = res.mapType
      formState.mapTypeName = getMapManageSourceOptions(formState.mapType)
      formState.labels = res.labels_detail
    }finally {
      dataLoading.value = false
    }
  }
}
getLookData()
</script>
