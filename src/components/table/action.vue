<template>
  <template v-for="key in Object.keys(scope.column.actions)" :key="key">
    <template v-if="hasPermission(scope, key)">
      <!-- 删除列 -->
      <a-popconfirm
        v-if="key === '删除'"
        title="你确定要删除吗？"
        ok-text="是"
        cancel-text="否"
        @confirm="onConfirmDelete(scope, key)"
      >
        <a class="text-blue mr-2">删除</a>
      </a-popconfirm>
      <!-- 其他列 -->
      <a v-else class="text-blue mr-2" @click="onHandler(scope, key)">
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
 * 3. 自定义的可见性判断
 * @param scope:
 * @param key: 操作的key值；’编辑‘，’查看‘等
 */
const hasPermission = (scope: RObject, key: string) => {
  const action = scope.column.actions[key]
  const data = scope.record
  // 是否配置了该页面的操作权限
  const userStore = store.user
  let permission = userStore.hasPermission(key as DataAction)

  // 是否只允许自己操作
  if (props.isOnlyCreator && ['编辑', '删除'].includes(key)) {
    const isOwner = data.createUser === userStore.user.username || data.create_user === userStore.user.username
    permission = permission && isOwner
  }

  // 自定义的验证
  if(action.validate) {
    permission = permission && action.validate(data)
  }

  return permission
}
const onHandler = async (scope: RObject, key: string) => {
  const action = scope.column.actions[key]
  const handler = action.handler || action
  await handler(scope.record)
}
const onConfirmDelete = async (scope: any, key: string) => {
  const action = scope.column.actions[key]
  const handler = action.handler || action
  await handler(scope.record)
  message.info('删除成功')
  emits('delete')
}
</script>
