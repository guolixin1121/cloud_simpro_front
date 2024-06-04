<!-- 场景列表页的顶部展示场景集信息 -->
<template>
  <div class="white-block">
    <div class="line" :class="'line--' + (sceneset?.sourceName ? '4' : '3')">
      <div class="line-item">
        <span class="label" style="width: 80px">场景集ID</span>{{ sceneset?.id }}
      </div>
      <div class="line-item">
        <span class="label">场景集名称</span>
        <a-tooltip :title="sceneset?.name.length < 10 ? '' : sceneset?.name" placement="topLeft" class="overflow-ellipsis">
          {{ sceneset?.name }}
        </a-tooltip>
      </div>
      <div class="line-item">
        <span class="label">创建时间</span>
        {{ sceneset?.create_time }}
      </div>
      <div class="line-item" v-if="sceneset?.sourceName">
        <span class="label">场景集来源</span>
        {{ sceneset?.sourceName }}
      </div>
    </div>
    <div class="line">
      <div class="line-item" style="width: 100%">
        <span class="label">场景集描述</span>
        <a-tooltip class="overflow-ellipsis" :title="sceneset?.desc" placement="topLeft">{{ sceneset?.desc || '--' }}</a-tooltip>
      </div>
    </div>
    <div class="line">
      <div class="line-item" style="width: 100%">
        <span class="label">场景集标签</span>
        <span v-if="!sceneset || (sceneset.labels_detail && sceneset.labels_detail.length == 0)">--</span>
        <ul v-else class="view-list">
          <li class="mb-2" v-for="item in sceneset?.labels_detail" :key="item.name">
            {{ item.display_name }}
          </li>
        </ul>
      </div>
    </div>
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

<style lang="less" scopped>
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
.line--4 .line-item { width: 25%; }
</style>