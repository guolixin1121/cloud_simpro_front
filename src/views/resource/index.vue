<template>
    <div class="main">
        <div class="flex justify-between">
            <span class="title">场景资源库</span>
            <a-input-search style="width: 350px" placeholder="请输入场景集名称" :allowClear="true"
                v-model:value="query" @search="onSearch" @clear="onSearch"></a-input-search>
        </div>
        <div class="sceneset-list">
            <div v-for="(sceneset, index) in scenesets" :key="index" class="sceneset"
                @click="onSelect(sceneset)">
                <div class="name">{{ sceneset?.name }}</div>
                <div class="count">包含：{{ sceneset?.scene_count }}个场景</div>
                <a-button type="primary">查看</a-button>
            </div>
        </div>
    </div>
    <a-modal :title="modal.title" v-model:visible="modal.visible" :footer="null"
        :destroy-on-close="true" @close="modal.visible = false">
        <a-form class="modal-content" :labelCol="{ style: { width: '80px' } }">
            <a-form-item label="场景集名称">{{ selectedSceneset.name }}</a-form-item>
            <a-form-item label="场景集描述">{{ selectedSceneset.desc || '--' }}</a-form-item>
            <a-form-item label="标签">
                <ul class="flex flex-wrap">
                    <li v-for="label in selectedSceneset.labels_detail" :key="label.name"
                        class=" inline-block mr-2">
                        {{ label.display_name }}
                    </li>
                </ul>
            </a-form-item>
            <a-form-item label="场景数量">{{ selectedSceneset.scene_count }}</a-form-item>
        </a-form>
        <div class="modal-buttons">
            <a-button @click="modal.visible = false">取消</a-button>
            <a-button type="primary" :loading="submitting" @click="onApply">申请</a-button>
        </div>
    </a-modal>
</template>
<script lang="ts" setup>
const scenesets = ref<any>([])
const modal = reactive({
    visible: false,
    title: '',
    sceneset: {}
})
const selectedSceneset = ref()
const submitting = ref(false)
const query = ref('')

const onSearch = async () => {
    const res = await api.sceneResource.getScenesetList({
        name: query.value
    })
    scenesets.value = res.results
}

const loadScenesets = async () => {
    const res = await api.sceneResource.getScenesetList()
    scenesets.value = res.results
}
loadScenesets()

const onSelect = (sceneset: any) => {
    modal.title = '申请场景集授权'
    modal.visible = true
    selectedSceneset.value = sceneset
}
const onApply = async () => {
    try {
        submitting.value = true
        await await api.grant.apply({
            id: [selectedSceneset.value.id],
            type: 3
        })
        message.success('申请已提交')
        modal.visible = false
    } finally {
        submitting.value = false
    }
}
</script>

<style lang="less" scoped>
.sceneset-list {
    border-radius: 4px;
    margin-top: 16px;
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
    height: calc(100% - 50px)
}
.sceneset {
    border: 1px solid #E8EAEC;
    margin-right: 16px;
    margin-bottom: 16px;
    padding: 16px;

    &:hover {
        border: 1px solid #00AF59;
    }
    .name {
        font-weight: bold;
        font-size: 16px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .count {
        color: #60646E;
        margin: 8px 0;
    }
}

@media screen and (max-width: 1440px) {
    .sceneset {
        width: 31%;
    }
    
}
@media screen and (min-width: 1440px) {
    .sceneset {
        width: 24%;
    }

}
</style>