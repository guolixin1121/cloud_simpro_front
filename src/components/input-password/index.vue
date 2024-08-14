<template>
    <a-input-password ref="inputRef" maxLength="16" v-model:value="innerValue"  autocomplete="new-password"
        @change="onChange"></a-input-password>
</template>

<script lang="ts" setup>
const props = defineProps(['value']) 
const innerValue = ref(props.value)
const inputRef = ref()
const emits = defineEmits(['update:value'])
const onChange = (e: any) => {
    innerValue.value = e.target.value.trim()
    emits('update:value', innerValue.value)
    inputRef.value.blur()
    inputRef.value.focus()
}
</script>