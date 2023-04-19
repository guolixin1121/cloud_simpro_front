# 封装了搜索项表单
通过简单配置就可以得到搜索项表单   
**特性**
+ 支持ant design组件原有的所有属性

## 属性
1. items
表单项数组，记录每个项的组件类型、标签名称、数据props等      
组件类型为antdesign的a-xx中的xx，目前支持`input，select，range-picker`   
key为`date`时默认会返回`start_date, end_date`
``` javascript
// 列表搜索项
interface SearchFormItem {
  // search-form 属性
  label: string,  // display label
  key: string,   // data prop，与v-model对应
  type: string,  // ant design组件名称， a-xx 中的xx
  defaultValue?: any,
  
  // ant design 组件原有属性
  [key: string]: any // 支持和antd组件一样的属性
```

2. loading
当前页面是否正在加载数据，加载数据时按钮不可触发。用于避免多次频繁触发搜索按钮

## 事件
1. on-search
点击搜索按钮时触发
