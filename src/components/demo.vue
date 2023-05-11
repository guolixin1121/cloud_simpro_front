<!-- components组件的索引页route path： /demo -->
<template>
  <h2>自定义组件Demo</h2>
  <router-link v-for="route in routes" :key="route.path"
    class="block text-blue mb-2"
    :to="route.path">{{ route.name }}</router-link>
</template>

<script setup lang="ts">
const generateDemoRoutes = () => {
  const routes = []
  const modules = import.meta.glob('./**/demo.vue')
  for(const filePath in modules) {
    const path = filePath.replace('./', '').replace('/demo.vue', '')
    routes.push({
      path: '/demo/' + path,
      name: path,
      component: modules[filePath]
    })
  }
  console.log(routes)
  return routes
}

const routes = generateDemoRoutes()
</script>
