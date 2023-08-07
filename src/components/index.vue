<!-- components组件的索引页route path： /demo -->
<template>
    <div style="margin: 0 auto; width: 1140px; padding: 16px 24px; background-color: #fff; ">
      <h2 class=" text-center mb-0">自定义组件</h2>
      <a-tabs style="height: calc(100% - 50px)">
        <a-tab-pane v-for="demo in demoComponents" :key="demo.name" :tab="demo.name">
          <div class="markdown">
            <component :is="demo.readme"></component>
          </div>
          <component :is="demo.demo" v-if="demo.demo"></component>
        </a-tab-pane>
      </a-tabs>
    </div>
</template>

<script setup lang="ts">
const demoComponents = ref([] as { name: String, readme: any, demo?: any}[])

const getComponents = async () => {
  const readmes = import.meta.glob('./**/readme.md')

  const demos = []
  const demoFiles = import.meta.glob('./**/demo.vue')
  for(let demo in demoFiles) {
    const path = demo.replace('./', '').replace('/demo.vue', '')
    const component = await demoFiles[demo]()
    demos.push({
      name: path,
      demo: component
    })
  }

  for(let readme in readmes) {
    const path = readme.replace('./', '').replace('/readme.md', '')
    const demo = demos.find((item: any) => item.name == path)
    const component = await readmes[readme]()
    demoComponents.value.push({
      name: path,
      readme: (component as any).VueComponent,
      demo: (demo?.demo as any)?.default
    })
  }
}
getComponents()
</script>

<style lang="less">
.router-link-active {
  font-weight: 600;
  font-size: 16px;;
}
</style>
