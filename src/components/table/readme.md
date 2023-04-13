# table
封装了每行数据查看、编辑、删除的操作及其权限检测，且默认包含选中列。   

## columns
+ key='actions'表示操作列，组件对编辑、删除操作做了权限判断
+ 其他column和ant design的column一样
``` javascript
{
    title: '操作',
    key: 'actions',
    actions: {  
      '运行': ( data: any ) => console.log('run', data),
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
