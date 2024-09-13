<template>
  <div class="breadcrumb">
    <slot></slot>
    <span class="breadcrumb--current">{{ title }}</span>
  </div>
  <div class="min-main">
    <span class="title mb-5 relative">
      {{ subtitle || title }}
      <div style="position: absolute; right: 20px;">
        <slot name="button"></slot>
      </div>      
    </span>
    <div style="width: 55%">
      <a-spin :spinning="loading">
        <a-form class="view-form" :labelCol ="{ style: { width: labelWidth + 'px' } }">
          <template v-for="(item, index) in items" :key="index">
            <a-form-item :label="item.label" v-if="item.isShow == undefined || item.isShow" >
              <span v-if="!Array.isArray(item.value)"
                :class="item.isBreak == undefined || item.isBreak || item.label == '描述' ? 'break-text' : ''">
                {{ !item.value ? '--' : item.label.indexOf('时间') > -1 ? formatDate(item.value) : item.value }}
              </span>
              <ul v-else-if="item.value.length > 0" class="view-list">
                <li v-for="val in item.value" :key="val">
                  {{ val }}
                </li>
              </ul>
              <span v-else>--</span>
            </a-form-item>
          </template>
        </a-form>
      </a-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '@/utils/tools';
defineProps({
  title: {
    type: String
  },
  subtitle: {
    type: String
  },
  items: {
    type: Array<FormItem>
  },
  videoUrl: {
    type: String
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

<style>
video::-webkit-media-controls-mute-button { display: none; }
video::-webkit-media-controls-toggle-closed-captions-button { display: none; }
</style>