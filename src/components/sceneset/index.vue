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
        <a-tooltip v-else class="line-value" :title="sceneset?.labels_detail.map((item: any) => item.display_name).join('  ')" placement="topLeft">
            <span class="mr-2" v-for="item in sceneset?.labels_detail" :key="item.name">
            {{ item.display_name }}
          </span>
        </a-tooltip>
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