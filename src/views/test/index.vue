<template>
  <div class="home mb-10" @click="f">click</div>
  <img :src="img" />
</template>

<script setup lang="ts">
import img from '@/assets/images/404.png'
const router = useRouter()

const f = async () => {
  router.push(`/test2`)
}
</script>
