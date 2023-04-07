# cloud_simpro_front 云仿真

## 分支说明
主分支

## 开发前环境预备
+ 安装STANDARD.md中**插件安装**部分的VS插件
+ 安装`commitizen`
  `npm i commitizen -g`
+ `husky`配置
  `.git/config`文件中[core]下包含`hooksHusky = .husky`
+ 推荐使用`npm run commit`代替`git commit`

## 命令说明
本地运行： `npm run dev`
部署打包：`npm run build`
提交git：`npm run commit` 或 `npx cz`
本地服务：`npm run server`

## API
+ mock/data.js 可在本地模拟API接口
  `npm run server` 启动模拟API服务
+ 本地使用vite.config.ts里配置proxy
+ 不同的环境，通过.env文件配置

## 其他说明
使用`./src/hook/api`的`defineApi`接口，支持使用Compoisition API方式定义接口，并支持智能提示
使用`vueuse`的Compoisition Utilities
使用`tailwind`提高CSS编写效率