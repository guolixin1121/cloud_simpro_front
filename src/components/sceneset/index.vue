<!-- 场景列表页的顶部展示场景集信息 -->
<template>
  <div class="white-block sceneset">
    <a-row>
      <a-col :span="6">
        <span class="label">场景集名称</span>
        <a-tooltip :title="sceneset?.name" placement="topLeft">
          <span class="line-value">{{ sceneset?.name || '--' }}</span>
        </a-tooltip>
      </a-col>
      <a-col :span="18" style="padding-left: 24px;">
        <span class="label">场景集标签</span>
        <span v-if="!sceneset || (sceneset.labels_detail && sceneset.labels_detail.length == 0)">--</span>
        <a-tooltip v-else class="line-value" :title="getTips(sceneset)" placement="topLeft">
          <ul style="margin: 0px; max-height: 80px">
            <li class=" inline-block mr-2" v-for="item in sceneset?.labels_detail" :key="item.name">
              {{ item.display_name }}
            </li>
          </ul>
        </a-tooltip>
      </a-col>
    </a-row>
    <a-row style="margin-bottom: 0px;">
      <a-col :span="6">
        <span class="label">场景集来源</span>
        <span class="line-value">{{ sceneset?.sourceName || '--' }}</span>
      </a-col>
      <a-col :span="18" style="padding-left: 24px;">
        <span class="label">场景集描述</span>
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
const getTips = (set: any) => {
  let tips = ''
  set.labels_detail?.forEach((item: any) =>  tips += ' ' + item.display_name)
  return tips
}
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
    width: calc(100% - 60px);
    display: inline-block;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
</style>