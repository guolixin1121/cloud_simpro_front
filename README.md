# cloud_simpro_front 云仿真

## 分支说明
1. master 开发分支
执行archive生成zip后手动部署
2. production: 生产分支
3. yizhuang_dev 亦庄分支  
在独立的git上   
```
git remote add yizhuang http://10.9.0.167:22080/cloud-simpro1/cloud_simpro_front   
账号: cloud-simpro    
密码: Da*hF4ig
```
代码推到此git后，代码自动打包
```
1. 更改jenkinfile里的版本号
2. 提交代码：git push yizhuang yizhuang_dev  
```

## 自动import
+ `components`下所有组件的`index.vue`已在vite中配置了自动引用，组件名为目录名。使用时无需`import`
+ `vue, vue-router, pinia`已在vite中配置了自动引用，使用时无需`import`
+ `defineApi`已在vite中配置了自动引用，使用时无需`import`
+ `/api`和`/store`目录下的变量已在vite中配置了自动引用，使用时可直接使用`api`和`store`来引用。如`api.scene.getList`

## 开发前环境预备
+ 安装STANDARD.md中**插件安装**部分的VS插件
+ 安装`commitizen`
  `npm i commitizen -g`
+ `husky`配置
  `.git/config`文件中[core]下包含`hooksHusky = .husky`
+ 推荐使用`npm run commit`代替`git commit`

## 命令说明
使用本地mock服务时，需要先启动本地服务。   
本地运行： `npm run dev`
部署打包：`npm run build`
提交git：`npm run commit` 或 `npx cz`
本地服务：`npm run server`
docker打包: `npm run docker`

## API
+ mock/data.js 可在本地模拟API接口
  `npm run server` 启动模拟API服务
+ 本地使用vite.config.ts里配置proxy

## 其他说明
+ 使用`./src/hook/api`的`defineApi`接口定义api接口，支持使用Compoisition API方式定义接口，并支持智能提示
+ 使用`tailwind`提高CSS编写效率
+ 可使用`vue-request`提供API接口的扩展，如loading、error、防抖等

## components自定义组件
自定义通用组件存放在`/components`目录下
+ 每个组件一个目录
+ 组件名为目录命名，vite的`Auto Import`插件会自动导入，使用时无需`import`
+ 推荐提供组件demo和readme
+ /demo页面列出了所有组件的说明页
