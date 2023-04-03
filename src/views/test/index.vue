<template>
  <div class="home" @click="f">click</div>
  <img :src="img" />
</template>

<script setup lang="ts">
import img from '@/assets/images/404.png'
const router = useRouter()

const f = async () => {
  router.push(`/test2`)
}
console.log(process.env.VITE_BASE_STATIC_URL)
</script>
