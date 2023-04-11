// 左侧菜单权限
declare type Permission = {
  title: string,
  path: string,
  icon: string,
  children?: Permission[],
  actions?: DataAction[]
}
// 数据的操作权限
type DataAction = 'add' | 'delete' | 'edit'

// 列表搜索项
interface SearchFormItem {
  label: string,  // display label
  key: string,   // data prop
  type: string,  // ant design type
  width?: string,
  default?: string, // default value
  options?: { label: string, value: string}[], // when type == select
  placeholder?: string
}
