# table
对ant design table进行二次封装
+ 操作列的权限控制：编辑、删除从menus接口定义的权限、是否为创建者本人、定制的validate函数
+ 值为日期的列：格式化为YYYY-MM-DD
+ 值为对象的列：显示对象的name或label自定义的属性的值
+ 值为数组的列：蓝色字体显示每个数组项name或label自定义属性的值
+ formatter： 通过column的formatter自定义格式化函数

## columns
+ key='actions'表示操作列，组件对编辑、删除操作做了权限判断
+ 其他column和ant design的column一样
``` javascript
 {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: '名称',
    dataIndex: 'adsName'
  },
  
  { 
    title: '场景来源', 
    dataIndex: 'adsSource', 
    formatter: getSceneSourceName  // 自定义格式函数
  },
  { 
    title: '标签', 
    dataIndex: 'labels_detail', 
    label: 'display_name' // label='name'时可省略
  },
  {
    title: '操作',
    key: 'actions',
    actions: {  
      '查看': ( data: any ) => console.log('go to view page', data) ,
      '编辑': ( data: any ) => console.log('go to edit page', data) ,
      '删除': (data: any) => console.log('delete data after confirm', data)
    }
}
``` 

## isSelectable
是否包含选中列, 默认false

## isOnlyCreator
是否只允许创建者编辑和删除数据，默认false

## 事件
`onSelect`: 包含选中列时选中数据的回调
