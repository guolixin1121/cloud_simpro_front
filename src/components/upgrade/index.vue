<template>
    <a-modal title="" wrap-class-name="full-modal" 
        :visible="visible" :footer="null" width="100%" :closable="false" :destroy-on-close="true">
        <svg-icon icon="close" class="close" @click="hide"/>
        <div class="content"></div>
        <div class="upgrade-btn">
            <img src="@/assets/images/upgrade-btn.png" @click="upgrade" />
        </div>
    </a-modal>
</template>

<script setup lang="ts">
const props = defineProps({
 module: {
    type: String,
    required: true
 }
})
const visible = ref(false)

const show = () => visible.value = true    
const hide = () => visible.value = false
defineExpose({ show })

const loading = ref(false)
const upgrade = async () => {
    if(loading.value) return
    try {
        loading.value = true
        await api.auth.clue({module: props.module})
        message.success('版本升级申请成功，稍后工作人员将联系您，请耐心等候')
        hide()
    } finally {
        loading.value = false
    }
}
</script>

<style lang="less" scoped>
.content {
    width: 100%;
    height: calc(100% - 65px);
    background-image: url('@/assets/images/upgrade.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
}
.close {
    position: absolute;
    right: 20px;
    top: 16px;
    cursor: pointer;
    color: var(--text-second-color)
}
.upgrade-btn {
    position: absolute;
    bottom: 0px;
    width: 100%;
    padding: 24px;
    text-align: center;
    img {
        cursor: pointer;
        height: 44px;
    }
}
</style>
<style lang="less">
.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }
  .ant-modal-body {
    flex: 1;
    background-image: url('@/assets/images/upgrade-bg.png');
    background-size: 100% 100%;
  }
}
</style>