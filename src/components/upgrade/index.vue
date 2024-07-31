<template>
    <a-modal :visible="visible" title="" :footer="null" style="width: 1000px"
        :closable="false" :destroy-on-close="true">
        <!-- <div class="table">
            <div class="header">
                <span>序号</span><span>功能</span><span>免费试用版</span><span>正式版本</span>
            </div>
            <div class="content" v-for="(item, index) in contents" :key="index">
                <span>{{ index + 1 }}</span>
                <span>{{item[0]}}</span>
                <span>
                    <img src="@/assets/images/icon_fail.png" v-if="item[1] == false" />
                    <img src="@/assets/images/icon_success.png" v-else-if="item[1] == true" />
                    <template v-else>{{ item[1] }}</template>
                </span>
                <span>
                    <img src="@/assets/images/icon_fail.png" v-if="item[2] == false" />
                    <img src="@/assets/images/icon_success.png" v-else-if="item[2] == true" />
                    <template v-else>{{ item[2] }}</template>
                </span>
            </div>
        </div> -->
        <div class="container">
            <svg-icon icon="close" class="close" @click="hide"/>
            <div class="content-img"></div>
            <!-- <img src="@/assets/images/upgrade.png" class="image"/> -->
            <div class="upgrade-btn">
                <img src="@/assets/images/upgrade-btn.png" @click="upgrade" />
                <!-- <a-button type="primary" @click="upgrade" :loading="loading">立即升级</a-button> -->
            </div>
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

defineExpose({
    show
})

// const contents = [
//     ['多团队协作', false, true ],
//     ['SOTIF分析项目数', '3个', '无限' ],
//     ['SOTIF分析每项目内整车级功能数', '3个', '无限' ],
//     ['STPA分析项目数', '3个', '无限' ],
//     ['STPA分析每项目内整车级功能数', '3个', '无限' ],
//     ['GSN分析项目数', '3个', '无限' ],
//     ['创建报告数', '3个', '无限' ],
//     ['生成场景-泛化-仿真次数', '10次', '无限' ],
//     ['单次允许勾选逻辑场景数', '5个', '根据购买资源而定' ],
//     ['单逻辑场景允许泛化个数', '50个', '根据购买资源而定' ],
//     ['在线仿真资源', false, '根据购买资源而定' ],
//     ['并行仿真资源', false, '根据购买资源而定' ],
//     ['联仿接口对接', false, true ],
//     ['动力学模型管理及仿真调用', false, true ],
//     ['传感器模型管理及仿真调用', false, true ],
//     ['评测指标管理及仿真调用', false, true ],
//     ['仿真结果评测及报告生成', false, true ],
//     ['路采数据管理及场景生成', false, true ],
//     ['NG场景片段的自动生成', false, true ],
//     ['交通流仿真', false, true ],
//     ['虚拟城市仿真', false, true ],
//     ['支持私有云部署', false, true ],
//     ['1对1培训', false, true ],
// ]

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
.container {
    background-image: url('@/assets/images/upgrade-bg.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
    height: 700px;
    overflow: auto;
    text-align: center;
    position: relative;
}
.content-img {
    width: 100%;
    height: calc(100% - 16px);
    background-image: url('@/assets/images/upgrade.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center top;
}
.close {
    position: absolute;
    right: 20px;
    top: 16px;
    cursor: pointer;
}
.upgrade-btn {
    width: 100%;
    padding: 16px;
    padding-top: 0px;
    position: absolute;
    bottom: 0px;
    cursor: pointer;
}
.table {
    display: block;
    margin: 24px;
    font-size: 12px;
    height: 500px;
    overflow: auto;

    .header, .content {
        height: 40px;
        line-height: 40px;
        span { 
            display: inline-block; 
            text-align: center; 
            border: 1px solid var(--table-border-color);
        }
        span:nth-child(1) { width: 50px; }
        span:nth-child(2) { width: calc(100% - 350px); text-align: left; padding-left: 16px; }
        span:nth-child(3) { width: 150px; }
        span:nth-child(4) { width: 150px; }
    }

    .header {
        font-weight: 500;
        background-color: var(--table-header-color);
        span { text-align: center !important;}
    }

    .content:nth-child(2n + 1) {
        background-color: var(--table-stripe-color);
    }
}
</style>