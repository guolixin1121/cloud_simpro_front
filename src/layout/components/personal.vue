<template>
<!-- <svg-icon icon="bianji"></svg-icon> -->
    <a-spin :spinning="loading">
        <div class="personal">
            <div>
                <span class="label">用户名</span><span>{{ userDetail.username }}</span>
            </div>
            <div>
                <span class="label">姓名</span>
                <template v-if="!isEdit">
                    <span>{{ userDetail.name }}</span>
                    <svg @click="editName" xmlns="http://www.w3.org/2000/svg" style="cursor: pointer; margin-left: 10px;" width="16" height="16"><path fill="#00AF59" fill-rule="nonzero" stroke="#00AF59" stroke-width=".2" d="M7.441 1a.576.576 0 0 1 .01 1.152H2.152v11.696h11.696V8.6a.576.576 0 0 1 1.152 0v5.264c0 .627-.508 1.135-1.135 1.135H2.135A1.135 1.135 0 0 1 1 13.865V2.135C1 1.508 1.508 1 2.135 1H7.44Zm7.117.442a.594.594 0 0 1 0 .84l-6.69 6.69a.594.594 0 0 1-.84-.84l6.69-6.69a.594.594 0 0 1 .84 0Z"></path></svg>
                </template>
                <ch-input ref="inputRef" v-else v-model:value="userDetail.name" @blur="onEditName"/>
            </div>
            <div>
                <span class="label">角色名称</span><span>{{ userDetail.roleName }}</span>
            </div>
            <div>
                <span class="label">企业账户名</span><span>{{ user.enterpriseAccount }}</span>
            </div>
            <div>
                <span class="label">状态</span><span>{{ statusName }}</span>
            </div>
            <div>
                <span class="label">有效期</span><span>{{ userDetail.startTime?.replaceAll('-', '.') }}-{{ userDetail.endTime?.replaceAll('-', '.') }}</span>
            </div>
        </div>
    </a-spin>
</template>
<script setup lang="ts">
const STATUS = {
    '0': '停用',
    '1': '待生效',
    '2': '使用中',
    '3': '已过期'
}
type STATUSKEY = keyof typeof STATUS

const isEdit = ref(false)

const user = store.user.user
const userDetail = reactive({
    id: user.account_id,
    username: '',
    name: '',
    roleId: '',
    roleName: '',
    status: '',
    startTime: '',
    endTime: ''
})
const statusName = ref('')
const loading = ref(false)
async function loadData() {
    try {
        loading.value = true
        const res = await api.auth.getUser({id: user.account_id})
        for(let prop in userDetail) {
            userDetail[prop as keyof typeof userDetail] = res[prop]
        }
        statusName.value = STATUS[res.status as STATUSKEY]
    } finally {
        loading.value = false
    }
}
loadData()

const inputRef = ref()
const editName = () => {
    isEdit.value = true
    nextTick(() => {
        inputRef.value.focus()
    })
}
const onEditName = async () => {
    if(userDetail.name.trim().length > 0) {
        try {
            loading.value = true
            await api.auth.editUser(userDetail)
        } finally {
            loading.value = false
        }
    }
    isEdit.value = false
}
</script>

<style lang="less" scoped>
.personal {
    padding: 24px;
    & > div {
        margin-bottom: 16px;
        display: flex;
        align-items: center;
    }
}
.label {
    width: 70px;
    margin-right: 8px;
    text-align: right
}
</style>