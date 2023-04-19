
module.exports = [
  {
    url: "/auth/login/",
    method: "post",
    data: {
      code: 0,
      data: {
        token: '123456'
      },
    },
  },
  {
    url: "/auth/user_info/",
    method: "get",
    data: {
      code: 0,
      data: {
        nickname: "测试账号",
        username: "admin"
      },
    },
  },
  {
    url: "/menus/",
    method: "get",
    data: {
      code: 0,
      data: [
          { title: '场景管理', path: '/scene/', icon: "scene", actions: ['view', 'add', 'edit', 'delete']},
          { 
            title: 'Demo', 
            path: '/demo',
            icon: 'AccountBookFilled',
            children: [
              { 
                title: '搜素、表格及权限', 
                path: '/demo/list', 
                actions: ['add', 'delete', 'edit']
             },
             { 
                title: 'ICON', 
                path: '/demo/icon', 
              }
            ]
          }
        ]
    }
  },
  {
    url: "/menus/top/",
    method: "get",
    data: {
      code: 0,
      data: [
        // {title: '顶部菜单一', path: 'http://www.baidu.com'},
        // {title: '顶部菜单二', path: 'http://www.baidu.com'},
      ]
    }
  },
  {
    url: "/scene/scenes/",
    method: "get",
    data: {
      code: 0,
      data: {
        count: 3,
        results: [
        {
          id: '1',
          adsName: '胡彦斌'
        },
        {
          id: '2',
          adsName: '胡彦祖'
        }
      ]}
    }
  },
  {
    url: "/tags/",
    method: "get",
    data: {
      code: 0,
      data: {
        count: 3,
        results: [
        {
          id: '1',
          display_name: '广汽'
        },
        {
          id: '2',
          display_name: '赛目'
        }
      ]}
    }
  }
];


