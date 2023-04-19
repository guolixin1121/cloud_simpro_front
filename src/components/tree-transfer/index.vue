<template>
  <a-transfer
    :data-source="state.dataSource"
    :target-keys="state.targetKeys"
    :render="(item: any) => item.title"
    :show-select-all="false"
    @change="onChange"
  >
    <template #children="{ direction, selectedKeys, onItemSelect }">
      <template v-if="direction==='left'">
        <a-tree
          blockNode
          checkable
          :tree-data="state.leftTreeData"
          :checked-keys="state.leftCheckedKey"
          @check="(_: string[], props: any) => { handleLeftChecked(_, props, [...selectedKeys, ...state.targetKeys], onItemSelect) }"
        />
      </template>
      <template v-else-if="direction==='right'">
        <a-tree
          blockNode
          checkable
          defaultExpandAll
          :tree-data="state.rightTreeData"
          v-model:checked-keys="state.rightCheckedKey"
          v-model:expanded-keys="state.rightExpandedKey"
          @check="(_: string[], props: any) => { handleRightChecked(_, props, [...selectedKeys, ...state.targetKeys], onItemSelect) }"
        />
      </template>
    </template>
  </a-transfer>
</template>

<script setup lang="ts">
import { useTreeTransfer } from '@/hooks/use-tree-transfer'

const props = defineProps({
  treeData: {
      type: Array as PropType<TreeDataItem[]>,
      default: () => []
    },
    /** 编辑 key */
    editKey: {
      type: Array as PropType<string[]>,
      default: () => []
    }
})

const { state, onChange, handleLeftChecked, handleRightChecked } = useTreeTransfer(props)
</script>

<style scoped lang="less">
.ant-transfer {
  ::v-deep(.ant-transfer-list) {
    width: 300px;
  }
}
</style>
