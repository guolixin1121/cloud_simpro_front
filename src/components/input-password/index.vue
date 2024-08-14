<template>
    <a-input-password maxLength="16" v-model:value="innerValue"  autocomplete="new-password"
        @change="onChange"></a-input-password>
</template>

<script lang="ts" setup>
const props = defineProps(['value']) 
const innerValue = ref(props.value)
const emits = defineEmits(['update:value'])
const onChange = (e: any) => {
    innerValue.value = e.target.value.trim()
    emits('update:value', innerValue.value)
}
</script>