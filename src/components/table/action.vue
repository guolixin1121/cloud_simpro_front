<template>
    <template v-for="key in Object.keys(scope.column.actions) " :key="key">
      <template v-if="hasPermission(key, scope.record)">
        <!-- 删除列 -->
        <a-popconfirm v-if="key === '删除'" 
          title="你确定要删除吗？" ok-text="是" cancel-text="否"
          @confirm="scope.column.actions[key](scope)">
          <a class="text-blue-500">删除</a>
        </a-popconfirm>
        <!-- 编辑删除查看 -->
        <a v-else class="text-blue-500"
          @click="scope.column.actions[key](scope)">
          {{ key }}
        </a>
        <a-divider type="vertical" />
      </template>
    </template>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user';

const props = defineProps(['scope', 'isOnlyCreator'])

/**
 * 判断用户是否有某个操作的权限，目前只检查’删除‘、’编辑‘
 * 1. 是否配置了该页面的操作权限
 * 2. 是否只允许自己操作
 */
 const userStore = useUserStore()
const hasPermission = (action: any, data: any) => {
  let permission = userStore.hasPermission(action)

  if(props.isOnlyCreator && (['编辑', '删除'].includes(action))) {
    const isOwner = data.creator === userStore.user.username
    permission = permission && isOwner
  }
  
  return permission
}
</script>