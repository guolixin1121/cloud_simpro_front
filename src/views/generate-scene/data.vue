<template>
    <iframe :src="src" style="border: 0; width: 100%; height: 100%"></iframe>
</template>
<script lang="ts" setup>
const src = import.meta.env.VITE_BASE_STATIC_URL + 'data-manage/index.html'
</script>