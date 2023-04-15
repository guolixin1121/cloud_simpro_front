<template>
  <div class="breadcrumb">
    <router-link to="/scene/">场景管理</router-link>
    <span class="breadcrumb--current">{{ title }}</span>
  </div>
  <div class="main">
    <span class="title mb-5">{{ title }}</span>

    <a-form :model="formState" :labelCol ="{ style: { width: '80px' } }"  style="width: 550px;"
      @finish="ok">
      <a-form-item label="场景名称" name="name" :rules="[{ required: true, message: '请输入场景名称!' }]">
        <a-input v-model:value="formState.name"></a-input>
      </a-form-item>
      <a-form-item label="关联地图" name="map" :rules="[{ required: true, message: '请选择关联地图!' }]">
        <a-select v-model:value="formState.map"></a-select>
      </a-form-item>
      <a-form-item label="场景文件" name="file" :rules="[{ required: true, message: '请上传场景文件!' }]">
        <a-upload v-model:value="formState.file">
          <a-button> 选择文件 </a-button>
        </a-upload>
      </a-form-item>
      <a-form-item label="标签">
        
      </a-form-item>
      <a-form-item class=" ml-8" :wrapper-col="{ style: { paddingLeft: '80px' }}">
        <a-button @click="goback" class="mr-2">取消</a-button>
        <a-button type="primary" html-type="submit" :loading="loading">上传</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
const id = useRoute().params.id
const title = id === '0' ? '上传场景' : '修改场景'
const loading = ref(false)

const formState = reactive({
  name: '',
  map: '',
  file: '',
  tags: []
})

const router = useRouter()
const goback = () => router.go(-1)
const ok = () => console.log(111)
</script>