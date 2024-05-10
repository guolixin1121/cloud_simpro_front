<template>
    <a-radio-group v-model:value="modal.scenesetType" name="radioGroup">
        <a-radio :value="1">新建场景集</a-radio>
        <a-radio :value="2">已有场景集</a-radio>
    </a-radio-group>
    <a-form ref="modalForm" :model="modal" style="margin-top: 16px;"
        :labelCol ="{ style: { width: '140px' } }">
        <a-form-item :label="label" name="targetSceneset" 
            :rules="[{ required: true, message: '请输入场景集名称'} ]" v-if="modal.scenesetType == 1">
            <ch-input v-model:value="modal.targetSceneset" placeholder="请输入场景集名称"></ch-input>
        </a-form-item>
        <a-form-item :label="label" name="targetSceneset" 
            :rules="[{ required: true, message: '请选择已有场景集'} ]" v-else>
            <scroll-select :api="scenesetApi" v-model:value="modal.targetSceneset" 
                :fieldNames="fieldNames" placeholder="请选择已有场景集">
            </scroll-select>
        </a-form-item>
    </a-form>
</template>

<script setup lang="ts">
const props = defineProps({
    isLogicSceneset: {
        type: Boolean,
        default: () => false
    },
    value: {
        type: String,
        default: () => ''
    }
})
const emits = defineEmits(['update:value'])

const scenesetApi = props.isLogicSceneset ? (args: any) => api.logicScenesets.getList({...args, source: 0})
    : (args: any) => api.scenesets.getList({...args, source: 0})
const fieldNames = props.isLogicSceneset ? { label: 'name', value: 'id' }
    : { label: 'groupName', value: 'id' }
const label = props.isLogicSceneset ? '我的场景-逻辑场景' : '我的场景-具体场景'

const modal = reactive({
    scenesetType: 1,
    targetSceneset: ''
})
const modalForm = ref()

watch(() => modal.targetSceneset, () => {
    modalForm.value.validate().then(() => {
        emits('update:value', {
            sceneset: modal.targetSceneset,
            scenesetType: modal.scenesetType
        })
    })
})
defineExpose({
    validate: () => modalForm.value.validate()
})
</script>