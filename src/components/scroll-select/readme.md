# 支持分页查询的a-select  
除a-select自带属性外，新增以下属性

## 属性
### api
获取数据的api接口
> a-select原有的options属性优先级高于api
> options和api使用其中一个
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

