<!-- 场景列表页的顶部展示场景集信息 -->
<template>
  <div class="white-block top">
    <a-row>
      <a-col :span="5">场景集ID：{{ sceneset?.id }}</a-col>
      <a-col :span="5">
        场景集名称：
        <a-tooltip :title="sceneset?.name">
          <span class="line-value">{{ sceneset?.name }}</span>
        </a-tooltip>
      </a-col>
      <a-col :span="14">
        场景集标签：
        <span v-if="!sceneset || (sceneset.labels_detail && sceneset.labels_detail.length == 0)">--</span>
        <div class="inline-block line-value" v-else>
          <span class="mr-4" v-for="item in sceneset?.labels_detail" :key="item.name">
            {{ item.display_name }}
          </span>
        </div>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="5">
        创建时间：{{ sceneset?.create_time }}
      </a-col>
      <a-col :span="19">
        场景集描述：
        <a-tooltip :title="sceneset?.desc" placement="topLeft">
            <span class="line-value">{{ sceneset?.desc || '--' }}</span>
        </a-tooltip>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
defineProps({
    sceneset: {
        required: true,
        type: Object
    }
})
</script>