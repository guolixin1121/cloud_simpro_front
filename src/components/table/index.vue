<!-- 封装了操作列：有操作权限时才展示操作按钮 -->
<template>
  <a-table 
    v-bind="$attrs"
    v-on="$attrs"
    :loading="loading"
    :dataSource="dataSource"
    :columns="columns"
    :rowSelection="isSelectable ? {
      selectedRowKeys: selectedRowKeys,
      onChange: onSelectChange
    } : null "
    :pagination="pagination"
    @change="onChange">
    <template v-slot:[item] ="scope" v-for="item in Object.keys($slots)">
        <slot v-if="item !== 'bodyCell'" :name="item" :scope="scope" v-bind="scope || {}"></slot>

        <slot v-else :name="item" :scope="scope" v-bind="scope || {}" >
          <template v-if="scope.column.key == 'actions'">
            <template v-for="key in Object.keys(scope.column.actions) " :key="key">
              <template v-if="hasPermission(key, scope.record)">
                <a class="text-blue-500"
                  v-if="key !== 'delete'" 
                  @click="scope.column.actions[key](scope)">
                  {{ ActionMap[key as keyof typeof ActionMap] }}
                </a>
                <a-popconfirm v-else title="你确定要删除吗？" ok-text="是" cancel-text="否"
                  @confirm="scope.column.actions[key](scope)">
                  <a class="text-blue-500">删除</a>
                </a-popconfirm>
                <a-divider type="vertical" />
              </template>
            </template>
          </template>
        </slot>
    </template>
    <!-- 父组件中没有指定bodyCell时使用此模板 -->
    <template #bodyCell="scope">
      <template v-if="scope.column.key == 'actions'">
        <template v-for="key in Object.keys(scope.column.actions) " :key="key">
          <template v-if="hasPermission(key, scope.record)">
            <a class="text-blue-500"
              v-if="key !== 'delete'" 
              @click="scope.column.actions[key](scope)">
              {{ ActionMap[key as keyof typeof ActionMap] }}
            </a>
            <a-popconfirm v-else title="你确定要删除吗？" ok-text="是" cancel-text="否"
              @confirm="scope.column.actions[key](scope)">
              <a class="text-blue-500">删除</a>
            </a-popconfirm>
            <a-divider type="vertical" />
          </template>
        </template>
      </template>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Service, useRequest} from 'vue-request'
import { useUserStore } from '@/store/user';

const ActionMap = {
  view: '查看',
  edit: '编辑',
  delete: '删除'
}

const props = defineProps({
  api: {
    type: Function,
    required: true
  },
  query: {
    type: Object
  },
  columns: {
    type: Array<Object>,
    required: true
  },
  isSelectable: {
    type: Boolean,
    default: () => true
  },
  isOnlyCreator: { // 是否只允许创建者编辑，删除 
    type: Boolean,
    default: () => false
  }
})
const emits = defineEmits(['onSelect', 'onChange'])

const current = ref(1)
const { data, loading, run } = useRequest(props.api as Service<{results: [], count: number}, any>)
const dataSource = computed(() => data.value?.results)
const pagination = computed(() => ({ current: current.value, total: data.value?.count }))

// selection handler
const selectedRowKeys = ref<string[]>([])
const onSelectChange = (selectedKeys: string[]) => {
  selectedRowKeys.value = selectedKeys
  emits('onSelect', selectedKeys)
}

// page event handler
const onChange = (params: any) => current.value = params.current
watch(() => props.query, (newVal) => {
  current.value = 1
  run({...newVal, page: 1})
})
watch(current, (newVal) => {
  run({...props.query, page: newVal})
})

// check action permission
const userStore = useUserStore()
const hasPermission = (action: any, data: any) => {
  let permission = userStore.hasPermission(action)

  if(props.isOnlyCreator && (['edit', 'delete'].includes(action))) {
    const isOwner = data.creator === userStore.user.username
    permission = permission && isOwner
  }
  
  return permission
}
</script>