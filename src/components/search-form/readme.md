# 封装了搜索项表单
通过简单配置就可以得到搜索项表单   
支持ant design组件原有的所有属性

### items
表单项数组，记录每个项的组件类型、标签名称、数据props等      
组件类型为`ant design`的`a-xx`中的**xx**   
key为`create_time`时默认会返回`start_date, end_date`
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

### query: Object

### manual: Boolean
是否手动触发首次搜索，默认 false

### search： Event
点击搜索按钮时触发

```
<search-form :items="formItems" @search="onSearch"></search-form>
const formItems = ref<SearchFormItem[]>([
  { label: '名称', key: 'name', type: 'input', placeholder: '请输入算法名称' },
  { label: '控制在环', key: 'is_in_ring', type: 'select', 
    options: [{ label: '是' , value: 1 }, { label: '否', value: 0 }],
    defaultValue: ''
  },
  {
    label: '类别',
    key: 'category',
    type: 'tree-select',
    api: currentApi.getTypes,
    fieldNames: { label: 'title', value: 'id' },
    defaultValue: ''
  },
  { label: '创建者', key: 'username', type: 'input', placeholder: '请输入创建者' },
])
```
