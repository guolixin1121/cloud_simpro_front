// list页面使用，需要自己提供‘全部’选项
export const SceneSourceOptions = [
  // { label: '全部', value: '' },
  { label: '编辑', value: 0 },
  { label: '泛化', value: 1 },
  { label: '导入', value: 2 }
]

export const getSceneSourceName = (value: number | string) => SceneSourceOptions.find(v => v.value === value)?.label

export const TaskSourceOptions = [
  { label: '全部', value: '' },
  { label: '云平台', value: 0 },
  { label: 'SOTIF', value: 1 },
  { label: 'CICD', value: 2 }
]

export const getTaskSourceName = (value: number | string) => TaskSourceOptions.find(v => v.value === value)?.label

// 地图管理数据
export const MapManageSourceOptions = [
  // { label: '全部', value: '' },
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

export const IsTag = [
  { label: '全部', value: '' },
  { label: '是', value: 1 },
  { label: '否', value: 0 }
]
// export const TagType: any = {
//   '0': '数据标签',
//   '1': '数据集标签',
//   '2': '场景集标签',
//   '3': '场景标签',
//   '4': '地图标签',
//   '5': 'case标签'
// }
// 车辆模型数
export const typeList = [
  { label: '全部', value: '' },
  { label: '导入', value: 1 },
  { label: '新建', value: 2 }
]

export const sensorType = [
  { label: '全部', value: '' },
  { label: '激光雷达', value: 1 },
  { label: '毫米波雷达', value: 2 },
  { label: '超声波雷达', value: 3 },
  { label: '摄像机', value: 4 }
]

// 仿真结果状态
export const resultStatus = [
  { label: '', value: 0 },
  { label: '等待', value: 1 },
  { label: '运行', value: 2 },
  { label: '结束', value: 3 },
  { label: '异常', value: 4 },
  { label: '取消', value: 5 }
]

export const getResultStatus = (value: number | string) => resultStatus.find(v => v.value === value)?.label

// list页面使用，需要自己提供‘全部’选项
export const SotifStatusOptions = [
  // { label: '全部', value: '' },
  { label: '暂停', value: '1' },
  { label: '进行中', value: '2' },
  { label: '已结束', value: '3' },
]
export const getSotifStatus = (value: number | string) => SotifStatusOptions.find(v => v.value == value)?.label

export const VerticalOptions = [
  { label: '预期纵向加速度', value: 1 },
  { label: '油门开度+制动主缸压力', value: 2 },
  { label: '驱动扭矩+预期制动减速度', value: 3 },
  { label: '剩余停车距离+最大允许车速+制动类型+档位', value: 4 }
]

export const getVerticalOptions = (value: number | string) => VerticalOptions.find(v => v.value == value)?.label

export const HorizontalOptions = [
  { label: '方向盘转角', value: 1 },
  { label: '方向盘扭矩', value: 2 }
]

export const getHorizontalOptions = (value: number | string) => HorizontalOptions.find(v => v.value == value)?.label

export const LogicSceneStatusOption = [
  { label: '新建', value: 0 },
  { label: '运行', value: 1 },
  { label: '泛化结束上传中', value: 2 },
  { label: '泛化错误', value: 3 },
  { label: '上传结束', value: 4 },
  { label: '上传错误', value: 5 }
]

export const getLogicSceneStatusOption = (value: number | string) => LogicSceneStatusOption.find(v => v.value == value)?.label
