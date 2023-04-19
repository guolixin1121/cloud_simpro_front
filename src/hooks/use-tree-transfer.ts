import { onMounted, reactive, watch } from 'vue'
import {
  cloneDeep,
  flatten,
  getDeepList,
  getTreeKeys,
  handleLeftTreeData,
  handleRightTreeData,
  isChecked,
  uniqueTree
} from '@/utils/tree-transfer'

export function useTreeTransfer (props: Props): UseTreeTransfer {
  const state = reactive<TreeTransferState>({
    targetKeys: [],
    dataSource: [],
    leftCheckedKey: [],
    leftHalfCheckedKeys: [],
    leftCheckedAllKey: [],
    leftTreeData: [],
    rightCheckedKey: [],
    rightCheckedAllKey: [],
    rightExpandedKey: [],
    rightTreeData: [],
    emitKeys: [],
    deepList: []
  })

  watch(props, () => {
    processEditData()
  })

  onMounted(() => {
    processTreeData()
  })

  /** 处理树数据 */
  function processTreeData (): void {
    flatten(cloneDeep(props.treeData), state.dataSource)
    if (props.editKey.length) {
      processEditData()
    } else {
      state.leftTreeData = handleLeftTreeData(cloneDeep(props.treeData), state.leftCheckedKey)
    }
  }

  /** 处理编辑数据 */
  function processEditData (): void {
    state.leftCheckedAllKey = props.editKey
    state.rightExpandedKey = props.editKey
    state.targetKeys = props.editKey
    state.rightTreeData = handleRightTreeData(cloneDeep(props.treeData), props.editKey)

    getDeepList(state.deepList, props.treeData)

    state.leftCheckedKey = uniqueTree(props.editKey, state.deepList)
    state.leftHalfCheckedKeys = state.leftCheckedAllKey.filter(item => state.leftCheckedKey.indexOf(item) === -1)
    state.leftTreeData = handleLeftTreeData(cloneDeep(props.treeData), state.leftCheckedKey)

    state.emitKeys = state.rightExpandedKey
  }

  /** 穿梭更改 */
  function onChange (targetKeys: string[], direction: string) {
    if (direction === 'right') {
      state.targetKeys = state.leftCheckedAllKey
      state.rightCheckedKey = []
      state.rightTreeData = handleRightTreeData(cloneDeep(props.treeData), state.leftCheckedAllKey, 'right')
      state.leftTreeData = handleLeftTreeData(cloneDeep(props.treeData), state.leftCheckedKey, 'right')
    } else if (direction === 'left') {
      state.rightTreeData = handleRightTreeData(state.rightTreeData, state.rightCheckedKey, 'left')
      state.leftTreeData = handleLeftTreeData(state.leftTreeData, state.rightCheckedKey, 'left')
      state.leftCheckedKey = state.leftCheckedKey.filter(item => state.rightCheckedKey.indexOf(item) === -1)
      state.targetKeys = state.targetKeys.filter(item => state.rightCheckedKey.indexOf(item) === -1)
      state.leftHalfCheckedKeys = state.leftHalfCheckedKeys.filter(item => state.rightCheckedKey.indexOf(item) === -1)
      state.rightCheckedKey = []
    }
    state.rightExpandedKey = getTreeKeys(state.rightTreeData)
    state.emitKeys = state.rightExpandedKey
  }

  function onSelectChange (sourceSelectedKeys: string[], targetSelectedKeys: string[]) {
    console.log(sourceSelectedKeys, targetSelectedKeys)
  }

  /** 左侧选择 */
  function handleLeftChecked (_: string[], { node, halfCheckedKeys }: any, checkedKeys: any, itemSelect: (arg0: any, arg1: boolean) => void): void {
    state.leftCheckedKey = _
    state.leftHalfCheckedKeys = [...new Set([...state.leftHalfCheckedKeys, ...halfCheckedKeys])]
    state.leftCheckedAllKey = [...new Set([...state.leftHalfCheckedKeys, ...halfCheckedKeys, ..._])]
    const { eventKey } = node
    itemSelect(eventKey, !isChecked(checkedKeys, eventKey))
  }

  /** 右侧选择 */
  function handleRightChecked (_: string[], { node, halfCheckedKeys }: any, checkedKeys: any, itemSelect: (arg0: any, arg1: boolean) => void): void {
    state.rightCheckedKey = _
    state.rightCheckedAllKey = [...halfCheckedKeys, ..._]
    const { eventKey } = node
    itemSelect(eventKey, isChecked(_, eventKey))
  }

  return {
    state,

    onChange,
    onSelectChange,
    handleLeftChecked,
    handleRightChecked
  }
}
