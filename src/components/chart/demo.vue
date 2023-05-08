<template>
  <a-tabs>
    <a-tab-pane key="2" tab="说明">
      <div class="bg-white px-8 py-4 markdown">
        <VueComponent />
      </div>
    </a-tab-pane>
    <a-tab-pane key="1" tab="示例">
    </a-tab-pane>
  </a-tabs>
</template>

<script setup lang="ts">
import * as markdown from './readme.md'

interface Markdown {
  VueComponent: any
}
const VueComponent = (markdown as unknown as Markdown).VueComponent
</script>
