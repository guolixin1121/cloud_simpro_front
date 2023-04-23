/**
 * 已通过vite的auto import自动导入，使用时通过变量‘apis’就可以直接访问
 * demo：api.user
 * note: 使用defineApi定义接口时注意末尾的函数调用
 */

export const table = defineApi({
  getList: { url: '/scene/scenes/', method: 'get' },
})() // 注意末尾的括号

export const user = defineApi({
  login: { url: '/auth/login/', method: 'post' },
  getLoginUser: { url: '/auth/user_info/', method: 'get' }, 
  getPermissions: { url: '/menus/', method: 'get' }, 
  getTopMenu: { url: 'menus/top/', method: 'get' }, 
})()

export const scenesets = defineApi({
  getSceneSets: { url: '/scene/scenesets/', method: 'get' },
  getSceneSet: { url: '/scene/scenesets/{sid}', method: 'get' },
  deleteSceneset: { url: '/scene/scenesets/{sid}/', method: 'delete' },
  editSceneset: { url: '/scene/scenesets/{sid}/', method: 'put'}, 
  addSceneset: { url: '/scene/scenesets/', method: 'post' }
})()

export const scene = defineApi({
  getScenes: { url: '/scene/scenes/',   method: 'get' }, 
  getScene: { url: '/scene/scenes/{sid}/', method: 'get' }, 
  deleteScene: { url: '/scene/scenes/{sid}/', method: 'delete' },
  editScene: { url: '/scene/scenes/{sid}/', method: 'put', headers: { "content-type": 'multipart/form-data'}  }, 
  addScene: { url: '/scene/scenes/', method: 'post', headers: { "content-type": 'multipart/form-data'} }
})()

export const tags = defineApi({
  getTags: { url: '/tags/', method: 'get' }, 
})()

export const maps = defineApi({
  getMaps: { url: '/baidu_map/map/', method: 'get' }, 
  getMap: { url: '/baidu_map/map/{sid}/', method: 'get' }, 
})()

export const simpro = defineApi({
  getSimproTasks: { url: '/simpro/simtask/',   method: 'get' }, 
  getSimproTask: { url: '/simpro/simtask/{sid}/', method: 'get' }, 
  deleteSimproTask: { url: '/simpro/simtask/{sid}/', method: 'delete' },
  editSimproTask: { url: '/simpro/simtask/{sid}/', method: 'put' }, 
  addSimproTask: { url: '/simpro/simtask/', method: 'post'},

  getSimproResults: { url: '/simpro/simtask_result/',   method: 'get' }, 
  getSimproResult: { url: '/simpro/simtask_result/{sid}/', method: 'get' }, 
  deleteSimproResult: { url: '/simpro/simtask_result/{sid}/', method: 'delete' },
  editSimproResult: { url: '/simpro/simtask_result/{sid}/', method: 'put' }, 
  addSimproResult: { url: '/simpro/simtask_result/', method: 'post'},
})()

export const algorithm = defineApi({
  getAlgorithms: { url: '/alg/algorithm/',   method: 'get' }, 
})()

export const vehicle = defineApi({
  getVehicle: { url: '/vehicle/dynamic_vehicle/',   method: 'get' }, 
})()

export const kpi = defineApi({
  getKpis: { url: '/simpro/kpi/',   method: 'get' }, 
})()
// export default {
//   userApi: useSceneApi()
// }
