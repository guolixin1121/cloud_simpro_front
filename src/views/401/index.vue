<template>
    <div>test</div>
    <a-input v-model:value="name" @input="onChange"></a-input>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const name = ref<string>('')

const onChange = () => {
    if(name.value.length > 4) {
        name.value = name.value.slice(0, 4)
    }
}
</script>
