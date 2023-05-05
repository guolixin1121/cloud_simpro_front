# Table组件
除个别新增属性外，和a-table一样的属性和事件。

## 组件属性
### query
数据的查询字符串

### api
table获取数据的api接口，内置封装了分页及查询操作

### columns
封装了业务相关的列操作
+ 值为日期的列：含`time`或`date`的列，自动格式化为YYYY-MM-DD
``` javascript
  { 
    title: '创建时间', 
    dataIndex: 'create_time' // 显示为：2023-4-5 10:12:21
  }
```
+ 值为对象的列：显示对象的name或label自定义的属性的值
``` javascript
  { 
    title: '所属用户', 
    dataIndex: 'user' // 数据源: user: { id: '11021', name: 'Lisa'} => 显示为： Lisa
  }，
    { 
    title: '模型', 
    dataIndex: 'vehichle', // 数据源: vehichle: { id: '11021', display_name: 'Lisa'} => 显示为： Lisa
    label: 'display_name'
  }
```
+ 值为数组的列：显示每个数组项name或label自定义属性的值
```javascript
  { 
    title: '源', 
    dataIndex: 'sources_detail',  // 数据源： sources_detail: [{ id: 1, name: '国家' }]
  },
  { 
    title: '标签', 
    dataIndex: 'labels_detail',  // 数据源： labels_detail: [{ id: 1, display_name: '通用标签' }]
    label: 'display_name' // label='name'时可省略
  },
```
+ formatter： 通过column的formatter自定义格式化函数
``` javascript
  { 
    title: '场景来源', 
    dataIndex: 'adsSource', 
    formatter: getSceneSourceName  // 自定义格式函数
  }
```
+ 操作列的权限控制：编辑、删除从menus接口定义的权限、是否为创建者本人、定制的validate函数
```javascript
  {
    title: '操作',
    key: 'actions',
    actions: {  
      '运行': {
        validate: (data: any) => data.adsSource === 0,
        handler: (data: any) => console.log('need disable', data)
      },
      '查看': ( data: any ) => console.log('go to view page', data) ,
      '编辑': ( data: any ) => console.log('go to edit page', data) ,
      '删除': (data: any) => console.log('delete data after confirm', data)
    }
}
``` 

### isSelectable
是否包含选中列, 默认false

### isOnlyCreator
是否只允许创建者编辑和删除数据，默认false

### 事件
`onSelect`: 包含选中列时选中数据的回调
