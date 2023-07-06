// 左侧菜单权限
declare type Permission = {
  title: string
  path: string
  icon: string
  children?: Permission[]
  actions?: DataAction[]
}
// 数据的操作权限
type DataAction = 'add' | 'delete' | 'edit'

// 列表搜索项
interface SearchFormItem {
  // search-form 属性
  label: string // display label
  key: string // data prop，与v-model对应
  type: string // ant design组件名称 a-xx
  defaultValue?: any

  // ant design 组件原有属性
  [key: string]: any // 支持和antd组件一样的属性
}

interface SelectOption {
  label: string
  value?: string | number
}

// 自定义字段
interface FieldNames {
  label: string
  value: string
  apiField?: string  // api返回的字段，默认为results
}

type Query = Record<string, any>

interface RObject {
  id: string,
  [key: string]: any
}

// 自定义字段
interface FieldName {
  label: string
  value: string
}
interface TreeItem {
  title: string
  value: string
  key?: string
  children?: TreeItem[]
}
