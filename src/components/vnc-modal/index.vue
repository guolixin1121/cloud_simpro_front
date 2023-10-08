<template>
    <a-modal v-model:visible="visible" :closable="false"
     @cancel="visible=false" @ok="onConfirm">
         <div class="flex mb-2">
             <svg-icon style="color: #faad14" icon="alert"></svg-icon>
             <span class="ml-2 font-medium">在线仿真资源已满，暂时无法{{ title }}</span>
         </div>
         <a-table :pagination="false" ref="table" :columns="columns" :dataSource="dataSource" :loading="loading">
         </a-table>
     </a-modal>
 </template>
 <script setup lang="ts">
 defineProps({
    title: {
        type: String,
        default: () => '编辑'
    }
 })
 const visible = ref(false)
 const table = ref()
 
 const show = () => {
     visible.value = true
     getData()
     nextTick(() => {
        console.log(table.value.refresh)
        table.value?.refresh()
     })
 }
 defineExpose({ show })
 
 const router = useRouter()
 const dataSource = ref([])
 const loading = ref(false)
 const columns = [
     { dataIndex: 'name', title: '在线仿真资源' },
     { dataIndex: 'username', title: '占用用户'}
 ]
 const onConfirm = () => {
     visible.value = false
     router.push('/online')
 }
 
const getData = async () => {
     try {
         loading.value = true
         const res = await api.vnc.getList()
         dataSource.value = res.map((item: any, index: number) => ({
             ...item,
             name: 'GuangQi - ' + (index + 1),
         }))
     } finally {
         loading.value = false
     }
 }
 </script>