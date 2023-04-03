# cloud_simpro_front 云仿真

### 前言

在前端项目工程日益复杂的今天，一套完善的开发环境配置可以极大的提升开发效率，提高代码质量，方便多人合作，以及后期的项目迭代和维护
# 项目规范分： 
1.项目目录结构规范 
2.代码格式规范
3.git 提交规范

### 技术栈

vue3 + vue-router4 + vite4 + ant-design-vue4 + pinia + ts + eslint + prettier + husky + lint-staged + commitlint + pnpm + axios + iconfont + less

### 规范

## 1 代码格式规范和语法检测

1. vscode：统一前端编辑器。
2. editorconfig: 统一团队 vscode 编辑器默认配置。
3. prettier: 保存文件自动格式化代码。
4. eslint: 检测代码语法规范和错误。
5. lint-staged: 只检测暂存区文件代码，优化 eslint 检测速度。

## 2 代码 git 提交规范

1. husky:可以监听 githooks 执行，在对应 hook 执行阶段做一些处理的操作。
2. pre-commit：githooks 之一， 在 commit 提交前使用 tsc 和 eslint 对语法进行检测。
3. commit-msg：githooks 之一，在 commit 提交前对 commit 备注信息进行检测。
4. commitlint：在 githooks 的 pre-commit 阶段对 commit 备注信息进行检测。
5. commitizen：git 的规范化提交工具，辅助填写 commit 信息。

## 3 提交实例

# 1. git commit -m "feat: xxx"

'feat', // 新功能 feature
'fix', // 修复 bug
'docs', // 文档注释
'style', // 代码格式(不影响代码运行的变动)
'refactor', // 重构(既不增加新功能，也不是修复 bug)
'perf', // 性能优化
'test', // 增加测试
'chore', // 构建过程或辅助工具的变动
'revert', // 回退
'build' // 打包

# 2 git cz
git cz 代替 git commit 需要全局安装 pnpm i commitizen -g 
跟据提示执行即可

### 插件安装

1. 安装 vscode 插件 EditorConfig
2. 安装 vscode 插件 Prettier
3. 安装 vscode 插件 ESLint

### 目录结构

1. src 所有开发代码均需放在src目录下
2. api 存在各组件或模块的接口请求
3. assets 存在静态资源文件
4. common 存在业务公共组件
5. components 存在基础公共组件
6. hooks 存在公共hook
7. layerout 页面布局组件
8. router 页面路由组件
9. store 工程数据资源管理
10. utils 工具文件（包括封装的请求，所有的接口路径已经公共函数等）
11. views 项目路由组件

### vite 配置

1. 配置页面获取全局变量 process.env
2. 配置路径别名 src为@
3. 配置自动导入vue， vue-router， pinia中的api，页面无需再做引用
4. 配置ant 按需加载
5. 配置打包大文件拆分和静态资源分类打包
6. 本地下采用proxy代理方式
7. 支持gzip压缩  ng需要配盒
8. 可配置 cdn 加速
