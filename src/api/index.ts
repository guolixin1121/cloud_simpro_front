/**
 * 已通过vite的auto import自动导入，使用时通过变量‘apis’就可以直接访问
 * demo：api.user
 * note: 使用defineApi定义接口时注意末尾的函数调用
 */

export const auth = defineApi({
  clue: {url: '/cloud-pro/clue/report', method: 'post'},
  logout: {url: '/cloud-pro/auth/logout', method: 'post'},
  getIdentities: {url: '/cloud-pro/user/identities', method: 'post'},
  getUser: {url: '/cloud-pro/cloud-pro-management/management/user/detail', method: 'get'},
  editUser: {url: '/cloud-pro/cloud-pro-management/management/user/editUserName', method: 'post'},
  changePassword: {url: '/cloud-pro/cloud-pro-management/management/user/edit/password', method: 'post'},
})()

export const user = defineApi({
  project: { url: '/auth/user/project/', method: 'get' },
  login: { url: '/auth/login/', method: 'post' },
  logout: { url: '/auth/logout/', method: 'post' },
  getLoginUser: { url: '/auth/user_info/', method: 'get' },
  getPermissions: { url: '/menus/', method: 'get' },
  getTopMenu: { url: 'menus/top/', method: 'get' },
  getToken: { url: '/auth/token/', method: 'get' }
})()

export const scenesets = defineApi({
  getListV2: { url: '/scene/v2/scenesets/', method: 'get'},
  getList: { url: '/scene/scenesets/', method: 'get' },
  get: { url: '/scene/scenesets/{sid}', method: 'get' },
  delete: { url: '/scene/scenesets/{sid}/', method: 'delete' },
  batchDelete: { url: '/scene/scenesets/delete/', method: 'delete' },
  edit: { url: '/scene/scenesets/{sid}/', method: 'put' },
  add: { url: '/scene/scenesets/', method: 'post' },
  clone: { url: '/scene/scenesets/copy/', method: 'post' },
})()

export const logicScenesets = defineApi({
  getList: { url: '/simpro/logic_scene_sets/', method: 'get' },
  get: { url: '/simpro/logic_scene_sets/{sid}', method: 'get' },
  delete: { url: '/simpro/logic_scene_sets/delete/', method: 'delete' },
  edit: { url: '/simpro/logic_scene_sets/{sid}/', method: 'put' },
  add: { url: '/simpro/logic_scene_sets/', method: 'post' },
  clone: { url: '/simpro/logic_scene_sets/copy/', method: 'post' }
})()

export const scene = defineApi({
  getScenesetList: { url: '/scene/v2/scenesets/', method: 'get'},
  getList: { url: '/scene/scenes/', method: 'get' },
  get: { url: '/scene/scenes/{sid}/', method: 'get' },
  delete: { url: '/scene/scenes/{sid}/', method: 'delete' },
  clone: { url: '/scene/scenes/copy/', method: 'post' },
  batchDelete: { url: '/scene/scenes/delete/', method: 'delete' },
  edit: {
    url: '/scene/scenes/{sid}/',
    method: 'put',
    headers: { 'content-type': 'multipart/form-data' }
  },
  add: {
    url: '/scene/scenes/',
    method: 'post',
    headers: { 'content-type': 'multipart/form-data' }
  }
})()

export const logicScene = defineApi({
  getCatalog: { url: '/simpro/logic_scenes/catalog/', method: 'get'},
  getList: { url: '/simpro/logic_scenes/', method: 'get' },
  get: { url: '/simpro/logic_scenes/{sid}/', method: 'get' },
  delete: { url: '/simpro/logic_scenes/{sid}/', method: 'delete' },
  clone: { url: '/simpro/logic_scenes/copy/', method: 'post' },
  batchDelete: { url: '/simpro/logic_scenes/batch/delete/', method: 'post' },
  edit: {
    url: '/simpro/logic_scenes/{sid}/',
    method: 'put'
  },
  add: {
    url: '/simpro/logic_scenes/',
    method: 'post',
    headers: { 'content-type': 'multipart/form-data' }
  },
  run: {
    url: '/simpro/generalize/task/',
    method: 'post'
  },
  getResultList: {
    url: '/simpro/generalize/task/',
    method: 'get'
  }
})()

export const tags = defineApi({
  getList: { url: '/tags/', method: 'get' },
  getType: { url: '/tags/type/', method: 'get' },
  delete: { url: '/tags/{sid}/', method: 'delete' },
  edit: { url: '/tags/{sid}/', method: 'put' },
  add: { url: '/tags/', method: 'post' },
  get: { url: '/tags/{sid}/', method: 'get' }
})()

// 地图管理接口
export const maps = defineApi({
  getMaps: { url: '/baidu_map/map/', method: 'get' },
  getMapCatalog: { url: '/baidu_map/catalog/', method: 'get' },
  deleteMaps: { url: '/baidu_map/map/{sid}', method: 'delete' },
  batchDeleteMaps: { url: '/baidu_map/map/delete/', method: 'delete' },
  getMapVersion: { url: '/baidu_map/map_version/', method: 'get' },
  addMaps: { url: '/baidu_map/map/', method: 'post', headers: { 'content-type': 'multipart/form-data' } },
  editMaps: { url: '/baidu_map/map/{sid}/', method: 'put', headers: { 'content-type': 'multipart/form-data' } },
  lookMaps: { url: '/baidu_map/map/{sid}/', method: 'get' },
  getMap: { url: '/baidu_map/map/{sid}/', method: 'get' },
  lookMapVersion: { url: '/baidu_map/map_version/{id}/', method: 'get' },
  deleteMapVersion: { url: '/baidu_map/map_version/{id}/', method: 'delete' },
  editMapVersion: { url: '/baidu_map/map_version/{id}/', method: 'put', headers: { 'content-type': 'multipart/form-data' } }
})()

export const mapsets = defineApi({
  getList: { url: '/baidu_map/catalog/', method: 'get' },
  get: { url: '/baidu_map/catalog/{id}/', method: 'get' },
  delete: { url: '/baidu_map/catalog/{id}', method: 'delete' },
  edit: { url: '/baidu_map/catalog/{id}/', method: 'put' },
  add: { url: '/baidu_map/catalog/', method: 'post' }
})()

export const task = defineApi({
  getList: { url: '/simpro/simtask/template/', method: 'get' },
  get: { url: '/simpro/simtask/template/{sid}/', method: 'get' },
  delete: { url: '/simpro/simtask/template/{sid}/', method: 'delete' },
  batchDelete: { url: '/simpro/simtask/template/delete/', method: 'delete' },
  edit: { url: '/simpro/simtask/template/{sid}/', method: 'put' },
  add: { url: '/simpro/simtask/template/', method: 'post' },
  run: { url: '/simpro/simtask/run/', method: 'post' },
  cancel: { url: '/simpro/simtask/cancel/', method: 'post' },
})()

export const result = defineApi({
  getList: { url: '/simpro/simtask/', method: 'get' },
  getScenes: { url: '/simpro/simtask/result/', method: 'get' },
  delete: { url: '/simpro/simtask/{sid}/', method: 'delete' },
  batchDelete: { url: '/simpro/simtask/delete/', method: 'delete' },
})()

export const vnc = defineApi({
  getList: { url: '/vnc/list/', method: 'get' },
  enterVnc: { url: '/vnc/enter/', method: 'post' }, // 申请vnc
  exitVnc: { url: '/vnc/exit/', method: 'post' }, // 退出vnc
  checkVnc: { url: '/vnc/{vnc_id}/', method: 'get' }, // 进入vnc
  quitVnc: { url: '/vnc/{vnc_id}/', method: 'delete' }, // 退出vnc
})()

export const sotif = defineApi({
  getList: { url: '/stats/sotif/projects/', method: 'post' }, // SOTIF项目列表
  getManagers: { url: '/stats/sotif/managers/', method: 'get' }, // 负责人列表
  getStpaList: { url: 'stats/sotif/stpa/projects/', method: 'post' }, // SOTIF项目列表
  getStpaManagers: { url: '/stats/sotif/stpa/managers/', method: 'get' } // 负责人列表
})()

export const algorithm = defineApi({
  getList: { url: '/alg/algorithm/', method: 'get' },
  get: { url: '/alg/algorithm/{sid}/', method: 'get' },
  delete: { url: '/alg/algorithm/{sid}/', method: 'delete' },
  batchDelete: { url: '/alg/algorithm/delete/', method: 'delete' },
  edit: { url: '/alg/algorithm/{sid}/', method: 'put' },
  add: { url: '/alg/algorithm/', method: 'post' },
})()

export const vehicle = defineApi({
  getList: { url: '/vehicle/dynamic_vehicle/', method: 'get' },
  getDrivers: { url: '/vehicle/drivers/', method: 'get' }
})()

export const kpi = defineApi({
  getList: { url: '/simpro/kpi/custom/', method: 'get' },
  getTypes: { url: '/simpro/kpi/type/', method: 'get' },
  get: { url: '/simpro/kpi/{sid}/', method: 'get' },
  delete: { url: '/simpro/kpi/{sid}/', method: 'delete' },
  batchDelete: { url: '/simpro/kpi/delete/', method: 'delete' },
  edit: {
    url: '/simpro/kpi/{sid}/',
    method: 'put',
    headers: { 'content-type': 'multipart/form-data' }
  },
  add: {
    url: '/simpro/kpi/custom/',
    method: 'post',
    headers: { 'content-type': 'multipart/form-data' }
  }
})()
// 车辆动力学
export const veticleModel = defineApi({
  getTurnModel: { url: '/vehicle/checkbox/', method: 'get' },
  getList: { url: '/vehicle/dynamic_model/', method: 'get' },
  getVersions: { url: '/vehicle/dynamic_model/version/', method: 'get' },
  addVersion: { url: '/vehicle/dynamic_model/version/', method: 'post' },
  deleteVersion: { url: '/vehicle/dynamic_vehicle/{sid}', method: 'delete' },
  edit: { url: '/vehicle/dynamic_vehicle/{sid}', method: 'put' },
  editShare: { url: '/vehicle/dynamic_model/{sid}/', method: 'put' },
  add: { url: '/vehicle/dynamic_vehicle/', method: 'post' },
  upload: { url: '/vehicle/import_vehicle/', method: 'post', headers: { 'content-type': 'multipart/form-data' } },
  delete: { url: '/vehicle/dynamic_model/{sid}', method: 'delete' },
})()
// 传感器
export const sensor = defineApi({
  getList: { url: '/sensor/', method: 'get' },
  get: { url: '/sensor/{sid}', method: 'get' },
  edit: { url: '/sensor/{sid}', method: 'put', headers: { 'content-type': 'multipart/form-data' } },
  add: { url: '/sensor/', method: 'post', headers: { 'content-type': 'multipart/form-data' } },
  delete: { url: '/sensor/{sid}', method: 'delete' }
})()
// 动态库
export const dll = defineApi({
  getList: { url: '/dynamic_lib/', method: 'get' },
  get: { url: '/dynamic_lib/{sid}', method: 'get' },
  edit: { url: '/dynamic_lib/{sid}', method: 'put', headers: { 'content-type': 'multipart/form-data' } },
  add: { url: '/dynamic_lib/', method: 'post', headers: { 'content-type': 'multipart/form-data' } },
  delete: { url: '/dynamic_lib/{sid}', method: 'delete' }
})()

export const overview = defineApi({
  summary: { url: '/stats/simpro/summary/', method: 'get' },
  executions: { url: '/stats/simtask/executions/', method: 'get' },
  runningtime: { url: '/stats/simtask/runningtime/', method: 'get' },
  tasks: { url: '/stats/simtasks/tasks/', method: 'get' },
  reports: { url: '/stats/simresults/reports/', method: 'get' },
  scenes: { url: '/stats/scenes/count/', method: 'get' },
  status: { url: '/stats/simtask/status/', method: 'get' },
  results: { url: '/simpro/simtask/overview/', method: 'get' }
})()

export const sceneResource = defineApi({
  getScenesetListV2: { url: '/resource/v2/concrete/sceneset/', method: 'get' },
  getScenesetList: { url: '/resource/concrete/sceneset/', method: 'get' },
  getSceneset: { url: '/resource/concrete/sceneset/{id}/', method: 'get' },
  deleteSceneset: { url: '/resource/concrete/sceneset/delete/', method: 'delete' },
  editSceneset: { url: '/resource/concrete/sceneset/{id}/', method: 'put' },
  addSceneset: { url: '/resource/concrete/sceneset/', method: 'post' },
  getSceneList: { url: '/resource/concrete/scene/', method: 'get' },
  getScene: { url: '/resource/concrete/scene/{id}/', method: 'get' },
  deleteScene: { url: '/resource/concrete/scene/delete/', method: 'delete' },
  editScene: { url: '/resource/concrete/scene/{id}/', method: 'put', headers: { 'content-type': 'multipart/form-data' }  },
  addScene: { url: '/resource/concrete/scene/', method: 'post', headers: { 'content-type': 'multipart/form-data' }  }
})()
export const loginsceneResource = defineApi({
  getScenesetList: { url: '/resource/logic/sceneset/', method: 'get' },
  getSceneset: { url: '/resource/logic/sceneset/{id}/', method: 'get' },
  deleteSceneset: { url: '/resource/logic/sceneset/delete/', method: 'delete' },
  editSceneset: { url: '/resource/logic/sceneset/{id}/', method: 'put' },
  addSceneset: { url: '/resource/logic/sceneset/', method: 'post' },
  getSceneList: { url: '/resource/logic/scene/', method: 'get' },
  getScene: { url: '/resource/logic/scene/{id}/', method: 'get' },
  deleteScene: { url: '/resource/logic/scene/delete/', method: 'delete' },
  editScene: { url: '/resource/logic/scene/{id}/', method: 'put', headers: { 'content-type': 'multipart/form-data' }  },
  addScene: { url: '/resource/logic/scene/', method: 'post', headers: { 'content-type': 'multipart/form-data' } }
})()
// 授权
export const grant = defineApi({
  getList: { url: '/grant/list/', method: 'get' },
  get: { url: '/grant/detail/', method: 'get' },
  approve: { url: '/grant/approve/', method: 'post' },
  reject: { url: '/grant/reject/', method: 'post' },
  apply: { url: '/grant/apply/', method: 'post' }
})()

export const llm = defineApi({
  audioToText: { url: '/utils/audio_to_text/', method: 'post', headers: { 'content-type': 'multipart/form-data' } },
  generate: { url: '/scene/llm/generate/', method: 'post' },
})()