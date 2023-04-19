
// tree item for transfer control
interface TreeDataItem {
  key: string;
  title: string;
  disabled?: boolean;
  children?: TreeDataItem[];

  [key: string]: any;
}


interface Props {
  /** 树数据 */
  treeData: TreeDataItem[];
  /** 编辑 key */
  editKey: string[];
}

interface TreeTransferState {
  /** 显示在右侧框数据的 key 集合 */
  targetKeys: string[];
  /** 数据源，其中的数据将会被渲染到左边一栏 */
  dataSource: TreeDataItem[];
  /** 左侧树选中 key 集合 */
  leftCheckedKey: string[];
  /** 左侧半选集合 */
  leftHalfCheckedKeys: string[];
  /** 左侧树选中的 key 集合，包括半选与全选 */
  leftCheckedAllKey: string[];
  /** 左侧树 */
  leftTreeData: TreeDataItem[];
  /** 右侧树选中集合 */
  rightCheckedKey: string[];
  /** 右侧树选中集合，包括半选与全选 */
  rightCheckedAllKey: string[];
  /** 右侧展开数集合 */
  rightExpandedKey: string[];
  /** 右侧树 */
  rightTreeData: TreeDataItem[];
  /** 往父级组件传递的数据 */
  emitKeys: string[];
  /** 深层列表 */
  deepList: string[];
}

interface UseTreeTransfer {
  state: TreeTransferState;
  /** 穿梭更改 */
  onChange: (targetKeys: string[], direction: string) => void;
  /** 全选 */
  onSelectChange: (sourceKeys: string[], targetKeys: string[]) => void;
  /** 左侧选择 */
  handleLeftChecked: (_: string[], { node, halfCheckedKeys }: any, checkedKeys: any, itemSelect: (arg0: any, arg1: boolean) => void) => void;
  /** 右侧选择 */
  handleRightChecked: (_: string[], { node, halfCheckedKeys }: any, checkedKeys: any, itemSelect: (arg0: any, arg1: boolean) => void) => void;
}
