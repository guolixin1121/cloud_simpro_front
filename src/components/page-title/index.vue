<template>
  <div class="title-section">
    <span class="title">{{ title }}</span>
    <div>
     <slot/>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps(['title'])
</script>