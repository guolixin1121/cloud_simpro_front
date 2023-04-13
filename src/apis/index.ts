/**
 * 已通过vite的auto import自动导入，使用时通过变量‘apis’就可以直接访问
 * demo：apis.user
 * note: 使用defineApi定义接口时注意末尾的函数调用
 */

export const table = defineApi({
  getList: '/scene/scene/'
})() // 注意末尾的括号

export const user = defineApi({
  login: { url: '/auth/login/', method: 'post' },
  getLoginUser: '/auth/user_info/',
  getPermissions: '/menus/',
  getTopMenu: 'menus/top/'
})()

export const scene = defineApi({
  getList: '/scene/scene/',
})()

export const tags = defineApi({
  getList: '/tags/list/',
})()

// export default {
//   userApi: useSceneApi()
// }
