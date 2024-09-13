<template>
    <div class="card-container">
        <div class="flex justify-between" style="padding: 24px; padding-bottom: 0px">
            <span class="title">场景资源库</span>
            <a-input-search style="width: 350px" placeholder="请输入场景集名称" :allowClear="true"
                v-model:value="query" @search="loadSceneset()" @clear="loadSceneset()">
            </a-input-search>
        </div>
        <a-spin ref="container" :spinning="loading">
            <div class="sceneset-list">
                <div v-for="(sceneset, index) in scenesets" :key="index" class="sceneset"
                    :class="'sceneset--' + sceneset?.apply_status" @click="onSelect(sceneset)">
                        <img :src="sceneset?.poster_image" style="width: 100%; height: 185px; border-radius: 3px 3px 0 0;" />
                        <div style="padding: 16px;">
                        <div class="name">{{ sceneset?.name }}</div>
                        <div class="count">包含：{{ sceneset?.scene_count }}个场景</div>
                        <a-button v-if="sceneset?.apply_status == 0" type="primary" size="small"
                            style="width: 52px; font-size: 12px;" @click="onView(sceneset)">查看</a-button>
                        <span v-if="sceneset?.apply_status == 1" style="color: #FF8A03">等待授权中</span>
                        <span v-if="sceneset?.apply_status == 2" style="color: #60646E;">已授权</span>
                    </div>
                </div>
            </div>
        </a-spin>
    </div>
    <a-modal :title="modal.title" v-model:visible="modal.visible" :footer="null"
        :destroy-on-close="true" @close="modal.visible = false">
        <a-form class="modal-content" :labelCol="{ style: { width: '80px' } }">
            <a-form-item label="场景集名称">
                <div class="break-text">{{ selectedSceneset.name }}</div>
            </a-form-item>
            <a-form-item label="场景集描述">
                <div style="max-height: 150px; overflow: auto;" class="break-text desc">{{ selectedSceneset.desc || '--' }}</div>
            </a-form-item>
            <a-form-item label="标签">
                <div class="labels" v-if="selectedSceneset.labels_detail.length > 0">
                    <span v-for="label in selectedSceneset.labels_detail" :key="label.name"
                        class="inline-block mr-2">
                        {{ label.display_name }}
                    </span>
                </div>
                <span v-else>--</span>
            </a-form-item>
            <a-form-item label="场景数量">{{ selectedSceneset.scene_count }}</a-form-item>
        </a-form>
        <div class="modal-buttons" v-if="isNotApplied(selectedSceneset)">
            <a-button @click="modal.visible = false">取消</a-button>
            <a-button type="primary" :loading="submitting" @click="onApply">申请</a-button>
        </div>
        <div class="modal-buttons" v-else>
            <a-button type="primary" style="margin-right: 0px;" @click="modal.visible = false">确定</a-button>
        </div>
    </a-modal>
</template>
<script lang="ts" setup>
const scenesets = ref<any>([])
const selectedSceneset = ref()
const modal = reactive({
    visible: false,
    title: '',
    sceneset: {}
})
const container = ref()
const query = ref('')
let currentPage = 1
let isAllLoaded = false
const loading = ref(false)
const loadSceneset = async (page: number = 1) => {
    try {
        loading.value = true
        const res = await api.sceneResource.getScenesetListV2({
            name: query.value,
            page,
            size: 16
        })
        if(page ==1 && res.results.length == 0) {
            message.warn('很抱歉，没有找到您想要搜索的场景集')
            query.value = ''
            await loadSceneset()
            return
        }
        currentPage = page
        if(page == 1) scenesets.value = []
        scenesets.value.push(...res.results)
        isAllLoaded = scenesets.value.length >= res.count
    } finally {
        loading.value = false
    }
}
onMounted(() => {
    loadSceneset()
    const tableScrollBody = container.value.$el
    if (tableScrollBody) {
        tableScrollBody.addEventListener('scroll', (e: any)=> {
            if(isAllLoaded) return
            const { target } = e
            // 触发翻页
            if (target.scrollTop + target.offsetHeight >= (target.scrollHeight - 50) 
                && !loading.value && !isAllLoaded) {
                currentPage++
                loadSceneset(currentPage)
            }
        })
    }
})

const router = useRouter()
const isNotApplied = ({apply_status}: any) => apply_status == 0
const isApproved = ({apply_status}: any) => apply_status == 2
const onSelect = (sceneset: any) => {
    if(isNotApplied(sceneset)) return
    if(isApproved(sceneset)) {
        router.push(`/my-sceneset/?id=${sceneset.replica_id}`)
        return
    }
    modal.title = '场景集详情'
    modal.visible = true
    selectedSceneset.value = sceneset
}
const onView = (sceneset: any) => {
    modal.title = '申请场景集授权'
    modal.visible = true
    selectedSceneset.value = sceneset
}

const submitting = ref(false)
const onApply = async () => {
    try {
        submitting.value = true
        await await api.grant.apply({
            id: [selectedSceneset.value.id],
            type: 3
        })
        message.success('申请已提交', 10000)
        modal.visible = false
        // loadSceneset()
        selectedSceneset.value.apply_status = 1
    } finally {
        submitting.value = false
    }
}
</script>

<style lang="less" scoped>
.card-container {
    background-color: #fff;
    height: 100%;
}
.ant-spin-nested-loading {
    overflow: auto;
    height: calc(100% - 95px);
    margin-top: 16px;
    padding: 0 24px;
}
.sceneset-list {
    min-height: 200px;
    display: flex;
    flex-wrap: wrap;
}
.sceneset {
    border: 1px solid #E8EAEC;
    border-radius: 4px;
    margin-right: 16px;
    margin-top: 16px;
    cursor: pointer;

    &.sceneset--0 {
        cursor: auto;
    }
    &:hover {
        border: 1px solid #00AF59;
    }
    .name {
        font-weight: bold;
        font-size: 14px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .count {
        color: #60646E;
        margin: 8px 0;
    }
}

@media screen and (max-width: 1660px) {
    .sceneset {
        width: calc((calc(100% - 32px))/3);
    }
    .sceneset:nth-child(3n) {
        margin-right: 0px;
    }
    .sceneset:nth-child(1), .sceneset:nth-child(2), .sceneset:nth-child(3){
        margin-top: 0px;
    }
}
@media screen and (min-width: 1661px) and (max-width: 1980px) {
    .sceneset {
        width: calc((calc(100% - 48px))/4);
    }
    .sceneset:nth-child(4n) {
        margin-right: 0px;
    }
    .sceneset:nth-child(1), .sceneset:nth-child(2), .sceneset:nth-child(3), .sceneset:nth-child(4){
        margin-top: 0px;
    }
}
@media screen and (min-width: 1981px) {
    .sceneset {
        width: calc((calc(100% - 64px))/5);
    }
    .sceneset:nth-child(5n) {
        margin-right: 0px;
    }
    .sceneset:nth-child(1), .sceneset:nth-child(2), .sceneset:nth-child(3), .sceneset:nth-child(4), .sceneset:nth-child(5) {
        margin-top: 0px;
    }
}

.labels {
    display: flex;
    flex-wrap:wrap;
    max-height: 150px;
    overflow: auto;
}
</style>