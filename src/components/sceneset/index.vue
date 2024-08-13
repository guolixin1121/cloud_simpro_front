<!-- 场景列表页的顶部展示场景集信息 -->
<template>
  <div class="white-block sceneset">
    <a-row>
      <a-col :span="7">
        <span class="label">场景集名称</span>
        <a-tooltip :title="sceneset?.name" placement="topLeft">
          <span class="line-value">{{ sceneset?.name }}</span>
        </a-tooltip>
      </a-col>
      <a-col :span="5" v-if="isFromMySceneset">
        <span class="label">场景集来源</span>{{ sceneset?.sourceName }}
      </a-col>
      <a-col :span="12">
        <span class="label">场景集描述</span>
        <a-tooltip :title="sceneset?.desc" placement="topLeft">
            <span class="line-value">{{ sceneset?.desc || '--' }}</span>
        </a-tooltip>
      </a-col>
    </a-row>
    <a-row style="margin-bottom: 0px;">
      <a-col :span="24">
        <span class="label">场景集标签</span>
        <span v-if="!sceneset || (sceneset.labels_detail && sceneset.labels_detail.length == 0)">--</span>
        <ul class="view-list" style="margin: 0px; max-height: 80px" v-else>
          <li v-for="item in sceneset?.labels_detail" :key="item.name">
            {{ item.display_name }}
          </li>
        </ul>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    sceneset: {
        required: true,
        type: Object
    }
})
const isFromMySceneset = computed(() => props.sceneset?.sourceName)
</script>

<style lang="less">
.sceneset.white-block {
  .ant-row {
    margin-bottom: 8px;
  }
  .ant-col {
    display: inline-flex;
    .label {
      width: 80px;
    }
  }
  .line-value {
    width: calc(100% - 150px);
    display: inline-block;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
</style>

<!-- <style lang="less" scopped>
.line {
  display: flex;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0px;
  }

  .line-item {
    display: flex;
    padding-right: 30px;

    &:last-child {
      padding-right: 0px;
    }
    .label {
      color: var(--text-second-color); 
      padding-right: 8px;
    }
    .overflow-ellipsis {
      display: inline-block;
      width: calc(100% - 100px);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .view-list {
      width: calc(100% - 100px);
      margin-bottom: 0px;
    }
  }
}
.line--3 .line-item { width: 33%; }
.line--4 .line-item { width: 25%; } -->
<!-- </style> -->