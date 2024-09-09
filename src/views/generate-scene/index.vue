<template>
  <div class="main">
    <span class="title">场景生成方式</span>
    <ul class="list">
      <template v-for="item in list"  :key="item.name">
        <li v-if="hasPermission(item.key)" class="item" @click="() => gotoPage(item.url)">
            <div class="item-logo"><img :src="item.image" style="width: 72px;"/></div>
            <div class="item-name">{{ item.name }}</div>
            <div class="item-desc">{{ item.desc }}</div>
        </li>
      </template>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { Modal } from 'ant-design-vue'
import { gotoSubPage } from '@/utils/tools'
import generate_data from '@/assets/images/generate_data.png'
import generate_semantic from '@/assets/images/generate_semantic.png'
import generate_3d from '@/assets/images/generate_3d.png'
import generate_editor from '@/assets/images/generate_editor.png'
import icon from '@/assets/images/icon_tip.png'

const hasPermission = (key: string | undefined) =>  key ? store.user.hasPermission(key) : true
const list = [
  { name: '语义生成', key: 'semantic', desc: '基于LLM，通过打字或者语音直接构建需要的测试场景。', url: '/llm/', image: generate_semantic },
  { name: '数据生成', desc: '对真实数据源进行场景挖掘，通过设置场景的参数特征挖掘典型性场景。', url: '', image: generate_data},
  { name: '三维重构', desc: '基于XCT通过上传图片或视频直接构建需要的测试场景。', url: '', image: generate_3d },
  { name: '场景编辑器', desc: '利用场景编辑器，建立事件设置交互行为创建测试场景。', url: '', image: generate_editor }
]

const gotoPage = (url: string) => {
  if(url) {
    gotoSubPage(url)
  } else {
    Modal.warn({
      width: "326px",
      title: '',
      content: h('div', { style: 'display: flex; align-items: center; margin-top: -8px;' }, [
        h('img', { src: icon, alt: 'icon', style: 'margin-right: 8px;' }),
        h('span', { style: 'font-weight: 600; font-size: 16px; color: #1E2229;' }, '该模块正在更新中')
      ]),
      icon: '',
      okText: '确定'
    })
  }
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
    width: calc((calc(100% - 72px))/4);
    height: 300px;
    margin-right: 24px;
    margin-top: 16px;
    border-radius: 4px;
    border: 1px solid #e8eaec;
    cursor: pointer;
    padding: 24px;
    &:hover {
      border: 2px solid var(--primary-color);
    }
    &:last-child {
      margin-right: 0px;
    }
    &-logo {
      text-align: center;
      margin-top: 40px;
      margin-bottom: 24px;
    }
    &-name {
      text-align: center;
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 16px;
    }
    &-desc {
      text-align: center;
    }
  }
}
</style>
