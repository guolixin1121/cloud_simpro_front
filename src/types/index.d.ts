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
