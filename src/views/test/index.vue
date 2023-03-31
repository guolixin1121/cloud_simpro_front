<template>
  <div class="home" @click="() => f()">2222</div>
</template>

<script setup lang="ts">
type a = number

const f = (b: a) => {
  console.log(b)
}
const h: number = 1
console.log(h)
</script>
