<template>
  <div class="breadcrumb">
    <span>场景管理</span><span>我的场景</span><a @click="goback()">具体场景</a><span>{{ title }}</span>
  </div>
  <div class="min-main">
    <span class="title mb-4">{{ title }}</span>
    <a-spin :spinning="dataLoading">
      <a-form :model="formState" :labelCol ="{ style: { width: '100px' } }"  style="width: 55%"
        @finish="edit">
        <a-form-item label="场景集名称" name="name" 
          :rules="[{ required: true, message: '请输入场景集名称'},
          { min: 2, max: 160, message: '场景集名称长度为2到160位' }]">
          <ch-input v-model:value="formState.name" :maxlength="160" placeholder="请输入场景集名称"></ch-input>
        </a-form-item>
        <a-form-item label="场景集描述" name="desc">
          <ch-input type="textarea" v-model:value="formState.desc" placeholder="请输入场景集描述" :maxlength="255" rows="5"></ch-input>
        </a-form-item>
        <a-form-item label="标签">
          <tree-transfer
            v-model:target-keys="formState.labels_detail"
            :api="baseApi.tags.getList"
            :query="{ tag_type: 2, tree: 1 }"
            :fieldNames="{ label: 'display_name', value: 'name' }"
            :titles="['可选标签', '选中标签']"
          ></tree-transfer>
        </a-form-item>
        <a-form-item :wrapper-col="{ style: { paddingLeft: '100px' }}">
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
import { goback } from '@/utils/tools'
import useSetdata from '@/hooks/useSetdata'
import useSubmit from '@/hooks/useSubmit'

const id = useRoute().params.id
const isAdd = !id
const actionText = isAdd ? '创建' : '修改'
const title =  actionText + '场景集'
const baseApi = api
const formState = reactive({
  name: '',
  desc: '',
  labels_detail: []
})

// 提交数据
const { loading, submit } = useSubmit()
const edit = () => {
  const params = {
    id: id,
    name: formState.name,
    desc: formState.desc,
    labels: formState.labels_detail?.map((item: any) => item.value || item.name)
  }
  submit(isAdd, api.scenesets, params)
}

/****** 获取编辑数据 */
const { loading: dataLoading, setData } = useSetdata()
setData(formState, api.scenesets.get, id)
</script>