
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
                title: '表格及权限', 
                path: '/table', 
                actions: ['add', 'delete', 'edit']
             }
            ]
          },
          { 
            title: '二级', 
            path: '/erji',
            icon: 'AccountBookFilled',
            children: [
              { 
                title: '测试', 
                path: '/test2', 
                icon: 'AccountBookFilled',
                actions: ['add', 'delete', 'edit']
             }
            ]
          },
        ]
    }
  },
  {
    url: "/config/topmenu",
    method: "get",
    data: {
      code: 0,
      data: {
        '动力学': "http://www.baidu.com",
        'google': "http://www.google.com", 
      }
    }
  }
];


