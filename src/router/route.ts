export const generateRouteFromViews = () => {
  const routes = []
  // views子目录的根目录下vue文件自动生成路由
  const views = import.meta.glob('../views/*/*.vue')
  for(const filePath in views) {
    let path = filePath.replace('../views', '').replace('.vue', '')
    path = path.indexOf('/index') > -1 ? path.replace('index', '') : ( path + '/:id')
    routes.push({
      path: path,
      name: path,
      component: async () =>
        await import(/* @vite-ignore */filePath)
    })
  }
  console.log(routes)
  return routes
}