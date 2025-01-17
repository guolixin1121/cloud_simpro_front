export const generateRouteFromViews = () => {
  const routes = []
  // views子目录下的.vue文件自动生成路由。index.vue为列表页，其他页路径上包含参数id
  const modules = import.meta.glob('../views/**/*.vue')
  for (const filePath in modules) {
    // 判断是否为组件页面
    const isComponents = filePath.indexOf('components') > -1
    // 判断是否为独立页面
    const isSingle = filePath.indexOf('login') > -1 || filePath.indexOf('404') > -1
    // 普通页面
    if (!isSingle && !isComponents) {
      let path = filePath.replace('../views', '').replace('.vue', '')
      path = path.indexOf('/index') > -1 ? path.replace('index', '') : path + '/:id?'
      routes.push({
        path: path,
        name: path,
        component: modules[filePath]
      })
    }
  }
  console.log(routes)
  return routes
}

export const generateRouteFromDemos = () => {
  const routes = []
  // components下demo.vue自动生成路由: demo/xxx
  const modules = import.meta.glob('../components/**/demo.vue')
  for (const filePath in modules) {
    if (filePath.indexOf('login') == -1) {
      const path = filePath.replace('../components', '').replace('/demo', '').replace('.vue', '')
      routes.push({
        path: '/demo' + path,
        name: path,
        component: modules[filePath]
      })
    }
  }
  return routes
}
