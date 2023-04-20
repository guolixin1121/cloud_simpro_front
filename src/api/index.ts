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
  getSceneSets: { url: '/scene/scenesets/', method: 'get' }
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
})()

// export default {
//   userApi: useSceneApi()
// }
