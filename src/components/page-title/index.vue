<template>
  <div class="flex justify-between items-center">
    <span class="title">{{ title }}</span>
    <div>
     <slot/>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps(['title'])
</script>