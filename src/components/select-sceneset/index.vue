<template>
    <div class="modal-content">
    <p>请选择泛化生成的具体场景的保存路径</p>
    <a-radio-group v-model:value="modal.scenesetType" name="radioGroup">
        <a-radio :value="1">新建场景集</a-radio>
        <a-radio :value="2">已有场景集</a-radio>
    </a-radio-group>
    <a-form ref="modalForm" :model="modal" style="margin-top: 16px;"
        :labelCol ="{ style: { width: '140px' } }">
        <a-form-item label="我的场景-具体场景" name="targetSceneset" 
            :rules="[{ required: true, message: '请选择已有场景集'} ]" v-if="modal.scenesetType == 1">
            <ch-input v-model:value="modal.targetSceneset" placeholder="请输入场景集名称"></ch-input>
        </a-form-item>
        <a-form-item label="我的场景-具体场景" name="targetSceneset" 
            :rules="[{ required: true, message: '请输入场景集名称'} ]" v-else>
            <scroll-select :api="scenesetApi" v-model:value="modal.targetSceneset" 
            :fieldNames="{ label: 'groupName', value: 'id' }" placeholder="请输入场景集名称">
            </scroll-select>
        </a-form-item>
    </a-form>
    </div>
    <div class="modal-buttons">
    <a-button @click="modal.cloneVisible = false">取消</a-button>
    <a-button @click="onOk" :loading="submitting" type="primary">确定</a-button>
    </div>
</template>

<script type="ts" setup>

defineProps({
    title: {
        type: String,
        default: () => '请选择场景的保存路径'
    },
    value: {
        type: String
    }
})
const emits = defineEmits(['update:value'])

const modal = reactive({
    scenesetType: 1,
    targetSceneset: ''
})

const scenesetApi = api.scenesets.getList

const modalForm = ref()

const onOk = () => {
    modalForm.value.validate().then(() => {
        emits('update:value', modal.targetSceneset)
    })
}

onMounted(() => {
    scenesetApi.value = '/api/sceneset/list'
})
</script>