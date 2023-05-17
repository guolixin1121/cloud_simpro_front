<template>
  <div class="breadcrumb">
    <router-link to="/sceneset/">场景集管理</router-link>
    <span class="breadcrumb--current">场景集详情</span>
  </div>
  <div class="min-main">
    <div class="cursor-pointer text-gray-400" @click="goback">
      <svg-icon icon="back" class="mr-2"></svg-icon>返回
    </div>
    <span class="title mb-5 mt-3">场景集详情</span>
    <a-form :model="formState" :labelCol ="{ style: { width: '80px' } }"  style="width: 550px;">
      <a-form-item label="场景集ID">
        {{ formState.id }}
      </a-form-item>
      <a-form-item label="场景集名称">
        {{ formState.name }}
      </a-form-item>
      <a-form-item label="父场景集Id">
        {{ formState.parentId }}
      </a-form-item>
      <a-form-item label="标签">
        <ul class="view-list">
          <li class="mb-2" v-for="item in formState.labels as any" :key="item">
            {{ item.display_name }}
          </li>
        </ul>
      </a-form-item>
      <a-form-item label="创建时间">
        {{ formState.create_time }}
      </a-form-item>
      <!-- <a-form-item label="修改时间">
        {{ formState.updateTime }}
      </a-form-item> -->
    </a-form>
  </div>
</template>

<script setup lang="ts">
const id = useRoute().params.id

const formState = reactive({
  id: '',
  name: '',
  parentId: '',
  parentName: '',
  labels: [],
  create_time: ''
})

const router = useRouter()
const goback = () => router.go(-1)

const getEditData = async () => {
   if(id !== '0') {
     const data = await api.scenesets.get(id)
    //  formState.id = data.id
    //  formState.name = data.name
    //  formState.parentName = data.parentName
    //  formState.labels = data.labels_detail || []
    //  formState.create_time = formatDate(data.create_time)
    //  formState.update_time = formatDate(data.update_time)
     for(const prop in formState) {
        formState[prop as keyof typeof formState] = data[prop]
      }

      // getParentName(data.parentId)
   }
}

// const getParentName = async (id: string) => {
//    const res = await api.scenesets.get(id)
//    formState.parentName = res ? res.name : ''
// }

getEditData()
</script>

<style lang="less">
.view-list {
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  height: 260px;
  width: 220px;
  overflow: auto;
  padding: 8px 10px;
  margin-top: 5px;
}
</style>