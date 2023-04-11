
module.exports = [
  {
    url: "/auth/user_info",
    method: "get",
    data: {
      code: 0,
      data: {
        mickname: "测试账号",
        username: "loginname"
      },
    },
  },
  {
    url: "/menus",
    method: "get",
    data: {
      code: 0,
      data: [
          { title: '首页', path: '/home', icon: "AccountBookFilled", actions: ['delete']},
          { 
            title: 'Demo', 
            path: '/demo',
            icon: 'AccountBookFilled',
            children: [
              { 
                title: '搜素、表格及权限', 
                path: '/table', 
                actions: ['add', 'delete', 'edit']
             },
             { 
                title: 'ICON', 
                path: '/icon', 
              }
            ]
          }
        ]
    }
  },
  {
    url: "/config/topmenu",
    method: "get",
    data: {
      code: 0,
      data: {
        '顶部导航一': "http://www.baidu.com",
        '顶部导航二': "http://www.google.com", 
      }
    }
  },
  {
    url: "/scene/scene/",
    method: "get",
    data: {
      code: 0,
      data: [
        {
          key: '1',
          name: '胡彦斌',
          age: 12,
          address: '西湖区湖底公园1号',
        },
        {
          key: '2',
          name: '胡彦祖',
          age: 42,
          address: '西湖区湖底公园1号',
        },
      ]
    }
  }
];


