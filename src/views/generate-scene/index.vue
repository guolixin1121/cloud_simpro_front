<template>
  <div class="main">
    <span class="title">场景生成方式</span>
    <ul class="list">
      <template v-for="item in list"  :key="item.name">
        <li v-if="hasPermission(item.key)" class="item" @click="() => gotoPage(item.url)">
            <div class="item-logo"><img :src="item.image" /></div>
            <div class="item-name">{{ item.name }}</div>
            <div class="item-desc">{{ item.desc }}</div>
        </li>
      </template>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { gotoSubPage } from '@/utils/tools'
import generate_data from '@/assets/images/generate_data.png'
import generate_semantic from '@/assets/images/generate_semantic.png'
import generate_3d from '@/assets/images/generate_3d.png'
import generate_editor from '@/assets/images/generate_editor.png'

const hasPermission = (key: string | undefined) =>  key ? store.user.hasPermission(key) : true
const list = [
  { name: '数据生成', desc: '对真实数据源进行场景挖掘，通过设置场景的参数特征挖掘典型性场景。', url: '', image: generate_data},
  { name: '语义生成', key: 'semantic', desc: '基于LLM，通过打字或者语音直接构建需要的测试场景。', url: '/llm/', image: generate_semantic },
  { name: '三维重构', desc: '基于XCT通过上传图片或视频直接构建需要的测试场景。', url: '', image: generate_3d },
  { name: '场景编辑器', desc: '利用场景编辑器，建立事件设置交互行为创建测试场景。', url: '', image: generate_editor }
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
    height: 300px;
    margin-right: 28px;
    margin-top: 18px;
    border-radius: 4px;
    border: 1px solid #e8eaec;
    cursor: pointer;
    padding: 24px;
    &:hover {
      border: 2px solid var(--primary-color);
    }
    &-logo {
      text-align: center;
      margin-top: 40px;
      margin-bottom: 30px;
    }
    &-name {
      text-align: center;
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 16px;
    }
  }
}
</style>
