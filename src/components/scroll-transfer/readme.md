# scroll-transfer  
支持分页，查询的穿梭框组件

## 属性
### titles
左右两侧列表的title，可以为空
``` javascript
 titles: {
    type: Array<string>,
    default: () => ['', '']
  },
```

### api
获取数据的api函数
``` javascript
  api: {
    type: Function
  },

```

### targetKeys
默认选中的值
``` javascript
  targetKeys: {
    type: Array<String>
  }

```

### fieldNames
自定义显示的label和value对应的api字段
``` javascript
  fieldNames: {
    type: Object as PropType<FieldNames>,
    default: () => ({ label: 'name', value: 'id'})
  }
```

