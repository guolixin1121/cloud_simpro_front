# table
封装了每行数据查看、编辑、删除的操作及其权限检测，且默认包含选中列。   

## columns
**除了**下面的操作列外，和a-table的属性一样
``` javascript
{
    title: '操作',
    key: 'actions', // key为actions时表示此列为’查看、修改、删除‘，‘删除’增加了二次确认
    actions: {      // 定义’查看、修改、删除‘对应的函数
      view: () => router.push(`/test2`),
      edit: ( data: any ) => console.log(data) ,
      delete: (data: any) => console.log(data)
    }
}
``` 

## isSelectable
是否包含选中列, 默认true

## isOnlyCreator
是否只允许创建者编辑和删除数据，默认false

## 事件
`onSelect`: 包含选中列时选中数据的回调
