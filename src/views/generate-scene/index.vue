<template>
  <div class="main">
    <span class="title">场景生成方式</span>
    <ul class="list">
      <li v-for="item in list" class="item" :key="item.name">
        <div @click="() => gotoPage(item.url)">
          <div class="item-header">{{ item.name }}</div>
          <div class="item-logo"><img src="@/assets/images/icon_navlogo_car.png" /></div>
          <div class="item-name">{{ item.desc }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { gotoSubPage } from '@/utils/tools'
const list = [
  { name: '数据生成', desc: '对真实数据源进行场景挖掘，通过设置场景的参数特征挖掘典型性场景', url: '/data/' },
  { name: '语义生成', desc: '基于LLM，通过文字或语音直接构建需要的测试场景', url: '/llm/' },
  { name: '三位重构', desc: '基于XCT，通过上传图片或视频直接构建需要的测试场景', url: ''},
  { name: '场景编辑器', desc: '利用场景编辑器，建立事件设置交互行为创建测试场景', url: '' }
]

const gotoPage = (url: string) => {
  if(!url) return
  gotoSubPage(url)
}
</script>

<style lang="less" scoped>
@import '@/assets/styles/variable.less';
.main {
  overflow: auto;
}
.list {
  display: flex;
  flex-wrap: wrap;

  .item {
    width: 23%;
    height: 280px;
    margin-right: 28px;
    margin-top: 18px;
    border-radius: 4px;
    border: 1px solid #e8eaec;
    cursor: pointer;
    &:hover {
      border: 2px solid var(--primary-color);
    }
    &-header {
      height: 30px;
      line-height: 30px;
      background: #e6e7eb;
      text-align: center;
      color: #60656e;
    }
    &-logo {
      text-align: center;
      margin-top: 40px;
      margin-bottom: 30px;
    }
    &-name {
      font-size: 16px;
      font-weight: 600;
      text-align: center;
      padding: 10px 40px;
    }
    &-title {
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      padding: 16px 24px;
      .title {
        font-weight: 600;
        color: #1e2229;
      }
    }
  }
}
</style>
