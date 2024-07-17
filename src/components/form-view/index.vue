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
    <div style="margin-left: 32px" v-if="videoUrl">
      <video width="800"  controls disablePictureInPicture
        controlslist="nodownload noremoteplaybakc noplaybackrate">
        <source :src="videoUrl" type="video/mp4">
        <!-- 您的浏览器不支持视频标签。 -->
      </video>
    </div>
    <div style="width: 55%">
      <a-spin :spinning="loading">
        <a-form :labelCol ="{ style: { width: labelWidth + 'px' } }">
          <templage v-for="(item, index) in items" :key="index">
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
          </templage>
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