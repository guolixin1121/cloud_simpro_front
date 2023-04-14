<template>
  <div class="right-breadcrumb">
    <router-link to="/scene/">场景管理</router-link>
    <span class="current">{{ title }}</span>
  </div>
  <div class="right-content">
    <span class="title">{{ title }}</span>
  </div>
</template>

<script setup lang="ts">
  const id = useRoute().params.id
  const title = id === '0' ? '上传场景' : '修改场景'
</script>