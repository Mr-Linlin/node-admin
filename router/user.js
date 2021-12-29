const express = require('express')

const router = express.Router()

const users = require('../server/userInfo')

const wechat = require('../router/wxuuid')

const secret = require('../server/secret_key')

const course = require('../server/courseInfo')

// 登录接口
router.post('/login', users.loginInfo)

// 获取随机的uuid接口
router.get('/getuid',wechat.getuuid)

// 接收uuid接口
router.get('/getInfo',wechat.getInfo)
// 获取七云token
router.get('/getQiniuToken',secret.qiniuToken)

router.get('/getCourseInfo', course.courseInfo)

router.get('/getCourseList', course.courseList)

module.exports = router