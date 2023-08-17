<template>
  <div class="breadcrumb">
    <slot></slot>
    <span class="breadcrumb--current">{{ title }}</span>
  </div>
  <div class="min-main">
    <span class="title mb-5">{{ title }}</span>
    <a-spin :spinning="loading">
      <a-form :labelCol ="{ style: { width: labelWidth + 'px' } }"  style="width: 55%">
        <templage v-for="(item, index) in items" :key="index">
          <a-form-item :label="item.label" v-if="item.isShow == undefined || item.isShow" >
            <span v-if="!Array.isArray(item.value)" 
              :class="item.isBreak == undefined || item.isBreak || item.label == '描述' ? 'break-text' : ''">
              {{ item.label.indexOf('时间') > -1 ? formatDate(item.value) : item.value }}
            </span>
            <ul v-else-if="item.value.length > 0" class="view-list">
              <li class="mb-2" v-for="val in item.value" :key="val">
                {{ val }}
              </li>
            </ul>
            <span v-else>无</span>
          </a-form-item>
        </templage>
      </a-form>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '@/utils/tools';
defineProps({
  title: {
    type: String
  },
  items: {
    type: Array<FormItem>
  },
  loading: {
    type: Boolean,
    default: () => false
  },
  labelWidth: {
    type: Number,
    default: () => 100
  }
})
</script>

<style lang="less" scoped>
.break-text {
  word-break:break-all; 
  // word-wrap:inherit;
  white-space: break-spaces;
}
</style>