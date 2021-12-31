const rights = [
    {
        id: 111,
        title: '用户管理',
        icon: "el-icon-menu",
        children: [{ name: 'userInfo', title: '用户列表', path: 'user', component: 'user', icon: "el-icon-s-tools" }]
    },
    {
        id: 113,
        title: '角色管理',
        icon: "el-icon-loading",
        children: [{ name: 'permission', title: '角色列表', path: 'permission', component: 'home', icon: "el-icon-s-tools" }]

    },
    {
        id: 114,
        title: 'Excel管理',
        icon: "el-icon-s-finance",
        children: [{ name: 'excel', title: '上传 Excel表', path: 'excel', component: 'home', icon: "el-icon-s-tools" }]

    },
    {
        id: 115,
        title: '课程相关',
        icon: "el-icon-document-copy",
        children: [
            { name: 'couresInfo', title: '课程管理', path: 'course', icon: "el-icon-document-copy" },
            { name: 'uploadVideo', title: '上传视频', path: 'uploadvideo', icon: "el-icon-upload2" },
            { name: 'courseList', title: '课程中心', path: 'courseList', icon: "el-icon-s-home" },
            { name: 'myCourse', title: '我的课程', path: 'myCourse', icon: "el-icon-s-home" },
        ]

    },
    {
        id: 116,
        title: '试卷管理',
        icon: "el-icon-postcard",
        children: [
            { name: 'exam', title: '试卷列表', path: 'exam', icon: "el-icon-postcard" },
            { name: 'examCenter', title: '试卷中心', path: 'examCenter', icon: "el-icon-s-home" },
        ]

    },
    {
        id: 118,
        title: '成绩管理',
        icon: "el-icon-postcard",
        children: [
            { name: 'examGrades', title: '我的成绩', path: 'examGrades', icon: "el-icon-postcard" }
        ]

    },
    {
        id: 117,
        title: '订单管理',
        icon: "el-icon-postcard",
        children: [
            { name: 'shopcar', title: '购物车', path: 'shopcar', icon: "el-icon-postcard" },
            { name: 'orders', title: '我的订单', path: 'orders', icon: "el-icon-postcard" },
        ]

    },
]
const rightList = [
    {
        id: 118,
        title: '考试管理',
        icon: "el-icon-postcard",
        children: [
            { name: 'examGrades', title: '我的成绩', path: 'examGrades', icon: "el-icon-postcard" },
            { name: 'examCenter', title: '试卷中心', path: 'examCenter', icon: "el-icon-s-home" },
        ]

    },

]
module.exports = { rights, rightList }
