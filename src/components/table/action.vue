<template>
    <template v-for="key in Object.keys(scope.column.actions) " :key="key">
      <template v-if="hasPermission(key, scope.record)">
        <!-- 删除列 -->
        <a-popconfirm v-if="key === '删除'" 
          title="你确定要删除吗？" ok-text="是" cancel-text="否"
          @confirm="onConfirmDelete(scope, key)">
          <a class="text-blue mr-2">删除</a>
        </a-popconfirm>
        <!-- 编辑删除查看 -->
        <a v-else class="text-blue mr-2"
          @click="scope.column.actions[key](scope.record)">
          {{ key }}
        </a>
      </template>
    </template>
</template>

<script setup lang="ts">
const props = defineProps(['scope', 'isOnlyCreator'])
const emits = defineEmits(['delete'])
/**
 * 判断用户是否有某个操作的权限，目前只检查’删除‘、’编辑‘
 * 1. 是否配置了该页面的操作权限
 * 2. 是否只允许自己操作
 */
const hasPermission = (action: any, data: any) => {
  const userStore = store.user
  let permission = userStore.hasPermission(action)

  if(props.isOnlyCreator && (['编辑', '删除'].includes(action))) {
    const isOwner = data.creator === userStore.user.nickname
    permission = permission && isOwner
  }
  
  return permission
}

const onConfirmDelete = async (scope: any, key: string) => {
  const handler = scope.column.actions[key]
  await handler(scope.record)
  message.info('删除成功')
  emits('delete')
}
</script>