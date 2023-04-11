# 封装了搜索项表单
通过简单配置就可以得到搜索项表单   

## 属性
1. items
表单项数组，记录每个项的组件类型、标签名称、数据props、可选项、默认值等      
组件类型为antdesign的a-xx中的xx，目前支持`input， select，range-picker`   
prop为`date`时默认会返回`start_date, end_date`
``` javascript
// 列表搜索项
interface SearchFormItem {
  label: string,  // display label
  prop: string,   // data prop
  type: string,   // a-xx中的xx，目前支持`input， select，range-picker`
  width?: string,
  default?: string, // default value
  options?: Object[], // when type == select
  placeholder?: string
}
```

2. loading
当前页面是否正在加载数据，加载数据时按钮不可触发。用于避免多次频繁触发搜索按钮

## 事件
1. on-search
点击搜索按钮时触发
