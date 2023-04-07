# table
封装了action及action权限检测，且默认包含选中列。   
除了以下自定义的内容之前，都和a-table一致   

## columns操作列定义
``` javascript
{
    title: '操作',
    key: 'actions', // key为actions时表示’查看、修改、删除‘的操作，‘删除’增加了二次确认
    actions: {      // 定义’查看、修改、删除‘对应的函数
      view: () => router.push(`/test2`),
      edit: ( data: any ) => console.log(data) ,
      delete: (data: any) => console.log(data)
    }
}
``` 

## isSelectable
是否包含选中列

## 事件
`onSelect`: 包含选中列时选中数据的回调