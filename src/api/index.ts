/**
 * 已通过vite的auto import自动导入，使用时通过变量‘apis’就可以直接访问
 * demo：api.user
 * note: 使用defineApi定义接口时注意末尾的函数调用
 */

export const table = defineApi({
  getList: { url: '/scene/scenes/', method: 'get' }
})() // 注意末尾的括号

export const user = defineApi({
  login: { url: '/auth/login/', method: 'post' },
  getLoginUser: { url: '/auth/user_info/', method: 'get' },
  getPermissions: { url: '/menus/', method: 'get' },
  getTopMenu: { url: 'menus/top/', method: 'get' }
})()

export const scenesets = defineApi({
  getList: { url: '/scene/scenesets/', method: 'get' },
  get: { url: '/scene/scenesets/{sid}', method: 'get' },
  delete: { url: '/scene/scenesets/{sid}/', method: 'delete' },
  edit: { url: '/scene/scenesets/{sid}/', method: 'put' },
  add: { url: '/scene/scenesets/', method: 'post' }
})()

export const scene = defineApi({
  getList: { url: '/scene/scenes/', method: 'get' },
  get: { url: '/scene/scenes/{sid}/', method: 'get' },
  delete: { url: '/scene/scenes/{sid}/', method: 'delete' },
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
  getMapVersion: { url: '/baidu_map/map_version/', method: 'get' },
  addMaps: { url: '/baidu_map/map/', method: 'post', headers: { 'content-type': 'multipart/form-data' } },
  editMaps: { url: '/baidu_map/map/{sid}/', method: 'put', headers: { 'content-type': 'multipart/form-data' } },
  lookMaps: { url: '/baidu_map/map/{sid}/', method: 'get' },
  getMap: { url: '/baidu_map/map/{sid}/', method: 'get' },
  lookMapVersion: { url: '/baidu_map/map_version/{id}/', method: 'get' },
  deleteMapVersion: { url: '/baidu_map/map_version/{id}/', method: 'delete' },
  editMapVersion: { url: '/baidu_map/map_version/{id}/', method: 'put', headers: { 'content-type': 'multipart/form-data' } }
})()

export const task = defineApi({
  getList: { url: '/simpro/simtask/template/', method: 'get' },
  get: { url: '/simpro/simtask/template/{sid}/', method: 'get' },
  delete: { url: '/simpro/simtask/template/{sid}/', method: 'delete' },
  edit: { url: '/simpro/simtask/template/{sid}/', method: 'put' },
  add: { url: '/simpro/simtask/template/', method: 'post' },
  run: { url: '/simpro/simtask/run/', method: 'post' }
})()

export const result = defineApi({
  getList: { url: '/simpro/simtask/', method: 'get' },
  getScenes: { url: '/simpro/simtask/result/', method: 'get' },
  delete: { url: '/simpro/simtask/{sid}/', method: 'delete' }
})()

export const algorithm = defineApi({
  getList: { url: '/alg/algorithm/', method: 'get' }
})()

export const vehicle = defineApi({
  getList: { url: '/vehicle/dynamic_vehicle/', method: 'get' }
})()

export const kpi = defineApi({
  getList: { url: '/simpro/kpi/custom/', method: 'get' },
  getTypes: { url: '/simpro/kpi/type/', method: 'get' },
  get: { url: '/simpro/kpi/{sid}/', method: 'get' },
  delete: { url: '/simpro/kpi/{sid}/', method: 'delete' },
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
  getList: { url: '/vehicle/dynamic_vehicle/', method: 'get' },
  edit: { url: '/vehicle/dynamic_vehicle/{sid}', method: 'put' },
  add: { url: '/vehicle/dynamic_vehicle/', method: 'post' },
  upload: { url: '/vehicle/import_vehicle/', method: 'post', headers: { 'content-type': 'multipart/form-data' } },
  delete: { url: '/vehicle/dynamic_vehicle/{sid}', method: 'delete' }
})()
// 传感器
export const sensor = defineApi({
  getList: { url: '/sensor/', method: 'get' },
  get: { url: '/sensor/{sid}', method: 'get' },
  edit: { url: '/sensor/{sid}', method: 'put', headers: { 'content-type': 'multipart/form-data' } },
  add: { url: '/sensor/', method: 'post', headers: { 'content-type': 'multipart/form-data' } },
  delete: { url: '/sensor/{sid}', method: 'delete' }
})()
