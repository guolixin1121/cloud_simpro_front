# 封装a-tree-select
支持分页，查询的TreeSelect组件

## 属性
### api
获取数据的api接口
```javascript
{
  'api': {
    type: Function
  }
}
```

### filedNames
options中`label、value`在api返回值中对应的字段，默认为`name、id`
```javascript
  fieldNames: {
    type: Object as PropType<FieldName>,
    default: () => ({ label: 'name', value: 'id'})
  }
```

### checkLeaf
是否判断仅叶子节点可选中，默认为true。   
开启时，返回值中需要有isLeaf字段

### v-model:selectNode
选中的树节点

