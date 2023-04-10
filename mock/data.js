
module.exports = [
  {
    url: "/user/login",
    method: "get",
    data: {
      code: 0,
      data: {
        token: "463c37843fc78365f3d9e4c4ca7ba6c48d49dc53",
        name: "测试账号",
        username: "loginname"
      },
    },
  },
  {
    url: "/user/permissions",
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
    url: "/table/list",
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


