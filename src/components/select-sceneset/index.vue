<template>
    <a-radio-group v-model:value="modal.scenesetType" name="radioGroup" class="mt-2">
        <a-radio :value="1">新建场景集</a-radio>
        <a-radio :value="2">已有场景集</a-radio>
    </a-radio-group>
    <p style="margin: 16px 0 10px;">{{ label }}</p>
    <a-form ref="modalForm" :model="modal">
        <a-form-item name="targetSceneset" 
            :rules="[{ required: true, message: '请输入场景集名称'},
            { validator: () => checkChName(modal.targetSceneset, 160) }
             ]" v-if="modal.scenesetType == 1">
            <ch-input v-model:value="modal.targetSceneset" :maxlength="160" placeholder="请输入新建场景集名称"></ch-input>
        </a-form-item>
        <a-form-item name="targetSceneset" 
            :rules="[{ required: true, message: '请选择已有场景集'} ]" v-else>
            <scroll-select :api="scenesetApi" v-model:value="modal.targetSceneset" 
                :fieldNames="fieldNames" placeholder="请选择已有场景集">
            </scroll-select>
        </a-form-item>
    </a-form>
</template>

<script setup lang="ts">
import { checkChName } from '@/utils/tools'
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
    : (args: any) => api.scene.getScenesetList({...args, source: 0})
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
watch(() => modal.scenesetType, () => modal.targetSceneset = '')
defineExpose({
    validate: () => modalForm.value.validate()
})
</script>