# 封装a-tree-select

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
自定义label、value字段
```javascript
  fieldNames: {
    type: Object as PropType<FieldName>,
    default: () => ({ label: 'name', value: 'id'})
  }
```

