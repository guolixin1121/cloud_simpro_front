<!-- 封装了操作列：有操作权限时才展示操作按钮 -->
<template>
  <a-table 
    :dataSource="dataSource"
    :columns="columns"
    :rowSelection="isSelectable ? {
      selectedRowKeys: selectedRowKeys,
      onChange: onSelectChange
    } : null ">
    <template v-slot:[item]="scope" v-for="item in Object.keys(slots)">
        <slot v-if="item !== 'bodyCell'" :name="item" :scope="scope" v-bind="scope || {}"></slot>

        <slot v-else :name="item" :scope="scope" v-bind="scope || {}" >
          <template v-if="scope.column.key == 'actions'">
            <template v-for="key in Object.keys(scope.column.actions) " :key="key">
              <template v-if="hasPermission(key)">
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
  </a-table>
</template>

<script setup lang="ts">
import { ref, useSlots } from 'vue'
import { useUserStore } from '@/store/user';

defineProps({
  dataSource: {
    type: Object,
    required: true
  },
  columns: {
    type: Object,
    required: true
  },
  isSelectable: {
    type: Boolean,
    default: () => true
  }
})
const emits = defineEmits(['onSelect'])
const ActionMap = {
  view: '查看',
  edit: '编辑',
  delete: '删除'
}

const user = useUserStore()
const slots = useSlots()

const selectedRowKeys = ref<string[]>([])
const onSelectChange = (selectedKeys: string[]) => {
  selectedRowKeys.value = selectedKeys
  emits('onSelect', selectedKeys)
}

const hasPermission = (action: any) => {
  return action == 'view' ? true : user.hasPermission(action)
}
</script>