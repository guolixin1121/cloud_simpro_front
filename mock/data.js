
module.exports = [
  {
    url: "/user",
    method: "get",
    data: {
      code: 0,
      data: {
        token: "463c37843fc78365f3d9e4c4ca7ba6c48d49dc53",
        name: "测试账号",
        username: "loginname",
        permissions: [
          { title: '首页', path: '/home', icon: "AccountBookFilled"},
          { 
            title: '二级', 
            path: '/erji',
            children: [
              { title: '测试', path: '/test2' }
            ]
          }
        ]
      },
    },
  }
];


