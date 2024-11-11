// 表格操作列权限的对应关系，用于权限查询
// key：按钮文案
// value：权限系统里的值
export const Operations = {
  新增: 'add',
  编辑: 'edit',
  删除: 'delete',
  查看: 'view',
  查看结果: 'view',
  仿真结果: 'view',
  编辑地图: 'editXodr',
  编辑场景: 'editXosc',
  运行: 'run',
  停止: 'stop',
  另存为: 'saveAs',
  申请授权: 'apply',
  泛化: 'generalize',
  泛化结果: 'generalize',
  审批: 'approve',
  复制: 'copy'
}

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
  { label: 'CICD', value: 2 }
]

export const getTaskSourceName = (value: number | string) => TaskSourceOptions.find(v => v.value === value)?.label

// 地图管理数据
export const MapManageSourceOptions = [
  { label: '内置', value: 0 },
  { label: '真实', value: 1 },
  { label: '虚拟', value: 2 }
]
export const getMapManageSourceOptions = (value: number | string) => MapManageSourceOptions.find(v => v.value == value)?.label

export const KpiTypeOptions = [
  { label: '安全性', value: 0 },
  { label: '舒适性', value: 1 },
  { label: '交通法规符合性', value: 2 }
]

export const getKpiTypeName = (value: number | string) => KpiTypeOptions.find(v => v.value === value)?.label

export const IsTag = [
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
  { label: '创建', value: 2 }
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
  { label: '全部', value: '' },
  { label: '等待', value: 1 },
  { label: '运行', value: 2 },
  { label: '结束', value: 3 },
  { label: '异常', value: 4 },
  { label: '取消', value: 5 }
]

export const getResultStatus = (value: number | string) => resultStatus.find(v => v.value === value)?.label

export const simproSceneResults = [
  { label: '未通过', value: 0 },
  { label: '通过', value: 1 },
  { label: '跳过', value: 2 },
  { label: '未激活', value: 3 }
]

export const getSimproSceneResults = (value: number | string) => simproSceneResults.find(v => v.value == value)?.label

export const SotifStatusOptions = [
  { label: '全部', value: '' },
  { label: '暂停', value: '1' },
  { label: '进行中', value: '2' },
  { label: '已结束', value: '3' },
]
export const getSotifStatus = (value: number | string) => SotifStatusOptions.find(v => v.value == value)?.label

export const VerticalOptions = [
  { label: '预期纵向加速度', value: 0 },
  { label: '油门开度+制动主缸压力', value: 1 },
  { label: '驱动扭矩+预期制动减速度', value: 2 },
  { label: '剩余停车距离+最大允许车速+制动类型+档位', value: 3 }
]

export const getVerticalOptions = (value: number | string) => VerticalOptions.find(v => v.value == value)?.label

export const HorizontalOptions = [
  { label: '方向盘转角', value: 0 },
  { label: '方向盘扭矩', value: 1 }
]

export const getHorizontalOptions = (value: number | string) => HorizontalOptions.find(v => v.value == value)?.label

export const LogicSceneStatusOption = [
  { label: '泛化中', value: 0 },
  { label: '泛化中', value: 1 },
  { label: '上传中', value: 2 },
  { label: '泛化失败', value: 3 },
  { label: '上传成功', value: 4 },
  { label: '上传失败', value: 5 }
]

export const getLogicSceneStatusOption = (value: number | string) => LogicSceneStatusOption.find(v => v.value == value)?.label

// 我的场景的来源
export const MyScenesetSourceOptions = [
  { label: '全部', value: '' },
  { label: '创建', value: 0 },
  { label: '场景资源库', value: 1 },
  { label: 'SOTIF', value: 2 },
  { label: '语义生成', value: 3 },
]
// 是否是内置场景集
export const isDefaultMySceneset = ({source} : any) => source === 3
export const isMyScenesetEditable = ({ source }: any) => source != 1 && source != 3 // && (groupName ? groupName != '赛目大模型场景集' : name != '赛目大模型场景集')
export const getMyScenesetSourceName = (value: number | string) => MyScenesetSourceOptions.find(v => v.value === value)?.label

export const MySceneSourceOptions = [
  { label: '全部', value: '' },
  { label: '创建', value: 0 },
  { label: '泛化', value: 1 },
  // { label: '场景挖掘', value: 4 },
  { label: '场景资源库', value: 3 },
  { label: '语义生成', value: 5 },
]
export const isMySceneEditable = (value: number | string) => value != 3
export const getMySceneSourceName = (value: number | string) => MySceneSourceOptions.find(v => v.value === value)?.label

export const MyLogicScenesetSourceOptions = [
  { label: '全部', value: '' },
  { label: '创建', value: 0 },
  { label: 'SOTIF', value: 1 },
  { label: '场景资源库', value: 2 }
]
export const isDefaultMyLogicSceneset = ({source} : any) => source === 1
export const isMyLogicScenesetEditable = (value: number | string) => value == 0
export const getMyLogicScenesetSourceName = (value: number | string) => MyLogicScenesetSourceOptions.find(v => v.value === value)?.label

export const MyLogicSceneSourceOptions = [
  { label: '全部', value: '' },
  { label: '创建', value: 0 },
  { label: 'SOTIF', value: 1 },
  { label: '场景资源库', value: 2 },
]
export const isMyLogicSceneEditable = (value: number | string) => value != 2
export const getMyLogicSceneSourceName = (value: number | string) => MyLogicSceneSourceOptions.find(v => v.value === value)?.label


// 申请授权状态
export const ApplyStatusOptions = [
  { label: '全部', value: '' },
  { label: '待审批', value: 1 },
  { label: '已通过', value: 2 },
  { label: '已拒绝', value: 3 }
]
export const getApplyStatus = (value: number | string) => ApplyStatusOptions.find(v => v.value == value)?.label