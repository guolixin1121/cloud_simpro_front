<template>
    <a-modal v-model:visible="visible"
     title="在线仿真"
     @cancel="visible=false" @ok="onConfirm">
        <div class="modal-content">
            <div class="flex items-center" style="margin-bottom: 10px">
                <svg-icon style="color: #faad14; position:relative; top: 1px;" icon="alert"></svg-icon>
                <span class="ml-2 font-medium">在线仿真资源已满，暂时无法{{ title }}</span>
            </div>
            <a-table bordered :pagination="false" ref="table" :columns="columns" :dataSource="dataSource" :loading="loading">
            </a-table>
        </div>
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
             name: 'SAIMO - ' + (index + 1),
         }))
     } finally {
         loading.value = false
     }
 }
 </script>
 <style lang="less">
.ant-table-bordered {
    .ant-table-tbody tr:last-child td {
        border-bottom-color: var(--table-border-color);
    }
}
</style>