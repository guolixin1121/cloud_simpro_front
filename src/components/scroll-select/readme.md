# 支持分页查询的a-select  
兼容a-select的自带属性和事件，默认启动'搜索'   
除a-select自带属性外，新增以下属性

## 属性
### api
获取数据的api接口
+ a-select原有的options属性优先级高于api
+ options和api使用其中一个即可
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

