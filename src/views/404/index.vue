<template>
    <div class="containers">
        <svg-icon icon="alert"/>
        <span class="title">页面未找到</span>
        <span class="tip">请检查路径后重试或返回首页</span>
        <a-button type="primary" @click="goback()">返回</a-button>
    </div>
</template>

<script setup lang="ts">
// const router = useRouter()
const goback = () => location.href = '/#/' // router.push('/')
</script>

<style lang="less" scoped>
.containers {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
    width: 100%;
}
.icon {
    font-size: 50px;
    color: var(--warning-color)
}
.title {
    font-size: 18px;
    font-weight: 500;
}
.ant-btn {
    margin: 16px;
}
</style>