export const SceneSourceOptions = [
  { label: '全部', value: '' },
  { label: '编辑', value: 0 },
  { label: '泛化', value: 1 },
  { label: '导入', value: 2 }
]

export const getSceneSourceName = (value: number | string) => SceneSourceOptions.find(v => v.value === value)?.label

export const TaskSourceOptions = [
  { label: '全部', value: '' },
  { label: '云平台', value: 0 },
  { label: 'SOTIF', value: 1 },
  { label: 'CICD', value: 2 },
]

export const getTaskSourceName = (value: number | string) => TaskSourceOptions.find(v => v.value === value)?.label

// 地图管理数据
export const MapManageSourceOptions = [
  { label: '全部', value: '' },
  { label: '内置', value: 0 },
  { label: '真实', value: 1 },
  { label: '虚拟', value: 2 }
]

export const KpiTypeOptions = [
  { label: '全部', value: '' },
  { label: '安全性', value: 0 },
  { label: '舒适性', value: 1 },
  { label: '交通法规符合性', value: 2 }
]

export const getKpiTypeName = (value: number | string) => KpiTypeOptions.find(v => v.value === value)?.label

